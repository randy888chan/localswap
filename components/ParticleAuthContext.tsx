'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  particleAuth,
  handleLogin as particleHandleLogin,
  handleLogout as particleHandleLogout,
  getUserInfo as particleGetUserInfo,
  particleConnect,
  connectWallet as particleConnectWallet,
  disconnectWallet as particleDisconnectWallet,
  openWallet as particleOpenWallet
} from '../lib/particle';
import type { UserInfo } from '@particle-network/auth';
import type { Accounts } from '@particle-network/connect';


interface ParticleAuthContextType {
  userInfo: UserInfo | null;
  walletAccounts: Accounts | null;
  isLoadingAuth: boolean; // Renamed for clarity
  isLoadingWallet: boolean;
  login: (authType: 'email' | 'google' | 'twitter' | 'discord' | 'github' | 'linkedin' | 'apple' | 'facebook') => Promise<UserInfo | null | undefined>;
  logout: () => Promise<void>;
  connectWallet: (preferredWalletType?: 'particle' | 'metaMask' | 'walletconnect') => Promise<Accounts | null | undefined>;
  disconnectWallet: () => Promise<void>;
  openWallet: () => void;
}

const ParticleAuthContext = createContext<ParticleAuthContextType | undefined>(undefined);

export const ParticleAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [walletAccounts, setWalletAccounts] = useState<Accounts | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false); // Separate loading for wallet actions
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (!authInitialized) {
      const initAuth = async () => {
        setIsLoadingAuth(true);
        try {
          const user = particleGetUserInfo();
          if (user) {
            setUserInfo(user);
            // Check if already connected to a wallet (e.g. from previous session with Particle Connect)
            // Particle Connect might manage its own connection persistence.
            // For simplicity, we'll require explicit connect action for now.
            // If Particle Connect auto-connects, this could be updated.
            if (particleConnect.particle && particleConnect.particle.walletType) { // Check if a wallet is connected via Particle Connect
                 const accounts = await particleConnect.request({ method: 'eth_accounts' });
                 if (accounts && accounts.length > 0) {
                    setWalletAccounts(accounts as Accounts);
                 }
            }
          }
        } catch (error) {
          console.error("Error fetching user info on initial load:", error);
        } finally {
          setIsLoadingAuth(false);
          setAuthInitialized(true);
        }
      };
      initAuth();
    }
  }, [authInitialized]);

  const login = async (authType: 'email' | 'google' | 'twitter' | 'discord' | 'github' | 'linkedin' | 'apple' | 'facebook') => {
    setIsLoadingAuth(true);
    try {
      const user = await particleHandleLogin(authType);
      setUserInfo(user);
      // After login, if using Particle's embedded wallet, it might be implicitly connected.
      // Check and set walletAccounts if Particle provides this info post-login.
      if (user && particleConnect.particle && particleConnect.particle.walletType === 'particle') {
        const accounts = await particleConnect.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
           setWalletAccounts(accounts as Accounts);
        }
      }
      return user;
    } catch (error) {
      setUserInfo(null);
      setWalletAccounts(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    setIsLoadingWallet(true); // Wallet actions might be affected
    try {
      await particleDisconnectWallet(); // Disconnect wallet first
      await particleHandleLogout();   // Then logout from Particle Auth
      setUserInfo(null);
      setWalletAccounts(null);
    } catch (error) {
      // Error logged in handlers
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingWallet(false);
    }
  };

  const connectWallet = async (preferredWalletType?: 'particle' | 'metaMask' | 'walletconnect') => {
    if (!userInfo) {
        // Optionally, could trigger login here or show a message
        console.warn("User not logged in. Please login before connecting a wallet.");
        // return null; // Or throw an error, or trigger login UI
    }
    setIsLoadingWallet(true);
    try {
      const accounts = await particleConnectWallet(preferredWalletType);
      setWalletAccounts(accounts || null); // Ensure it's null if undefined
      return accounts;
    } catch (error) {
      setWalletAccounts(null);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const disconnectWallet = async () => {
    setIsLoadingWallet(true);
    try {
      await particleDisconnectWallet();
      setWalletAccounts(null);
    } catch (error) {
      // Error logged in handler
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const openWallet = () => {
      if (userInfo && walletAccounts) { // Only open if logged in and wallet connected
          particleOpenWallet();
      } else {
          console.warn("User not logged in or wallet not connected. Cannot open wallet UI.");
          // Optionally trigger login/connect here
      }
  };

  return (
    <ParticleAuthContext.Provider value={{
      userInfo,
      walletAccounts,
      isLoadingAuth,
      isLoadingWallet,
      login,
      logout,
      connectWallet,
      disconnectWallet,
      openWallet
    }}>
      {children}
    </ParticleAuthContext.Provider>
  );
};

export const useParticleAuth = () => {
  const context = useContext(ParticleAuthContext);
  if (context === undefined) {
    throw new Error('useParticleAuth must be used within a ParticleAuthProvider');
  }
  return context;
};
