import { ZetaChainClient } from '@zetachain/toolkit/client';
import { ZetaChainClientParams, GetQuoteResponse, GetFeesResponse, SendParams } from '@zetachain/toolkit/types';
import { Signer } from 'ethers'; // Using ethers v5 from ZetaChain toolkit's dependency

import { ForeignCoin } from '@zetachain/toolkit/types'; // Assuming this type exists
import { Chain } from '@xchainjs/xchain-util'; // For mapping chain_id to XChain Chain
import { SimpleAsset as AppSimpleAsset } from './ThorchainService'; // Use the unified SimpleAsset

// Define a simpler Asset type for UI and function parameters, similar to ThorchainService
// This might need to be aligned or unified later.
// export interface ZetaSimpleAsset { // No longer needed, using AppSimpleAsset
//   chain_id: number; // ZetaChain's chain_id for the connected chain
//   contract?: string; // Contract address for ZRC20 or native asset identifier
//   symbol: string;
//   decimals: number;
//   name?: string;
// }

export interface ZetaQuote {
  // inputAsset: ZetaSimpleAsset; // Use AppSimpleAsset
  // outputAsset: ZetaSimpleAsset; // Use AppSimpleAsset
  inputAsset: AppSimpleAsset;
  outputAsset: AppSimpleAsset;
  inputAmount: string; // Human-readable
  outputAmount: string; // Human-readable
  fees: any; // Define more specifically based on GetFeesResponse
  // Other relevant quote data
}

export class ZetaChainService {
  private client: ZetaChainClient | null = null;
  private evmSigner: Signer | null = null; // ethers v5 Signer

  constructor() {
    // Client initialization will be done in an async method or when signer is set
    console.log("ZetaChainService created. Call initializeClient with a signer.");
  }

  public async initializeClient(signer: Signer): Promise<boolean> {
    if (!signer.provider) {
        console.error("ZetaChainService: Signer must have a provider.");
        return false;
    }
    this.evmSigner = signer;
    try {
      // The ZetaChainClientParams typically requires network information.
      // For ZetaChain, "mainnet" or "testnet" usually refers to ZetaChain's own network.
      // The 'signer' passed here is for interacting with connected chains (like Ethereum)
      // for actions like depositing into ZetaChain.

      // Example params, might need adjustment based on desired ZetaChain network (mainnet/testnet Athens)
      // and how the toolkit expects connected chain info.
      // The toolkit's examples often show direct use with window.ethereum.
      // We are adapting it to use the signer from Particle Network.
      const params: ZetaChainClientParams = {
        network: "testnet", // "mainnet" or "testnet" (for ZetaChain network itself)
        // The 'chains' config here is for ZetaChain's understanding of connected chains.
        // It might not be directly derived from the signer for all chains.
        // This part needs careful review of @zetachain/toolkit documentation for use with an arbitrary EIP-1193 signer.
        // For now, assuming a basic setup.
        // @ts-ignore TODO: Resolve ethers version conflict if this causes issues.
        signer: this.evmSigner, // Pass the ethers v5 signer
      };

      this.client = new ZetaChainClient(params);
      console.log("ZetaChainClient initialized successfully for testnet.");
      // You can call client.getBalances() or other methods here to verify.
      return true;
    } catch (error) {
      console.error("Failed to initialize ZetaChainClient:", error);
      this.client = null;
      this.evmSigner = null;
      return false;
    }
  }

  public isInitialized(): boolean {
    return !!this.client && !!this.evmSigner;
  }

  // Example: Get ZRC20 address for a foreign coin
  public async getZRC20ForAsset(assetAddress: string, sourceChainId: number): Promise<string | undefined> {
    if (!this.isInitialized() || !this.client) {
      console.error("ZetaChainService not initialized.");
      return undefined;
    }
    try {
      // This function might not exist directly, depends on toolkit version and features.
      // Looking at docs: client.getZRC20FromERC20(tokenAddress, networkId) seems relevant
      // The exact method name and parameters need to be verified from @zetachain/toolkit.
      // Assuming a hypothetical 'getZRC20Data' or similar.
      // For example:
      // const zrc20Address = await this.client.getZRC20FromERC20(assetAddress, sourceChainId);
      // return zrc20Address;

      // For now, let's simulate or refer to a common pattern.
      // The toolkit's `getForeignCoins` might list ZRC20s.
      const foreignCoins = await this.client.getForeignCoins();
      const targetCoin = foreignCoins.find(
        (coin) => coin.foreign_chain_id === sourceChainId && coin.contract?.toLowerCase() === assetAddress.toLowerCase()
      );
      return targetCoin?.zrc20_contract_address;
    } catch (error) {
      console.error("Error getting ZRC20 for asset:", error);
      return undefined;
    }
  }

