import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  privateKey: string;
}

export interface WalletBalance {
  eth: string;
  formatted: string;
}

// Cache for RPC URL
let cachedRpcUrl: string | null = null;

// Get RPC URL from backend
async function getRpcUrl(chainId?: string): Promise<string> {
  // Don't use cache if a specific chainId is requested
  if (!chainId && cachedRpcUrl) {
    return cachedRpcUrl;
  }

  try {
    const url = chainId ? `/api/config?chainId=${chainId}` : '/api/config';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.rpcUrl) {
      // Only cache if no specific chainId was requested
      if (!chainId) {
        cachedRpcUrl = data.rpcUrl;
      }
      return data.rpcUrl;
    }
  } catch (error) {
    console.error('Failed to fetch RPC URL:', error);
  }

  // No fallback - require active chain in database
  throw new Error('No active chain configured in database');
}

// Create a new random wallet
export function createWallet(): WalletInfo {
  try {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
}

// Import wallet from private key
export function importWallet(privateKey: string): WalletInfo {
  try {
    // Remove 0x prefix if present
    const cleanKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    const wallet = new ethers.Wallet(cleanKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  } catch (error) {
    console.error('Error importing wallet:', error);
    throw new Error('Invalid private key');
  }
}

// Get wallet balance (requires provider)
export async function getWalletBalance(address: string, provider?: ethers.Provider): Promise<WalletBalance> {
  let retries = 3;
  let lastError: any;
  
  while (retries > 0) {
    try {
      // Use provided provider or create one with RPC URL
      let ethProvider = provider;
      if (!ethProvider) {
        const rpcUrl = await getRpcUrl();
        console.log('🌐 Using RPC URL:', rpcUrl);
        ethProvider = new ethers.JsonRpcProvider(rpcUrl);
      }

      // Set a timeout for the balance request
      const balancePromise = ethProvider.getBalance(address);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance request timeout')), 10000)
      );
      
      const balance = await Promise.race([balancePromise, timeoutPromise]) as bigint;
      const formatted = ethers.formatEther(balance);

      console.log(`💰 Balance for ${address}: ${formatted} ETH`);

      return {
        eth: balance.toString(),
        formatted: formatted
      };
    } catch (error: any) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.warn(`Balance fetch attempt failed, ${retries} retries left:`, error.message);
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.error('Error getting balance after all retries:', lastError);
  throw lastError;  // Re-throw to let caller handle the error
}

// Store wallet info in localStorage (encrypted in production)
export function saveWalletToStorage(wallet: WalletInfo): void {
  // In production, this should be encrypted
  localStorage.setItem('oauth3_wallet', JSON.stringify(wallet));
}

// Retrieve wallet from localStorage
export function getWalletFromStorage(): WalletInfo | null {
  try {
    const stored = localStorage.getItem('oauth3_wallet');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving wallet:', error);
    return null;
  }
}

// Clear wallet from storage
export function clearWalletFromStorage(): void {
  localStorage.removeItem('oauth3_wallet');
}

// Get an Ethereum provider instance
export async function getProvider(chainId?: string): Promise<ethers.JsonRpcProvider> {
  const rpcUrl = await getRpcUrl(chainId);
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Get network information
export async function getNetworkInfo(): Promise<{ name: string; chainId: number }> {
  try {
    const provider = await getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: Number(network.chainId)
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      name: 'Unknown',
      chainId: 0
    };
  }
}

// Get ERC20 token balance
export async function getTokenBalance(
  tokenAddress: string, 
  walletAddress: string, 
  chainId?: string
): Promise<{ balance: string; formatted: string; decimals: number }> {
  try {
    const provider = await getProvider(chainId);
    
    // ERC20 ABI for balanceOf and decimals
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    
    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals()
    ]);
    
    const formatted = ethers.formatUnits(balance, decimals);
    
    return {
      balance: balance.toString(),
      formatted,
      decimals
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    // Return zero balance on error
    return {
      balance: '0',
      formatted: '0',
      decimals: 18
    };
  }
}