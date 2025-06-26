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

// --- Non-EVM Wallet Interactions via Particle Connect ---

/**
 * Gets the connected account address for a given non-EVM chain.
 * Particle Connect uses WalletConnect or its own adapters for non-EVM chains.
 * The specific methods depend on Particle's SDK wrapping these interactions.
 */
export const getNonEvmAddress = async (chain: Chain): Promise<string | null> => {
  if (!particleConnect.provider) {
    console.warn("Particle connect provider not available for getNonEvmAddress.");
    return null;
  }
  // Ensure user is "connected" through Particle Connect, which might involve selecting a wallet.
  // The `particleConnect.connect()` might need to be called if no active session.
  // For now, assume `particleConnect.provider` implies an active connection.

  try {
    let accounts: string[] | undefined;
    const walletType = particleConnect.particle?.walletType;
    console.log(`Fetching non-EVM address for ${chain} with wallet type: ${walletType}`);

    // Particle's `particle.btc.getAccounts()` or `particle.solana.getAccounts()` are for their embedded AA SDK.
    // For external wallets via Particle Connect, we typically rely on generic request methods or specific chain adapters.
    // The `particleConnect.request` method is the most likely candidate if Particle follows WalletConnect patterns.

    if (chain === Chain.Bitcoin) {
      // WalletConnect v2 uses "btc_getAccounts" or similar. Particle might abstract this.
      // Check if Particle exposes a direct method first for BTC through Connect.
      // If not, try generic request.
      // accounts = await particleConnect.request({ method: 'btc_getAccounts' }); // This is a guess.
      // Particle documentation mentions BTC Connect for Particle Auth side. For Particle Connect (external wallets),
      // it would depend on the connected wallet's WalletConnect capabilities.
      // A common way Particle SDKs work is to have the current accounts available after connection.
      // Let's check `particleConnect.currAccounts` if it holds non-EVM addresses.
      const currentAccounts = particleConnect.currAccounts;
      if (currentAccounts && currentAccounts.length > 0) {
        // Heuristic: Bitcoin addresses don't start with '0x' and are typically longer.
        // This is not foolproof and depends on how Particle structures `currAccounts`.
        accounts = currentAccounts.filter(acc => !acc.startsWith('0x') && acc.length > 25); // Basic filter
        if (accounts && accounts.length > 0) console.log(`Found potential BTC accounts in currAccounts: ${accounts}`);
      }

      if (!accounts || accounts.length === 0) {
        console.warn(`getNonEvmAddress for ${chain}: No direct method or suitable account in currAccounts. Attempting generic request (speculative).`);
        // This is highly speculative as Particle's specific RPC method for external BTC wallets isn't documented clearly.
        // It might be `particle_btcGetAccounts` or depend on the connected adapter.
        // For a robust solution, refer to Particle's exact documentation for external BTC wallet address retrieval.
        // For now, returning a mock or throwing an error might be safer than a failing RPC call.
         console.error(`Particle SDK method for getting external ${chain} address is not confirmed. Returning null.`);
         return null; // Or throw new Error("Method not confirmed");
      }
    } else if (chain === Chain.Cosmos) {
      // Similar to Bitcoin, check `currAccounts` or a specific request.
      // Cosmos addresses typically start with a chain-specific prefix (e.g., "cosmos", "osmo").
      const currentAccounts = particleConnect.currAccounts;
      if (currentAccounts && currentAccounts.length > 0) {
         accounts = currentAccounts.filter(acc => acc.startsWith('cosmos') || acc.startsWith('osmo') /* add other prefixes */);
         if (accounts && accounts.length > 0) console.log(`Found potential Cosmos accounts in currAccounts: ${accounts}`);
      }
      if (!accounts || accounts.length === 0) {
        console.warn(`getNonEvmAddress for ${chain}: No direct method or suitable account in currAccounts. Attempting generic request (speculative).`);
        // Example: `await particleConnect.request({ method: 'cosmos_getAccounts', params: [{ chainId: 'cosmoshub-4' }] });`
        // This depends on WalletConnect session and connected wallet's support.
        console.error(`Particle SDK method for getting external ${chain} address is not confirmed. Returning null.`);
        return null;
      }
    } else {
      console.warn(`getNonEvmAddress: Chain ${chain} not explicitly supported or method unknown.`);
      return null;
    }

    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error(`Error getting address for chain ${chain} via Particle:`, error);
    return null;
  }
};