  // Helper to map ZetaChain chain_id to XChainJS Chain
  private mapZetaChainIdToXChain(zetaChainId: number): Chain | undefined {
    // This mapping needs to be comprehensive based on ZetaChain's supported chains
    // Refer to: https://www.zetachain.com/docs/reference/network/api/ (or similar in toolkit)
    // Example mapping:
    if (zetaChainId === 5) return Chain.Ethereum; // Goerli
    if (zetaChainId === 1) return Chain.Ethereum; // Ethereum Mainnet
    if (zetaChainId === 56) return Chain.BinanceSmartChain; // BSC Mainnet
    if (zetaChainId === 97) return Chain.BinanceSmartChain; // BSC Testnet
    if (zetaChainId === 137) return Chain.Polygon; // Polygon Mainnet
    if (zetaChainId === 80001) return Chain.Polygon; // Polygon Mumbai Testnet
    if (zetaChainId === 18332) return Chain.Bitcoin; // Bitcoin Testnet
    if (zetaChainId === 8332) return Chain.Bitcoin; // Bitcoin Mainnet (check actual ID)
    // Add more mappings as needed
    console.warn(`Unmapped ZetaChain foreign_chain_id: ${zetaChainId}`);
    return undefined;
  }

  public async listSupportedForeignCoins(): Promise<AppSimpleAsset[]> {
    if (!this.isInitialized() || !this.client) {
      console.error("ZetaChainService not initialized.");
      return [];
    }
    try {
      const foreignCoins: ForeignCoin[] = await this.client.getForeignCoins();
      console.log("Fetched ZetaChain Foreign Coins:", foreignCoins);

      const assets: AppSimpleAsset[] = foreignCoins.map(coin => {
        const originalChain = this.mapZetaChainIdToXChain(coin.foreign_chain_id);
        // The 'symbol' from ForeignCoin is the ticker on the original chain (e.g., ETH, BTC, USDT)
        // The 'name' from ForeignCoin is often more descriptive (e.g., "Ethereum", "Tether USD")

        // Construct the XChainJS-style symbol for the ZRC20 token on ZetaChain.
        // Format: ZETA.<ASSET_ON_ZETA> (e.g., ZETA.gETH, ZETA.tBTC)
        // Or, if we want to represent the ZRC20 itself as an asset on ZetaChain:
        // Chain: ZetaChain (need to add this to XChainJS Chain enum or handle it)
        // Symbol: ZETA.<TICKER> or use coin.symbol directly if it's the ZRC20 ticker.
        // ContractAddress: coin.zrc20_contract_address
        // For now, we represent the ZRC20 token itself, living on ZetaChain.
        // We'd need a Chain.ZetaChain identifier. Let's use a placeholder or assume one.
        // The key here is that these are ZRC20s *on* ZetaChain.

        // Using a string literal for ZetaChain for now.
        // TODO: Add "ZetaChain" to XChainJS Chain enum or handle string chain identifiers consistently.
        const zetaChainIdentifier = 'ZetaChain' as Chain;

        return {
          chain: zetaChainIdentifier,
          ticker: coin.symbol, // This is the ticker of the ZRC20, e.g., "gETH", "tBTC"
          symbol: `${zetaChainIdentifier}.${coin.symbol}`, // Or use zrc20_contract_address for uniqueness if needed
          name: coin.name || coin.symbol,
          contractAddress: coin.zrc20_contract_address,
          decimals: coin.decimals,
          // iconUrl: coin.icon_url, // If available from ForeignCoin type
          source: 'zetachain',
          // Store original chain info if needed for display or other logic
          // originalChain: originalChain,
          // originalChainId: coin.foreign_chain_id,
        };
      }).filter(asset => asset.chain !== undefined); // Filter out unmapped chains for now

      return assets;
    } catch (error) {
      console.error("Error fetching ZetaChain foreign coins:", error);
      return [];
    }
  }

