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
async function getRpcUrl(): Promise<string> {
  if (cachedRpcUrl) {
    return cachedRpcUrl;
  }

  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.rpcUrl) {
      cachedRpcUrl = data.rpcUrl;
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
  try {
    // Use provided provider or create one with RPC URL
    let ethProvider = provider;
    if (!ethProvider) {
      const rpcUrl = await getRpcUrl();
      console.log('🌐 Using RPC URL:', rpcUrl);
      ethProvider = new ethers.JsonRpcProvider(rpcUrl);
    }

    const balance = await ethProvider.getBalance(address);
    const formatted = ethers.formatEther(balance);

    console.log(`💰 Balance for ${address}: ${formatted} ETH`);

    return {
      eth: balance.toString(),
      formatted: formatted
    };
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;  // Re-throw to let caller handle the error
  }
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
export async function getProvider(): Promise<ethers.JsonRpcProvider> {
  const rpcUrl = await getRpcUrl();
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