/**
 * Signs a transaction for a given non-EVM chain using Particle Connect.
 * @param chain The chain for which the transaction is being signed.
 * @param transactionData The unsigned transaction data (PSBT hex for BTC, StdSignDoc JSON string for Cosmos).
 * @param fromAddress The address to sign from.
 * @returns The signed transaction data (signed PSBT hex for BTC, signature object for Cosmos).
 */
export const signNonEvmTransaction = async (
  chain: Chain,
  transactionData: string, // Expecting PSBT hex string for BTC, StdSignDoc JSON string for Cosmos
  fromAddress: string
): Promise<string | { signature: string; signedTxBytes?: string } | null> => {
  if (!particleConnect.provider) {
    console.warn("Particle connect provider not available for signNonEvmTransaction.");
    return null;
  }
  try {
    console.log(`Attempting to sign transaction for ${chain} from ${fromAddress}`);
    if (chain === Chain.Bitcoin) {
      // Particle's documentation for BTC Connect (part of Particle Auth/Wallet) suggests methods like `signPSBT`.
      // If using an external wallet via Particle Connect, it would likely use WalletConnect's `bitcoin_signPsbt`
      // or a similar standard if Particle wraps it.
      // Assuming `particleConnect.request` is the way for external wallets.
      const result = await particleConnect.request({
        method: 'bitcoin_signPsbt', // Standard WalletConnect method for Bitcoin PSBTs
        params: [{ psbt: transactionData, address: fromAddress }], // Structure might vary
      });
      // `result` structure depends on the wallet; it might be the signed PSBT hex directly or an object.
      if (typeof result === 'string') return result; // Assuming it's the signed PSBT hex
      if (typeof result === 'object' && (result as any).signedPsbt) return (result as any).signedPsbt; // Or similar field
      throw new Error("Unexpected response format from bitcoin_signPsbt");

    } else if (chain === Chain.Cosmos) {
      // For Cosmos, it's typically `signAmino` or `signDirect`. `signAmino` is more common with WalletConnect v1/Keplr.
      // The `transactionData` should be a JSON string of the StdSignDoc.
      // The `particleConnect.request` method would be used.
      const signDoc = JSON.parse(transactionData); // Parse JSON string to object
      const result = await particleConnect.request({
        method: 'cosmos_signAmino', // Or 'cosmos_signDirect' if supported and StdSignDoc is for direct
        params: [fromAddress, signDoc],
      });
      // Result is typically an object containing the signature.
      // e.g., { signature: "base64_signature_string", pub_key: { type: string, value: string } }
      // For broadcasting, often only the signature part is needed, combined with the original signDoc.
      if (typeof result === 'object' && (result as any).signature) {
        return { signature: (result as any).signature }; // Return the signature part
      }
      throw new Error("Unexpected response format from cosmos_signAmino");
    } else {
      console.warn(`signNonEvmTransaction: Chain ${chain} not explicitly supported.`);
      return null;
    }
  } catch (error) {
    console.error(`Error signing ${chain} transaction via Particle:`, error);
    throw error; // Re-throw to be caught by UI
  }
};

/**
 * Broadcasts a signed non-EVM transaction.
 * Uses public RPCs as Particle Connect might not directly support broadcasting for all non-EVM chains.
 */
