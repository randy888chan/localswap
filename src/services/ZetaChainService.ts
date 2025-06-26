import { ZetaChainClient, ApproveTokenParams, SendParams } from '@zetachain/toolkit/client'; // Added ApproveTokenParams, SendParams
import { ZetaChainClientParams, GetQuoteResponse, GetFeesResponse, FeeData } from '@zetachain/toolkit/types'; // SendParams removed, Added FeeData
import { Signer, Contract, ethers } from 'ethers'; // Using ethers v5 from ZetaChain toolkit's dependency, added Contract
import { formatUnits, parseUnits } from 'ethers/lib/utils'; // Import for formatting and parsing amounts

import { ForeignCoin } from '@zetachain/toolkit/types';
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

export interface ZetaSwapFeeDetails {
  totalFee: string; // In crypto precision of fee asset
  totalFeeHumanReadable?: string;
  gasFee: string; // In crypto precision of fee asset
  gasFeeHumanReadable?: string;
  protocolFee: string; // In crypto precision of fee asset
  protocolFeeHumanReadable?: string;
  feeAsset?: AppSimpleAsset;
}
export interface ZetaQuote {
  inputAsset: AppSimpleAsset;
  outputAsset: AppSimpleAsset;
  inputAmount: string; // Human-readable input amount
  inputAmountCryptoPrecision: string; // Crypto precision input amount
  outputAmount: string; // Human-readable output amount, after fees and slippage
  outputAmountCryptoPrecision: string; // Crypto precision output amount
  routerAddress?: string;
  path?: string[]; // Token addresses in swap path
  fees?: ZetaSwapFeeDetails;
  // Other relevant quote data from GetQuoteResponse
}

// Minimal ABI for ERC20 approve
const ERC20_ABI_MINIMAL_APPROVE = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

