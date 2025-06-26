import { ParticleAuth } from '@particle-network/auth';
import { ParticleConnect } from '@particle-network/connect';
import { Ethereum, BNBChain, Polygon, Avalanche, ArbitrumOne, EthereumGoerli } from '@particle-network/chains';

// Ensure these environment variables are set in your .env.local file
const PARTICLE_PROJECT_ID = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
const PARTICLE_CLIENT_KEY = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY;
const PARTICLE_APP_ID = process.env.NEXT_PUBLIC_PARTICLE_APP_ID;

if (!PARTICLE_PROJECT_ID || !PARTICLE_CLIENT_KEY || !PARTICLE_APP_ID) {
  console.error("Particle Network environment variables are not set!");
  // Potentially throw an error or use fallback placeholder values if in a non-production environment for basic UI rendering
  // For now, this will allow the code to run but Particle SDK will likely fail or use default test values if it has any.
}

const particleCommonConfig = {
  projectId: PARTICLE_PROJECT_ID!, // Use non-null assertion operator as we've checked
  clientKey: PARTICLE_CLIENT_KEY!,
  appId: PARTICLE_APP_ID!,
};

export const particleAuth = new ParticleAuth(particleCommonConfig);

// Define the chains to be supported in the Particle Wallet UI
const supportedChains = [
  Ethereum,
  BNBChain,
  Polygon,
  Avalanche,
  ArbitrumOne,
  EthereumGoerli // Keep Goerli for testing if needed
];

export const particleConnect = new ParticleConnect({
  ...particleCommonConfig,
  chainName: Ethereum.name, // Default to Ethereum Mainnet
  chainId: Ethereum.id,
  wallet: { // Optional: Wallet UI configuration for Particle Connect
    displayWalletEntry: true,
    defaultWalletEntryPosition: 'bottom-right',
    uiMode: 'dark', // or 'light'
    supportChains: supportedChains.map(chain => ({ id: chain.id, name: chain.name })),
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
import { ethers } from 'ethers';

// export const getEthersProvider = () => {
//   if (particleConnect.provider) {
//     return new ethers.providers.Web3Provider(particleConnect.provider, "any");
//   }
//   return null;
// }

export const getEthersSigner = async (): Promise<ethers.Signer | null> => {
  if (particleConnect.provider) {
    try {
      const provider = new ethers.providers.Web3Provider(particleConnect.provider, "any");
      const signer = provider.getSigner();
      // Check if signer is available
      await signer.getAddress(); // This will throw an error if no account is available
      return signer;
    } catch (error) {
      console.error("Error getting ethers signer:", error);
      return null;
    }
  }
  console.warn("Particle connect provider not available.");
  return null;
};

export const getEthersProvider = (): ethers.providers.Web3Provider | null => {
  if (particleConnect.provider) {
    try {
      return new ethers.providers.Web3Provider(particleConnect.provider, "any");
    } catch (error) {
      console.error("Error getting ethers provider:", error);
      return null;
    }
  }
  console.warn("Particle connect provider not available.");
  return null;
};