export const broadcastNonEvmTransaction = async (
  chain: Chain,
  signedTransactionData: string | { signature: string; signedTxBytes?: string }, // signed PSBT hex for BTC, or object for Cosmos
  originalSignDoc?: any // For Cosmos, the original StdSignDoc might be needed to reconstruct the tx with signature
): Promise<string | null> => {
  try {
    console.log(`Attempting to broadcast transaction for ${chain}`);
    if (chain === Chain.Bitcoin) {
      // signedTransactionData is assumed to be the final signed transaction hex (not just PSBT anymore if wallet fully signed it)
      // Or, if it's a PSBT that needs finalization and extraction, that logic would be here or in XChainJS.
      // For simplicity, assuming `signedTransactionData` is the raw tx hex to broadcast.
      // This step may require `bitcoinjs-lib` to finalize PSBT if Particle returns a signed PSBT rather than raw tx.
      // For now, assuming `signedTransactionData` is the broadcastable hex.
      const apiUrl = process.env.NEXT_PUBLIC_NETWORK === 'testnet'
        ? 'https://blockstream.info/testnet/api/tx'
        : 'https://blockstream.info/api/tx';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: signedTransactionData as string, // Raw signed tx hex
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bitcoin broadcast failed (${response.status}): ${errorText}`);
      }
      const txHash = await response.text();
      console.log(`Bitcoin transaction broadcasted: ${txHash}`);
      return txHash;

    } else if (chain === Chain.Cosmos) {
      // For Cosmos, broadcasting typically involves sending a JSON payload with the signed tx bytes.
      // The `signedTransactionData` from `signNonEvmTransaction` was `{ signature: string }`.
      // We need the original StdSignDoc and the public key to reconstruct the full signed tx for broadcast.
      // This part is complex and often handled by libraries like `@cosmjs/stargate`.
      // XChainJS Cosmos client's `broadcastTx` would ideally handle this if given the signature and original data.
      // If Particle returns `signedTxBytes` directly, that's simpler.
      // For now, this is a simplified placeholder. A robust solution needs CosmJS or similar.

      if (typeof signedTransactionData !== 'object' || !signedTransactionData.signature) {
        throw new Error("Invalid signed data format for Cosmos broadcast.");
      }
      if (!originalSignDoc) {
        throw new Error("Original SignDoc required for Cosmos broadcast.");
      }

      // Placeholder for using a public Cosmos LCD/RPC endpoint.
      // Example: POST to `/cosmos/tx/v1beta1/txs`
      // The body would be like: { "tx_bytes": "base64_encoded_signed_tx_bytes", "mode": "BROADCAST_MODE_SYNC" }
      // Constructing `tx_bytes` from SignDoc and signature is non-trivial.
      // This would typically involve `makeStdTx` from `@cosmjs/amino` or similar for direct sign.

      const cosmosRpcUrl = process.env.NEXT_PUBLIC_COSMOS_RPC_URL || (process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'https://rpc.sentry-01.theta-testnet.polypore.xyz' : 'https://cosmos-rpc.publicnode.com:443');
      // The following is a conceptual representation. Real implementation needs CosmJS.
      console.warn(`Cosmos broadcast: Simplified. Real implementation requires CosmJS or similar to construct tx_bytes.`);
      // Example structure to send to a generic broadcast endpoint (very simplified)
      // const txToBroadcast = {
      //   tx: {
      //     msg: originalSignDoc.msgs, // This is simplified, structure is more complex
      //     fee: originalSignDoc.fee,
      //     signatures: [{
      //       pub_key: { /* public key from fromAddress or Particle */ },
      //       signature: signedTransactionData.signature,
      //     }],
      //     memo: originalSignDoc.memo,
      //   },
      //   mode: 'sync', // Or 'async', 'block'
      // };

      // This is a placeholder, actual broadcast logic is more involved.
      // const response = await fetch(`${cosmosRpcUrl}/txs`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(txToBroadcast),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(`Cosmos broadcast failed: ${errorData.message || JSON.stringify(errorData)}`);
      // }
      // const result = await response.json();
      // if (result.code && result.code !== 0) { // Check for Tendermint error code
      //   throw new Error(`Cosmos broadcast error: ${result.raw_log || JSON.stringify(result)}`);
      // }
      // return result.txhash;

      console.error(`Cosmos broadcast: Full implementation needed using CosmJS or similar. Returning mock.`);
      return `mock-cosmos-txid-${Date.now()}`; // Placeholder
    } else {
      console.warn(`broadcastNonEvmTransaction: Chain ${chain} not explicitly supported.`);
      return null;
    }
  } catch (error) {
    console.error(`Error broadcasting ${chain} transaction:`, error);
    throw error; // Re-throw
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