// Minimal ABI for a common DEX router swap function (e.g., UniswapV2-like)
const ZETA_DEX_ROUTER_ABI_SWAP = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];


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
      const zetaChainApi = process.env.NEXT_PUBLIC_ZETACHAIN_NETWORK === 'mainnet' ? 'api-mainnet' : 'api-testnet';
      // const zetaNetwork = process.env.NEXT_PUBLIC_ZETACHAIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

      const params: ZetaChainClientParams = {
        // network: zetaNetwork, // "mainnet" or "testnet" (for ZetaChain network itself)
        // The 'chains' config here is for ZetaChain's understanding of connected chains.
        // It might not be directly derived from the signer for all chains.
        // This part needs careful review of @zetachain/toolkit documentation for use with an arbitrary EIP-1193 signer.
        // For now, assuming a basic setup.
        chains: { // This structure might be necessary for the client to know about connected chains
            // Example: Hardcoding for Goerli if signer is on Goerli for deposits
            // This needs to be dynamic or correctly configured based on actual connected chain.
            // For calls originating from ZetaChain (like ZRC20 swap or CCTX send), this might be less critical
            // than for deposits *to* ZetaChain.
            // Referring to toolkit, it seems to infer from signer if possible for EVM.
        },
        signer: this.evmSigner, // Pass the ethers v5 signer
        api: zetaChainApi,
      };

      this.client = new ZetaChainClient(params);
      // For testnet, the log message should be more dynamic or reflect the actual config
      console.log(`ZetaChainClient initialized successfully for ${process.env.NEXT_PUBLIC_ZETACHAIN_NETWORK || 'default (testnet)'}.`);
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
    if (!fromZRC20Asset.contractAddress || !toZRC20Asset.contractAddress || fromZRC20Asset.decimals === undefined) {
        console.error("Missing contractAddress or decimals for ZRC20 swap quote assets.");
        return null;
    }

    try {
      const amountInCryptoPrecision = parseUnits(amount, fromZRC20Asset.decimals).toString();
      const rawQuote: GetQuoteResponse = await this.client.getQuote(
        amountInCryptoPrecision, // getQuote expects amount in crypto precision
        fromZRC20Asset.contractAddress,
        toZRC20Asset.contractAddress
      );
      console.log("Raw ZetaChain ZRC20 swap quote:", rawQuote);

      if (!rawQuote || !rawQuote.amountOut) {
        console.error("Invalid quote structure received from ZetaChain client.getQuote");
        return null;
      }

      const outputDecimals = toZRC20Asset.decimals;
      if (outputDecimals === undefined) {
        console.error(`Decimals for output ZRC20 ${toZRC20Asset.symbol} are unknown.`);
        return null;
      }

      let feesDetails: ZetaSwapFeeDetails | undefined = undefined;
      if (rawQuote.feeData) {
        const feeAssetSimple: AppSimpleAsset | undefined = rawQuote.feeData.feeAsset ? {
            chain: this.mapZetaChainIdToXChain(rawQuote.feeData.feeAsset.chainId) || Chain.ZetaChainMainnet, // Default to ZetaChain if unmapped
            ticker: rawQuote.feeData.feeAsset.symbol,
            symbol: `${this.mapZetaChainIdToXChain(rawQuote.feeData.feeAsset.chainId) || 'ZETA'}.${rawQuote.feeData.feeAsset.symbol}`,
            contractAddress: rawQuote.feeData.feeAsset.address,
            decimals: rawQuote.feeData.feeAsset.decimals,
            name: rawQuote.feeData.feeAsset.symbol,
            source: 'zetachain'
        } : undefined;

        feesDetails = {
          totalFee: rawQuote.feeData.totalFee,
          gasFee: rawQuote.feeData.gasFee,
          protocolFee: rawQuote.feeData.protocolFee,
          feeAsset: feeAssetSimple,
          totalFeeHumanReadable: feeAssetSimple && feeAssetSimple.decimals !== undefined
            ? formatUnits(rawQuote.feeData.totalFee, feeAssetSimple.decimals)
            : undefined,
          gasFeeHumanReadable: feeAssetSimple && feeAssetSimple.decimals !== undefined
            ? formatUnits(rawQuote.feeData.gasFee, feeAssetSimple.decimals)
            : undefined,
          protocolFeeHumanReadable: feeAssetSimple && feeAssetSimple.decimals !== undefined
            ? formatUnits(rawQuote.feeData.protocolFee, feeAssetSimple.decimals)
            : undefined,
        };
      }

      return {
        inputAsset: fromZRC20Asset,
        outputAsset: toZRC20Asset,
        inputAmount: amount, // Human-readable input
        inputAmountCryptoPrecision: amountInCryptoPrecision,
        outputAmount: formatUnits(rawQuote.amountOut, outputDecimals), // Convert to human-readable
        outputAmountCryptoPrecision: rawQuote.amountOut,
        routerAddress: rawQuote.routerAddress,
        path: rawQuote.path,
        fees: feesDetails,
      };
    } catch (error) {
      console.error("Error getting ZetaChain ZRC20 swap quote:", error);
      // TODO: Map error to a more user-friendly message if possible
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
    quote: ZetaQuote, // Use the obtained quote which includes amounts and potentially path/router
    // fromAsset: AppSimpleAsset, // Derived from quote
    // toAsset: AppSimpleAsset,   // Derived from quote
    amountInHumanReadable: string, // Keep for consistency, though quote has it
    amountOutMinHumanReadable: string, // User/UI derived based on slippage from quote.outputAmount
    // zetaChainRouterAddress: string, // Should come from quote if possible, or be a known constant
    deadline?: number // Optional: swap deadline timestamp
  ): Promise<string | null> {
    if (!this.isInitialized() || !this.client || !this.evmSigner) {
      console.error("ZetaChainService not initialized or signer not available.");
      return null;
    }
    const fromAsset = quote.inputAsset;
    const toAsset = quote.outputAsset;
    const zetaChainRouterAddress = quote.routerAddress; // Use router from quote

    if (!fromAsset.contractAddress || !fromAsset.decimals || !toAsset.decimals) {
        console.error("Asset details (contractAddress, decimals) are incomplete in quote.");
        return null;
    }
    if (!zetaChainRouterAddress) {
        console.error("ZetaChain router address not available in the quote or as a constant.");
        // TODO: Add a default/fallback router address for the current ZetaChain network if appropriate
        return null;
    }

    try {
      const amountInCryptoPrecision = parseUnits(amountInHumanReadable, fromAsset.decimals);
      const amountOutMinCryptoPrecision = parseUnits(amountOutMinHumanReadable, toAsset.decimals);
      const recipientAddress = await this.evmSigner.getAddress();
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const swapDeadline = deadline || currentTimestamp + 60 * 20; // 20 minutes default deadline

      // 1. Approve the router to spend the fromAsset ZRC20
      console.log(`Approving ZRC20 token ${fromAsset.symbol} for router ${zetaChainRouterAddress}`);
      const approveParams: ApproveTokenParams = {
        tokenAddress: fromAsset.contractAddress,
        spenderAddress: zetaChainRouterAddress,
        amount: amountInCryptoPrecision.toString(), // approveToken likely expects string crypto amount
        // txOptions: { gasLimit: "100000" } // Optional: gas options for approval
      };
      // Check if client.approveToken exists and use it
      if (typeof this.client.approveToken === 'function') {
        const approveTxResponse = await this.client.approveToken(approveParams);
        console.log(`Approval transaction submitted: ${approveTxResponse.hash}, waiting for confirmation...`);
        await approveTxResponse.wait(); // Wait for approval confirmation
        console.log(`ZRC20 ${fromAsset.symbol} approved for router ${zetaChainRouterAddress}.`);
      } else {
        // Fallback to manual ethers.js approval if client.approveToken is not available
        console.warn("client.approveToken not found, attempting manual ethers.js approval.");
        const zrc20Contract = new Contract(fromAsset.contractAddress, ERC20_ABI_MINIMAL_APPROVE, this.evmSigner);
        const approveTx = await zrc20Contract.approve(zetaChainRouterAddress, amountInCryptoPrecision);
        console.log(`Manual approval transaction submitted: ${approveTx.hash}, waiting for confirmation...`);
        await approveTx.wait();
        console.log(`ZRC20 ${fromAsset.symbol} (manual) approved for router ${zetaChainRouterAddress}.`);
      }

      // 2. Execute the swap
      const path = quote.path || [fromAsset.contractAddress, toAsset.contractAddress]; // Use path from quote or default direct
      if (path.length < 2) {
        console.error("Swap path is invalid. Must contain at least input and output tokens.");
        return null;
      }

      const swapArgs = [
        amountInCryptoPrecision.toString(),
        amountOutMinCryptoPrecision.toString(),
        path,
        recipientAddress,
        swapDeadline,
      ];

      const sendTxParams: SendParams = {
        contract: zetaChainRouterAddress,
        method: 'swapExactTokensForTokens', // Common UniswapV2-like router function
        args: swapArgs,
        value: '0', // Typically 0 for token swaps unless router handles native ZETA differently
        // txOptions: { gasLimit: "300000" } // Optional: gas options for swap
      };

      console.log("Executing ZetaChain ZRC20 swap with params:", sendTxParams);
      const swapTx = await this.client.send(sendTxParams);
      console.log(`ZetaChain ZRC20 swap transaction submitted: ${swapTx.hash}`);
      return swapTx.hash;

    } catch (error: any) {
      console.error("Error executing ZetaChain ZRC20 swap:", error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("Transaction rejected by user.");
      }
      // TODO: More specific error handling based on ZetaChain/ethers errors
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
      // This function facilitates sending a message (often an encoded function call)
      // from ZetaChain (via a ZRC20 token, typically ZETA) to a contract on a connected chain.
      // It can optionally carry ZRC-20 ZETA as value to be used on the destination chain or to pay for its execution.

      // The core mechanism is interacting with a ZetaChain system contract (e.g., ZetaConnectorZEVM or similar)
      // that is responsible for dispatching these cross-chain messages (CCTX).
      // We will use `this.client.send(params: SendParams)` for this interaction.

      // --- Parameters for the CCTX System Contract Call ---
      // These are hypothetical and need to be confirmed with ZetaChain's actual system contract ABI.
      // Refer to ZetaChain documentation for `SystemContract.sol` or `ZetaConnectorZEVM.sol`
      // and the specific function used for sending messages with value.

      // 1. ZetaChain System Contract Address (needs to be identified from ZetaChain docs for the target network)
      const zetaNetwork = process.env.NEXT_PUBLIC_ZETACHAIN_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

      // Get GatewayZEVM address based on network
      const gatewayAddress = zetaNetwork === 'mainnet'
        ? "0xfEDD7A6e3Ef1cC470fbfbF955a22D793dDC0F44E" // Mainnet GatewayZEVM
        : "0x6c533f7fe93fae114d0954697069df33c9b74fd7"; // Testnet GatewayZEVM (Athens 3)

      // Get ZRC20 ZETA (wZETA) address - this is the token used to pay for the 'amount' being sent
      const zrc20ZetaToken = await this.client.getZRC20GasToken(); // This should give the wZETA ZRC20
      if (!zrc20ZetaToken || !zrc20ZetaToken.zrc20_contract_address) {
          console.error("Could not fetch ZRC20 ZETA token address (wZETA).");
          throw new Error("Could not fetch ZRC20 ZETA token address (wZETA).");
        }
      const wZetaAddress = zrc20ZetaToken.zrc20_contract_address;
      const wZetaDecimals = zrc20ZetaToken.decimals || 18; // Assume 18 if not provided

      const amountToSendCrypto = parseUnits(zetaAmountToSendAsValueHumanReadable, wZetaDecimals);

      // 1. Approve GatewayZEVM to spend user's wZETA if amount > 0
      if (amountToSendCrypto.gt(0)) {
        console.log(`Approving ${zetaAmountToSendAsValueHumanReadable} wZETA (${wZetaAddress}) for GatewayZEVM ${gatewayAddress}`);
        const approveParams: ApproveTokenParams = {
            tokenAddress: wZetaAddress,
            spenderAddress: gatewayAddress,
            amount: amountToSendCrypto.toString(),
        };

        if (typeof this.client.approveToken === 'function') {
            const approveTxResponse = await this.client.approveToken(approveParams);
            console.log(`WZETA approval transaction submitted: ${approveTxResponse.hash}, waiting for confirmation...`);
            await approveTxResponse.wait();
            console.log(`WZETA approved for GatewayZEVM: ${gatewayAddress}.`);
        } else {
            console.warn("client.approveToken not found, attempting manual ethers.js approval for wZETA.");
            const wzetaContractInstance = new Contract(wZetaAddress, ERC20_ABI_MINIMAL_APPROVE, this.evmSigner);
            const approveTx = await wzetaContractInstance.approve(gatewayAddress, amountToSendCrypto);
            console.log(`Manual wZETA approval transaction submitted: ${approveTx.hash}, waiting for confirmation...`);
            await approveTx.wait();
            console.log(`WZETA approved (manual) for GatewayZEVM: ${gatewayAddress}.`);
        }
      }


      // 2. Prepare parameters for GatewayZEVM.withdrawAndCall
      // The method signature for GatewayZEVM.withdrawAndCall (for ZETA/WZETA):
      // withdrawAndCall(bytes memory receiver, uint256 amount, uint256 chainId, bytes calldata message, CallOptions calldata callOptions, RevertOptions calldata revertOptions)

      const callOptions = {
        gasLimit: gasLimitForRemoteCall, // Gas for the remote execution on destination chain
        isArbitraryCall: true // True if the message is arbitrary calldata for a contract
      };

      // Simplified RevertOptions: sending revert destination to the caller on ZetaChain, no value/gas on revert by default
      const callerAddressOnZetaChain = await this.evmSigner.getAddress(); // This is the EOA calling this service method
      const revertOptions = {
        revertAddress: ethers.utils.arrayify(callerAddressOnZetaChain), // Revert to caller on ZetaChain (must be bytes)
        callGasLimit: "0", // Gas for revert call (if any)
        value: "0",        // Value with revert call
        zrc20: ethers.constants.AddressZero // ZRC20 for revert value (if any)
      };

      // destinationContractAddress needs to be in bytes format for the 'receiver' parameter
      const destinationContractAddressBytes = ethers.utils.arrayify(destinationContractAddress);


      const sendTxParams: SendParams = {
        contract: gatewayAddress, // Address of GatewayZEVM
        method: 'withdrawAndCall(bytes,uint256,uint256,bytes,(uint256,bool),(bytes,uint256,uint256,address))',
        args: [
          destinationContractAddressBytes, // receiver (bytes)
          amountToSendCrypto.toString(),   // amount of wZETA (uint256)
          destinationChainId.toString(),   // chainId of destination (uint256)
          encodedFunctionCallData,         // message (bytes) - your encoded function call
          callOptions,                     // CallOptions (tuple)
          revertOptions                    // RevertOptions (tuple)
        ],
        value: "0", // Native ZETA sent to GatewayZEVM itself (usually 0, as WZETA is transferred via approve/transferFrom)
        txOptions: {
          // gasLimit: "500000" // Optional: Gas for the ZetaChain transaction itself (executing withdrawAndCall)
        },
      };

      console.log("Calling GatewayZEVM.withdrawAndCall with SendParams:", JSON.stringify(sendTxParams, null, 2));

      const tx = await this.client.send(sendTxParams);
      console.log(`CCTX initiated via GatewayZEVM.withdrawAndCall. ZetaChain Tx Hash: ${tx.hash}`);
      return tx.hash;

    } catch (error: any) {
      console.error("Error in callRemoteContractWithMessage:", error);
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("Transaction rejected by user.");
      }
      if (error.code === 'ACTION_REJECTED') {
        throw new Error("Transaction rejected by user.");
      }
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
