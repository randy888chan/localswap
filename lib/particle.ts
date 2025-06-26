import { ParticleAuth } from '@particle-network/auth';
import { ParticleConnect } from '@particle-network/connect';
import { EthereumGoerli } from '@particle-network/chains';

// TODO: User needs to replace these with their actual Particle Network project credentials
const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID || 'YOUR_PARTICLE_PROJECT_ID';
const PARTICLE_CLIENT_KEY = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY || 'YOUR_PARTICLE_CLIENT_KEY';
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID || 'YOUR_PARTICLE_APP_ID';

const particleCommonConfig = {
  projectId: PARTICLE_PROJECT_ID,
  clientKey: PARTICLE_CLIENT_KEY,
  appId: PARTICLE_APP_ID,
};

export const particleAuth = new ParticleAuth(particleCommonConfig);

export const particleConnect = new ParticleConnect({
  ...particleCommonConfig,
  chainName: EthereumGoerli.name, // Default chain for connect, can be different or dynamic
  chainId: EthereumGoerli.id,
  wallet: { // Optional: Wallet UI configuration for Particle Connect
    displayWalletEntry: true,
    defaultWalletEntryPosition: 'bottom-right',
    uiMode: 'dark', // or 'light'
    supportChains: [{ id: EthereumGoerli.id, name: EthereumGoerli.name }], // Example
    customStyle: {}, // Optional: further customize UI
  }
});


export const handleLogin = async (preferredAuthType: 'email' | 'phone' | 'google' | 'twitter' | 'discord' | 'github' | 'linkedin' | 'apple' | 'facebook') => {
  try {
    const userInfo = await particleAuth.login({ preferredAuthType });
    console.log('Logged in user:', userInfo);
    // Store userInfo in state or context
    return userInfo;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await particleAuth.logout();
    console.log('User logged out');
    // Clear user info from state or context
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getUserInfo = () => {
  return particleAuth.getUserInfo();
};

// Particle Connect specific functions
export const connectWallet = async (preferredWalletType?: 'particle' | 'metaMask' | 'walletconnect' | 'rainbow' | 'trust' | 'imtoken' | 'bitkeep') => {
  try {
    if (!particleAuth.getUserInfo()) {
      // Prefer to login first, though connect can also trigger login
      // Depending on UX, might want to prompt login before connecting a wallet
      // Or, allow connect to initiate a social login if user is not yet authenticated.
      // For now, let's assume login happens first or connect handles it.
      console.log("User not logged in. Connect might prompt login.");
    }
    const accounts = await particleConnect.connect({ preferredAuthType: preferredWalletType });
    console.log('Connected wallet accounts:', accounts);
    return accounts;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  try {
    await particleConnect.disconnect();
    console.log('Wallet disconnected');
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

export const getConnectedAccounts = () => {
  // This method might not exist directly on particleConnect instance to get current accounts
  // Often, after connection, the provider or signer object is used.
  // For now, we rely on the fact that connect() returns accounts.
  // State management in the UI (e.g., via context) will hold the connected account info.
  // Particle's provider (ethers/web3) would be used for more detailed interactions.
  if (particleAuth.getUserInfo() && particleConnect.provider) {
    // Example: if using ethers.js provider from particleConnect.provider
    // const provider = new ethers.providers.Web3Provider(particleConnect.getProvider());
    // const signer = provider.getSigner();
    // return signer.getAddress();
    // This is more involved and will be part of actual transaction signing logic.
    // For now, just indicating that account info is available after connect.
    console.log("Wallet is connected, specific account info retrieval depends on provider integration.");
  }
  return null;
};

export const openWallet = () => {
  particleConnect.openWallet();
};

export const openChainSwitchModal = () => {
  particleConnect.openChainSwitchModal();
};

export const openAccountSwitchModal = () => {
  particleConnect.openAccountSwitchModal();
};

// TODO: Add functions for signing transactions, messages, etc.
// These will use particleConnect.provider or particleAuth.provider
// e.g., particleConnect.signMessage, particleConnect.sendTransaction

// Example of how one might get an ethers provider (if Particle Connect supports it this way)
// import { ethers } from 'ethers';
// export const getEthersProvider = () => {
//   if (particleConnect.provider) {
//     return new ethers.providers.Web3Provider(particleConnect.provider, "any");
//   }
//   return null;
// }