  public async depositAssetToZetaChain(
    amount: string, // Human-readable amount
    assetAddress?: string, // Optional: ERC20 contract address on source chain. Undefined for native gas token.
    zetaReceiverAddress: string, // User's address on ZetaChain (or target contract)
    sourceChainId: number, // To select correct gateway if needed, though client might handle it
    gasLimit?: string, // Optional gas limit for the transaction
    gasPrice?: string // Optional gas price for the transaction
  ): Promise<string | null> { // Returns transaction hash
    if (!this.isInitialized() || !this.client || !this.evmSigner) {
      console.error("ZetaChainService not initialized or signer not available.");
      throw new Error("ZetaChainService not initialized or signer not available.");
    }

    try {
      const currentAddress = await this.evmSigner.getAddress();
      console.log(`Initiating deposit from ${currentAddress} on chain ID ${sourceChainId}`);
      console.log(`Depositing ${amount} of ${assetAddress || 'Native Gas Token'} to ${zetaReceiverAddress} on ZetaChain.`);

      // Construct arguments for evmDeposit
      // The ZetaChainClient should handle which gateway to use based on its configuration and the connected signer's chain.
      const depositArgs = {
        amount: amount, // Human-readable string, toolkit should handle conversion
        erc20: assetAddress, // Address of ERC20, or undefined for native gas token
        receiver: zetaReceiverAddress,
        // gatewayEvm: 'OPTIONAL_GATEWAY_ADDRESS', // Usually not needed, client resolves it
        // revertOptions: { ... }, // Optional
        txOptions: { // Optional
          gasLimit: gasLimit, // e.g., "200000"
          // gasPrice: gasPrice, // e.g., "50000000000" (50 Gwei) - for legacy txns
          // maxFeePerGas, maxPriorityFeePerGas for EIP-1559 if supported by toolkit and chain
        },
      };

      // Type assertion needed if the toolkit's evmDeposit expects a more specific args type.
      const tx = await this.client.evmDeposit(depositArgs as any);
      console.log('ZetaChain deposit transaction submitted:', tx);
      return tx.hash; // Assuming tx is a ContractTransaction from ethers
    } catch (error) {
      console.error("Error depositing asset to ZetaChain:", error);
      // Rethrow or handle more gracefully
      if (error instanceof Error) {
        throw new Error(`ZetaChain deposit failed: ${error.message}`);
      }
      throw new Error("Unknown error during ZetaChain deposit.");
    }
  }


  // Example: Get quote for a swap (if ZetaChain itself provides aggregated swaps or swaps on its pools)
  // This is for swaps between ZRC20 tokens *on* ZetaChain
  public async getZRC20SwapQuote(
    fromZRC20Asset: AppSimpleAsset, // ZRC20 asset on ZetaChain
    toZRC20Asset: AppSimpleAsset,   // ZRC20 asset on ZetaChain
    amount: string                  // Human-readable amount of fromZRC20
  ): Promise<ZetaQuote | null> {
    if (!this.isInitialized() || !this.client) {
      console.error("ZetaChainService not initialized.");
      return null;
    }
    if (!fromZRC20Asset.contractAddress || !toZRC20Asset.contractAddress) {
        console.error("Missing contract address for ZRC20 swap quote.");
        return null;
    }

    try {
      // client.getQuote likely expects ZRC20 contract addresses or symbols known to ZetaChain.
      // The response type from client.getQuote is GetQuoteResponse from @zetachain/toolkit/types.
      // We need to map this to our ZetaQuote interface.
      const rawQuote: GetQuoteResponse = await this.client.getQuote(amount, fromZRC20Asset.contractAddress, toZRC20Asset.contractAddress);
      console.log("Raw ZetaChain ZRC20 swap quote:", rawQuote);

      // Assuming GetQuoteResponse has structure like: { amountOut: string, someFeeInfo: any }
      // And that amountOut is in crypto precision of the output ZRC20.
      // This mapping is speculative and needs to be adjusted based on actual GetQuoteResponse structure.
      if (!rawQuote || !rawQuote.amountOut) { // Adjust condition based on actual rawQuote structure
        console.error("Invalid quote structure received from ZetaChain client.getQuote");
        return null;
      }

      // We need decimals for the output asset to convert amountOut to human-readable
      const outputDecimals = toZRC20Asset.decimals;
      if (outputDecimals === undefined) {
        console.error(`Decimals for output ZRC20 ${toZRC20Asset.symbol} are unknown.`);
        return null;
      }

      // This is a simplified mapping. Actual fee structure from GetQuoteResponse needs to be handled.
      return {
        inputAsset: fromZRC20Asset,
        outputAsset: toZRC20Asset,
        inputAmount: amount, // Human-readable input
        // Assuming rawQuote.amountOut is in crypto precision (base units)
        outputAmount: formatUnits(rawQuote.amountOut.toString(), outputDecimals), // Convert to human-readable
        fees: rawQuote.feeData || {}, // Placeholder for actual fee data mapping
      };
    } catch (error) {
      console.error("Error getting ZetaChain ZRC20 swap quote:", error);
      return null;
    }
  }

