import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Address, Signer } from '@solana/kit';
import * as SolanaService from '../services/solanaService';

interface WalletContextType {
  publicKey: Address | null;
  isConnected: boolean;
  isLoading: boolean;
  balance: number | null;
  connectWallet: (signer: Signer) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<Address | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Initialize Solana service on mount
  useEffect(() => {
    try {
      const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
      const programId = (import.meta.env.VITE_SOLANA_PROGRAM_ID || '') as Address;
      const cluster = (import.meta.env.VITE_SOLANA_CLUSTER || 'devnet') as 'devnet' | 'testnet' | 'mainnet' | 'gorbagana';

      SolanaService.initializeSolana({
        rpcUrl,
        programId,
        cluster,
      });

      // Check for previously connected wallet in localStorage
      const savedPublicKey = localStorage.getItem('solana_pubkey');
      if (savedPublicKey) {
        setPublicKey(savedPublicKey as Address);
        setIsConnected(true);
        refreshBalance(savedPublicKey as Address);
      }
    } catch (error) {
      console.error('Failed to initialize Solana service:', error);
    }
  }, []);

  const connectWallet = async (signer: Signer) => {
    try {
      setIsLoading(true);
      const state = await SolanaService.connectWallet(signer);
      
      if (state.publicKey && state.isConnected) {
        setPublicKey(state.publicKey);
        setIsConnected(true);
        localStorage.setItem('solana_pubkey', state.publicKey);
        
        // Refresh balance after connection
        await refreshBalance(state.publicKey);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    SolanaService.disconnectWallet();
    setPublicKey(null);
    setIsConnected(false);
    setBalance(null);
    localStorage.removeItem('solana_pubkey');
  };

  const refreshBalance = async (address?: Address) => {
    try {
      const target = address || publicKey;
      if (!target) return;

      const balanceLamports = await SolanaService.getBalance(target);
      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      setBalance(balanceLamports / 1e9);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected,
        isLoading,
        balance,
        connectWallet,
        disconnectWallet,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletProvider;
