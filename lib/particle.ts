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

// export const getConnectedAccounts = () => { // Removed as walletAccounts from context is used for EVM
//   if (particleAuth.getUserInfo() && particleConnect.provider) {
//     console.log("Wallet is connected, specific account info retrieval depends on provider integration.");
//   }
//   return null;
// };

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
import { ethers } from 'ethers';
import { Chain } from '@xchainjs/xchain-util'; // For chain identifiers


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

// --- Placeholder functions for Non-EVM Wallet Interactions via Particle Connect ---

/**
 * Gets the connected account address for a given non-EVM chain.
 * This is a placeholder and needs to be implemented based on Particle SDK's capabilities
 * for external non-EVM wallets (e.g., via WalletConnect).
 */
export const getNonEvmAddress = async (chain: Chain): Promise<string | null> => {
  if (!particleConnect.provider) {
    console.warn("Particle connect provider not available for getNonEvmAddress.");
    return null;
  }
  try {
    // Example: WalletConnect methods often use specific RPC calls per chain family
    let accounts: string[] = [];
    if (chain === Chain.Bitcoin) {
      // This is speculative. Particle might wrap WalletConnect `btc_getAccounts` or similar.
      // Or it might be part of a generic `request` method if Particle normalizes it.
      // accounts = await particleConnect.request({ method: 'btc_accounts' }); // Or similar
      console.warn(`getNonEvmAddress for ${chain}: Actual Particle SDK method unknown, returning placeholder.`);
      // Try to get from existing walletAccounts if Particle populates it for non-EVM upon connection
      const currentAccounts = particleConnect.currAccounts; // Assuming particleConnect exposes this
      if (currentAccounts && Array.isArray(currentAccounts)) {
         // We need a way to map chain to the account format.
         // For now, if only one account, assume it could be it, but this is weak.
         if (currentAccounts.length === 1 && !currentAccounts[0].startsWith('0x')) return currentAccounts[0];
      }
       return "mock-btc-address-from-particle"; // Placeholder
    } else if (chain === Chain.Cosmos) {
      // accounts = await particleConnect.request({ method: 'cosmos_getAccounts', params: [{ chainId: 'cosmoshub-4' }] }); // Example
      console.warn(`getNonEvmAddress for ${chain}: Actual Particle SDK method unknown, returning placeholder.`);
      return "mock-cosmos-address-from-particle"; // Placeholder
    } else {
      console.warn(`getNonEvmAddress: Chain ${chain} not explicitly supported in this placeholder.`);
      return null;
    }
    // return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error(`Error getting address for chain ${chain} via Particle:`, error);
    return null;
  }
};

/**
 * Signs a transaction for a given non-EVM chain using Particle Connect.
 * This is a highly speculative placeholder.
 * Implementation depends entirely on Particle SDK's methods for external non-EVM wallet signing.
 *
 * @param chain The chain for which the transaction is being signed.
 * @param transactionData The unsigned transaction data, format depends on the chain.
 *                        For Bitcoin, this might be a PSBT (Partially Signed Bitcoin Transaction) hex.
 *                        For Cosmos, this might be a StdSignDoc object.
 * @param fromAddress The address to sign from.
 * @returns The signed transaction data or signature, format depends on the chain.
 */
export const signNonEvmTransaction = async (
  chain: Chain,
  transactionData: any, // e.g., PSBT hex for BTC, StdSignDoc for Cosmos
  fromAddress: string
): Promise<any | null> => { // Return type also depends on chain (e.g., signed PSBT hex, signature object)
  if (!particleConnect.provider) {
    console.warn("Particle connect provider not available for signNonEvmTransaction.");
    return null;
  }
  try {
    console.log(`Attempting to sign transaction for ${chain} from ${fromAddress} with data:`, transactionData);
    if (chain === Chain.Bitcoin) {
      // Example for Bitcoin using a hypothetical PSBT signing method via WalletConnect (if Particle exposes it)
      // const signedPsbtHex = await particleConnect.request({
      //   method: 'btc_signPsbt', // Or a similar method Particle might provide
      //   params: [{ psbtHex: transactionData, signerAddress: fromAddress }],
      // });
      // return signedPsbtHex;
      console.warn(`signNonEvmTransaction for ${chain}: Actual Particle SDK method unknown, returning mock success.`);
      return "mock-signed-btc-psbt-hex"; // Placeholder
    } else if (chain === Chain.Cosmos) {
      // Example for Cosmos (Amino or Direct)
      // const signature = await particleConnect.request({
      //   method: 'cosmos_signAmino', // or cosmos_signDirect
      //   params: [fromAddress, transactionData], // transactionData would be StdSignDoc
      // });
      // return signature;
      console.warn(`signNonEvmTransaction for ${chain}: Actual Particle SDK method unknown, returning mock success.`);
      return { mockSignedCosmosTransaction: transactionData, signature: "mockSignature" }; // Placeholder
    } else {
      console.warn(`signNonEvmTransaction: Chain ${chain} not explicitly supported in this placeholder.`);
      return null;
    }
  } catch (error) {
    console.error(`Error signing transaction for chain ${chain} via Particle:`, error);
    return null;
  }
};

/**
 * Broadcasts a signed non-EVM transaction.
 * This might use Particle's provider if it supports broadcasting for that chain,
 * or it might require using a public RPC/service for the specific chain.
 */
export const broadcastNonEvmTransaction = async (
  chain: Chain,
  signedTransactionData: any
): Promise<string | null> => { // Returns transaction hash
  try {
    console.log(`Attempting to broadcast transaction for ${chain}:`, signedTransactionData);
    if (chain === Chain.Bitcoin) {
      // Example: Broadcasting via a public API like Blockstream.info
      // const response = await fetch(`https://blockstream.info/api/tx`, { // Use testnet if applicable
      //   method: 'POST',
      //   body: signedTransactionData, // Assuming this is the raw signed tx hex
      // });
      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(`Bitcoin broadcast failed: ${response.status} ${errorText}`);
      // }
      // const txHash = await response.text();
      // return txHash;
      console.warn(`broadcastNonEvmTransaction for ${chain}: Actual broadcasting method needed, returning mock success.`);
      return `mock-btc-txid-${Date.now()}`; // Placeholder
    } else if (chain === Chain.Cosmos) {
      // Example: Broadcasting via a Cosmos LCD/RPC endpoint
      // This would involve using `particleConnect.provider.request` with `broadcast_tx_sync` or `broadcast_tx_async`
      // or a direct fetch to an LCD endpoint.
      // const result = await particleConnect.request({
      //    method: 'cosmos_broadcastTx', // Or specific broadcast method
      //    params: [signedTransactionData] // Format of signedTxData depends on what signNonEvmTransaction returned
      // });
      // return result.txhash;
      console.warn(`broadcastNonEvmTransaction for ${chain}: Actual broadcasting method needed, returning mock success.`);
      return `mock-cosmos-txid-${Date.now()}`; // Placeholder
    } else {
      console.warn(`broadcastNonEvmTransaction: Chain ${chain} not explicitly supported in this placeholder.`);
      return null;
    }
  } catch (error) {
    console.error(`Error broadcasting transaction for chain ${chain}:`, error);
    return null;
  }
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
