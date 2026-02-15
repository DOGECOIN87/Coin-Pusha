import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

/**
 * Solana service for managing wallet connections, RPC calls, and transactions.
 * Configured for Gorbagana testnet (SOL_DEVNET_ADDR environment).
 */

export interface SolanaConfig {
  rpcUrl: string;
  programId: string;
  cluster: 'devnet' | 'testnet' | 'mainnet' | 'gorbagana';
}

export interface WalletState {
  publicKey: PublicKey | null;
  isConnected: boolean;
  signer: any | null;
}

export interface TransactionResult {
  signature: string;
  confirmed: boolean;
  error?: string;
}


let connection: Connection | null = null;
let config: SolanaConfig | null = null;
let walletState: WalletState = {
  publicKey: null,
  isConnected: false,
  signer: null,
};

/**
 * Initialize Solana service with configuration
 */
export function initializeSolana(cfg: SolanaConfig): void {
  config = cfg;
  connection = new Connection(cfg.rpcUrl, 'confirmed');
}

/**
 * Connect wallet to dApp
 */
export async function connectWallet(signer: any): Promise<WalletState> {
  try {
    if (!signer) {
      throw new Error('No signer provided');
    }

    const publicKey = typeof signer.publicKey === 'string' 
      ? new PublicKey(signer.publicKey)
      : signer.publicKey;
    
    walletState = {
      publicKey,
      isConnected: true,
      signer,
    };

    return walletState;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export function disconnectWallet(): void {
  walletState = {
    publicKey: null,
    isConnected: false,
    signer: null,
  };
}

/**
 * Get current wallet state
 */
export function getWalletState(): WalletState {
  return { ...walletState };
}

/**
 * Get balance of connected wallet
 */
export async function getBalance(address?: Address): Promise<number> {
  if (!solanaRpc) throw new Error('Solana service not initialized');
  
  const target = address || walletState.publicKey;
  if (!target) throw new Error('No address provided and wallet not connected');

  try {
    const balance = await solanaRpc.getBalance(target).send();
    return balance.value;
  } catch (error) {
    console.error('Failed to get balance:', error);
    throw error;
  }
}

/**
 * Sign a transaction with connected wallet
 */
export async function signTransaction(transactionBytes: Uint8Array): Promise<Uint8Array> {
  if (!walletState.signer) {
    throw new Error('Wallet not connected');
  }

  try {
    // Wallet adapter will handle signing
    const signature = await walletState.signer.sign(transactionBytes);
    return signature;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}

/**
 * Send and confirm a signed transaction
 */
export async function sendTransaction(transactionBytes: Uint8Array): Promise<TransactionResult> {
  if (!solanaRpc) throw new Error('Solana service not initialized');

  try {
    // Sign transaction with wallet
    const signature = await signTransaction(transactionBytes);

    // Send transaction to the network
    const result = await solanaRpc.sendTransaction(transactionBytes).send();

    // Wait for confirmation
    const confirmed = await solanaRpc
      .getSignatureStatuses([result])
      .send();

    return {
      signature: result,
      confirmed: confirmed.value[0]?.confirmationStatus === 'confirmed' || confirmed.value[0]?.confirmationStatus === 'finalized',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send transaction:', error);
    return {
      signature: '',
      confirmed: false,
      error: message,
    };
  }
}

/**
 * Get program configuration
 */
export function getProgramConfig(): SolanaConfig {
  if (!config) {
    throw new Error('Solana service not initialized');
  }
  return { ...config };
}

/**
 * Check if wallet is connected
 */
export function isWalletConnected(): boolean {
  return walletState.isConnected && walletState.publicKey !== null;
}

export default {
  initializeSolana,
  connectWallet,
  disconnectWallet,
  getWalletState,
  getBalance,
  signTransaction,
  sendTransaction,
  getProgramConfig,
  isWalletConnected,
};
