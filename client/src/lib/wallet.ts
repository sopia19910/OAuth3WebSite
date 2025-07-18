import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface NetworkInfo {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export interface BalanceInfo {
  raw: string;
  formatted: string;
}

// Storage keys
const WALLET_STORAGE_KEY = 'oauth3_wallet';
const NETWORK_STORAGE_KEY = 'oauth3_network';

// Default network configuration (Holesky Testnet)
const DEFAULT_NETWORK: NetworkInfo = {
  name: 'Holesky Testnet',
  chainId: 17000,
  rpcUrl: 'https://ethereum-holesky.publicnode.com',
  explorerUrl: 'https://holesky.etherscan.io'
};

// Get RPC provider
export function getRpcProvider(): ethers.JsonRpcProvider {
  const network = getNetworkInfo();
  return new ethers.JsonRpcProvider(network.rpcUrl);
}

// Create a new wallet
export function createWallet(): WalletInfo {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey
  };
}

// Import wallet from private key
export function importWallet(privateKey: string): WalletInfo {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };
  } catch (error) {
    throw new Error('Invalid private key format');
  }
}

// Save wallet to local storage
export function saveWalletToStorage(wallet: WalletInfo): void {
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
}

// Get wallet from local storage
export function getWalletFromStorage(): WalletInfo | null {
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse stored wallet:', error);
    return null;
  }
}

// Clear wallet from storage
export function clearWalletFromStorage(): void {
  localStorage.removeItem(WALLET_STORAGE_KEY);
}

// Get wallet balance
export async function getWalletBalance(address: string): Promise<BalanceInfo> {
  try {
    const provider = getRpcProvider();
    const balance = await provider.getBalance(address);
    const formatted = ethers.formatEther(balance);
    
    return {
      raw: balance.toString(),
      formatted: parseFloat(formatted).toFixed(4)
    };
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    return {
      raw: '0',
      formatted: '0.0000'
    };
  }
}

// Get network info
export function getNetworkInfo(): NetworkInfo {
  const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored network:', error);
    }
  }
  return DEFAULT_NETWORK;
}

// Save network info
export function saveNetworkInfo(network: NetworkInfo): void {
  localStorage.setItem(NETWORK_STORAGE_KEY, JSON.stringify(network));
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get transaction by hash
export async function getTransaction(hash: string) {
  try {
    const provider = getRpcProvider();
    return await provider.getTransaction(hash);
  } catch (error) {
    console.error('Failed to get transaction:', error);
    return null;
  }
}

// Wait for transaction confirmation
export async function waitForTransaction(hash: string, confirmations: number = 1) {
  try {
    const provider = getRpcProvider();
    return await provider.waitForTransaction(hash, confirmations);
  } catch (error) {
    console.error('Failed to wait for transaction:', error);
    return null;
  }
}