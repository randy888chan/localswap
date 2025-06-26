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
          const user = particleGetUserInfo(); // This gets from Particle Auth SDK (social/email login)
          if (user) {
            setUserInfo(user);
            // If user is logged in via Particle Auth, their embedded wallet is the primary one initially.
            // Extract the EVM address from userInfo.wallets
            const embeddedEvmWallet = user.wallets?.find(w => w.chain_name.toLowerCase() === 'evm_chain'); // Particle uses 'evm_chain' for generic EVM
            if (embeddedEvmWallet) {
              setWalletAccounts([embeddedEvmWallet.public_address]);
            }

            // Then, check if an external wallet is already connected via Particle Connect (e.g. persisted session)
            if (particleConnect.particle && particleConnect.particle.walletType && particleConnect.particle.walletType !== 'particle') {
                 const connectedExternalAccounts = await particleConnect.request({ method: 'eth_accounts' });
                 if (connectedExternalAccounts && connectedExternalAccounts.length > 0) {
                    setWalletAccounts(connectedExternalAccounts as Accounts);
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
    setWalletAccounts(null); // Reset wallet accounts on new login
    try {
      const user = await particleHandleLogin(authType);
      setUserInfo(user);
      if (user) {
        // Upon social/email login, the embedded wallet is the default.
        // Particle's UserInfo object has a `wallets` array.
        // We should find the EVM compatible wallet address here.
        // Example: { uuid: '...', token: '...', wallets: [{uuid:'...', chain_name:'evm_chain', public_address:'0x...'}] }
        const embeddedEvmWallet = user.wallets?.find(w => w.chain_name.toLowerCase() === 'evm_chain');
        if (embeddedEvmWallet) {
          setWalletAccounts([embeddedEvmWallet.public_address]);
        } else {
          // Fallback or try to get from particleConnect if it auto-connects the 'particle' wallet type
          const particleWalletAccounts = await particleConnect.request({ method: 'eth_accounts' });
            if (particleWalletAccounts && particleWalletAccounts.length > 0 && particleConnect.particle?.walletType === 'particle') {
                setWalletAccounts(particleWalletAccounts as Accounts);
            } else {
                console.warn("EVM wallet address not found in userInfo after login.");
            }
        }
      }
      return user;
    } catch (error) {
      console.error('Login failed in context:', error);
      setUserInfo(null);
      setWalletAccounts(null);
      // Re-throw or handle error as needed by UI
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    setIsLoadingWallet(true);
    try {
      // Attempt to disconnect any external wallet first
      if (particleConnect.particle && particleConnect.particle.walletType && particleConnect.particle.walletType !== 'particle') {
        await particleDisconnectWallet();
      }
      await particleHandleLogout(); // Logout from Particle Auth (social/email)
      setUserInfo(null);
      setWalletAccounts(null);
    } catch (error) {
      console.error('Logout failed in context:', error);
      // Still reset state even if one part of logout fails
      setUserInfo(null);
      setWalletAccounts(null);
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingWallet(false);
    }
  };

  const connectWallet = async (preferredWalletType?: 'particle' | 'metaMask' | 'walletconnect') => {
    // If user is not logged in via Particle Auth, connecting an external wallet doesn't require Particle Auth login.
    // Particle Connect can work independently for external wallets.
    // However, our app flow might prefer user to be "logged in" to the app first.
    // For now, this allows connecting external wallet even if not Particle Auth logged in.
    // If `preferredWalletType === 'particle'`, it implies using the embedded wallet, which requires Particle Auth login.

    if (preferredWalletType === 'particle' && !userInfo) {
        console.warn("Particle wallet type selected, but user is not logged in via Particle Auth. Please login first.");
        // Could trigger login UI here.
        return null;
    }

    setIsLoadingWallet(true);
    try {
      // `particleConnectWallet` from lib/particle.ts handles the actual connection logic
      const accounts = await particleConnectWallet(preferredWalletType);
      setWalletAccounts(accounts || null);
      // If connecting the 'particle' wallet type successfully, and userInfo is present,
      // ensure consistency or update userInfo if needed (though connect usually doesn't return full UserInfo)
      if (preferredWalletType === 'particle' && userInfo && accounts && accounts.length > 0) {
        const embeddedEvmWallet = userInfo.wallets?.find(w => w.chain_name.toLowerCase() === 'evm_chain');
        if (!embeddedEvmWallet || embeddedEvmWallet.public_address !== accounts[0]) {
            console.warn("Particle wallet connected, but address differs from userInfo.wallets. Prioritizing connect() result.");
        }
      }
      return accounts;
    } catch (error) {
      console.error('Connect wallet failed in context:', error);
      setWalletAccounts(null);
      throw error;
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const disconnectWallet = async () => {
    setIsLoadingWallet(true);
    try {
      await particleDisconnectWallet(); // This disconnects external wallets via Particle Connect

      // After external disconnect, if user is still logged in via Particle Auth,
      // set walletAccounts to their embedded wallet. Otherwise, clear it.
      const currentUserInfo = particleGetUserInfo(); // Re-fetch or use state userInfo
      if (currentUserInfo) {
        const embeddedEvmWallet = currentUserInfo.wallets?.find(w => w.chain_name.toLowerCase() === 'evm_chain');
        if (embeddedEvmWallet) {
          setWalletAccounts([embeddedEvmWallet.public_address]);
        } else {
          setWalletAccounts(null); // Should not happen if userInfo is valid
        }
      } else {
        setWalletAccounts(null);
      }
    } catch (error) {
      console.error('Disconnect wallet failed in context:', error);
      // Even on error, try to reset to a sane state
      const currentUserInfo = particleGetUserInfo();
      if (currentUserInfo) {
        const embeddedEvmWallet = currentUserInfo.wallets?.find(w => w.chain_name.toLowerCase() === 'evm_chain');
        setWalletAccounts(embeddedEvmWallet ? [embeddedEvmWallet.public_address] : null);
      } else {
        setWalletAccounts(null);
      }
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const openWallet = () => {
    // Open Particle Wallet UI. This works if user is logged in (for embedded wallet)
    // or if an external wallet is connected through Particle Connect's adapter.
    if (userInfo || (particleConnect.particle && particleConnect.particle.walletType)) {
        particleOpenWallet();
    } else {
        console.warn("Cannot open wallet UI. User not logged in and no external wallet connected via Particle.");
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