  // Generic sendTransaction - to be replaced by more specific methods like swap, call, etc.
  // public async sendTransaction(params: SendParams): Promise<string /* txHash */ | null> {
  //   if (!this.isInitialized() || !this.client) {
  //     console.error("ZetaChainService not initialized.");
  //     return null;
  //   }
  //   try {
  //     const txHash = await this.client.send(params);
  //     return txHash;
  //   } catch (error) {
  //     console.error("Error sending ZetaChain transaction:", error);
  //     return null;
  //   }
  // }


  // Placeholder for actually executing a swap of ZRC20s on ZetaChain
  // This would likely use a method like `client.swap(...)` if available, or interact with a DEX contract on ZetaChain.
  // The `client.send(...)` method with appropriate parameters for a swap router might be used.
  public async executeZRC20Swap(
    // Parameters will depend on how swaps are done: quote object, specific params, etc.
    // For example, if using a router contract:
    // routerAddress: string,
    // fromZRC20: string,
    // toZRC20: string,
    // amountIn: string,
    // amountOutMin: string,
    // deadline: number,
    // recipient: string
  ): Promise<string | null> {
    if (!this.isInitialized() || !this.client) {
      console.error("ZetaChainService not initialized.");
      return null;
    }
    try {
      // sendParams needs to be constructed according to @zetachain/toolkit documentation
      // This might involve specifying the message, recipient, amount, etc.
      // This is highly dependent on the ZetaChain toolkit's API for swaps.
      // It might involve calling a specific swap function on the client or preparing a transaction
      // for a known DEX router contract on ZetaChain.
      // For now, this is a placeholder.
      console.warn("executeZRC20Swap is not fully implemented. Needs specific ZetaChain swap logic.");
      // const tx = await this.client.someSwapMethod(...);
      // return tx.hash;
      throw new Error("executeZRC20Swap not implemented.");
    } catch (error) {
      console.error("Error executing ZetaChain ZRC20 swap:", error);
      return null;
    }
  }

  public async trackCCTX(txHash: string): Promise<any | null> { // Replace 'any' with CCTXs type from toolkit
    if (!this.isInitialized() || !this.client) {
      console.error("ZetaChainService not initialized.");
      return null;
    }
    try {
      // The trackCCTX method usually takes an object with `hash`, `json`, `emitter`
      const cctxStatus = await this.client.trackCCTX({ hash: txHash, json: true });
      console.log(`CCTX Status for ${txHash}:`, cctxStatus);
      return cctxStatus;
    } catch (error) {
      console.error(`Error tracking CCTX for ${txHash}:`, error);
      return null;
    }
  }


  // Placeholder for fetching fees for a cross-chain transaction (deposit, withdraw, message)
  public async getCrossChainFees(
      sourceChainId: number,
      destinationChainId: number,
      amount: string, // human-readable
      assetSymbol: string, // on source chain
      message?: string
    ): Promise<GetFeesResponse | null> {
    if (!this.isInitialized() || !this.client) {
        console.error("ZetaChainService not initialized.");
        return null;
    }
    try {
        const fees = await this.client.getFees(sourceChainId, destinationChainId, amount, assetSymbol, message);
        return fees;
    } catch (error) {
        console.error("Error fetching ZetaChain fees:", error);
        return null;
    }
  }
}

// Example usage (illustrative)
// const particleSigner = await getEthersSigner(); // from lib/particle, ensure it's ethers v5 compatible
// if (particleSigner) {
//   const zetaService = new ZetaChainService();
//   const success = await zetaService.initializeClient(particleSigner);
//   if (success) {
//     const usdtOnGoerli = '0xTOKEN_ADDRESS_HERE'; // USDT contract address on Goerli
//     const goerliChainId = 5; // Goerli
//     const zrc20Address = await zetaService.getZRC20ForAsset(usdtOnGoerli, goerliChainId);
//     console.log(`ZRC20 address for USDT on Goerli: ${zrc20Address}`);
//   }
// }
