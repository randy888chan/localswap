import { ZetaChainClient } from '@zetachain/toolkit/client';
import { ZetaChainClientParams, GetQuoteResponse, GetFeesResponse } from '@zetachain/toolkit/types'; // SendParams removed
import { Signer } from 'ethers'; // Using ethers v5 from ZetaChain toolkit's dependency
import { formatUnits, parseUnits } from 'ethers/lib/utils'; // Import for formatting and parsing amounts

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
      const zetaNetwork = process.env.NEXT_PUBLIC_ZETACHAIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';
      const params: ZetaChainClientParams = {
        network: zetaNetwork, // "mainnet" or "testnet" (for ZetaChain network itself)
        // The 'chains' config here is for ZetaChain's understanding of connected chains.
        // It might not be directly derived from the signer for all chains.
        // This part needs careful review of @zetachain/toolkit documentation for use with an arbitrary EIP-1193 signer.
        // For now, assuming a basic setup.
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
    fromAsset: AppSimpleAsset,
    toAsset: AppSimpleAsset, // Target ZRC20 asset
    amountInHumanReadable: string,
    // amountOutMinHumanReadable: string, // Usually derived from quote with slippage
    zetaChainRouterAddress: string, // Address of the DEX router on ZetaChain
    deadline?: number // Optional: swap deadline timestamp
  ): Promise<string | null> {
    if (!this.isInitialized() || !this.client || !this.evmSigner) {
      console.error("ZetaChainService not initialized or signer not available.");
      return null;
    }
    if (!fromAsset.contractAddress || !fromAsset.decimals) {
        console.error("From asset details (contractAddress, decimals) are incomplete.");
        return null;
    }

    try {
      const amountInCryptoPrecision = parseUnits(amountInHumanReadable, fromAsset.decimals);
      const recipientAddress = await this.evmSigner.getAddress();
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const swapDeadline = deadline || currentTimestamp + 60 * 20; // 20 minutes default deadline

      // 1. Approve the router to spend the fromAsset ZRC20
      // The ZetaChainClient might have a helper for ZRC20 approval, or we use ethers.js directly
      // For simplicity, let's assume a direct approval call using ethers.js pattern,
      // assuming ZRC20s are ERC20-compliant.
      // const zrc20Contract = new ethers.Contract(fromAsset.contractAddress, ZRC20_ABI_MINIMAL, this.evmSigner);
      // const approveTx = await zrc20Contract.approve(zetaChainRouterAddress, amountInCryptoPrecision);
      // await approveTx.wait(); // Wait for approval confirmation
      // console.log(`Approved ZRC20 ${fromAsset.symbol} for router ${zetaChainRouterAddress}, tx: ${approveTx.hash}`);
      // OR the ZetaChainClient might have a utility like:
      // await this.client.approveZRC20(fromAsset.contractAddress, zetaChainRouterAddress, amountInHumanReadable);
      // This part needs to align with @zetachain/toolkit's actual ZRC20 interaction methods.
      // For now, let's assume approval is handled or will be handled by a specific client method.
      // The toolkit's `sendTransaction` might be generic enough if we construct the ABI call.
      console.log(`executeZRC20Swap: Approval step for ${fromAsset.symbol} to router ${zetaChainRouterAddress} needs to be implemented based on toolkit specifics.`);


      // 2. Execute the swap
      // This is highly dependent on the ZetaChainClient's API for swaps or contract interaction.
      // It might be a high-level `swapTokens` method or a generic `sendTransaction`
      // where we provide the router address, function signature, and parameters.
      // Example structure for a generic contract call (illustrative):
      // const swapTx = await this.client.send({
      //   contract: zetaChainRouterAddress,
      //   method: 'swapExactTokensForTokens', // Or similar Uniswap V2 router function
      //   args: [
      //     amountInCryptoPrecision.toString(),
      //     ethers.utils.parseUnits(amountOutMinHumanReadable, toAsset.decimals).toString(), // amountOutMin
      //     [fromAsset.contractAddress, toAsset.contractAddress], // path
      //     recipientAddress, // to
      //     swapDeadline,     // deadline
      //   ],
      //   // value: '0', // If no native ZETA is sent with the call itself
      //   // gasLimit, etc.
      // });
      // return swapTx.hash; // Assuming it returns a transaction hash or similar object

      console.warn("executeZRC20Swap is using placeholder logic and needs actual ZetaChainClient swap method integration.");
      // Placeholder: Simulate a call and return a mock hash
      // In a real scenario, this would involve constructing and sending a transaction
      // to the ZetaChain router contract using this.client methods.
      return `mock-zeta-swap-tx-${Date.now()}`;

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

  public async callRemoteContractWithMessage(
    destinationChainId: number, // ZetaChain's ID for the target chain
    destinationContractAddress: string, // Address of the contract on the destination chain
    encodedFunctionCallData: string, // Hex string of the encoded function call
    zetaAmountToSendAsValueHumanReadable: string = "0", // Amount of ZRC-20 ZETA to send (human-readable)
    gasLimitForRemoteCall?: string, // Gas limit for the transaction on the destination chain
    processingFeeAmountHumanReadable?: string, // Fee for ZetaChain processing, in ZETA (human-readable)
    customMessage?: string // Optional: a simple string message if the target is not a contract or for additional info
  ): Promise<string | null> { // Returns CCTX hash
    if (!this.isInitialized() || !this.client || !this.evmSigner) {
      console.error("ZetaChainService not initialized or signer not available.");
      return null;
    }

    try {
      // Convert human-readable ZETA amounts to crypto precision (assuming ZETA has 18 decimals)
      const zetaDecimals = 18;
      const valueToSend = parseUnits(zetaAmountToSendAsValueHumanReadable, zetaDecimals);

      // Processing fee also needs to be in crypto precision if the toolkit expects that.
      // This depends on how `this.client.send` or similar method handles fees.
      // Let's assume for now that fees might be specified or deduced by the toolkit.

      // The exact method on `this.client` to achieve this needs to be identified from @zetachain/toolkit.
      // It might be a specific method like `callRemoteMethod` or a more generic `send` or `ccTransfer`.
      // Key parameters would be:
      // - Destination chain ID
      // - Destination contract address (recipient)
      // - Calldata (message)
      // - Value (ZETA amount)
      // - Gas parameters for the destination transaction
      // - Potentially parameters for ZetaChain's processing fee.

      // Example parameters for a hypothetical `this.client.crossChainCall`
      const params = {
        recipient: destinationContractAddress,
        destinationChainId: destinationChainId,
        message: encodedFunctionCallData, // This should be bytes (hex string)
        amount: valueToSend.toString(), // Amount of ZETA to send with the call
        // gasLimitOnDestination: gasLimitForRemoteCall, // Toolkit might have specific ways to set this
        // processingFee: parseUnits(processingFeeAmountHumanReadable || "0", zetaDecimals).toString(), // Example
        // customMessage: customMessage // if applicable
      };

      console.log("Preparing to call remote contract with message:", params);

      // const cctx = await this.client.someCrossChainCallMethod(params);
      // return cctx.hash; // Or however the CCTX hash is returned

      console.warn("callRemoteContractWithMessage is using placeholder logic and needs actual ZetaChainClient method integration for CCTX.");
      throw new Error("callRemoteContractWithMessage not fully implemented.");

    } catch (error) {
      console.error("Error in callRemoteContractWithMessage:", error);
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
