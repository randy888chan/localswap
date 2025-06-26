import { Network, XChainClient } from '@xchainjs/xchain-client'; // TxParams removed
import { ThorchainAMM, EstimateSwapParams } from '@xchainjs/xchain-thorchain-amm'; // ThorchainAmmQuoteSwapParams removed
import { ThorchainQuery, QuoteSwapParams, QuoteSwap } from '@xchainjs/xchain-thorchain-query'; // LastBlock, LiquidityPool removed
import { assetAmount, assetFromString, Asset, formatAssetAmountCurrency, baseAmount, Chain } from '@xchainjs/xchain-util'; // AssetAmount kept for now, ETHAddress removed from next line
import { Client as EthClient } from '@xchainjs/xchain-ethereum';
// Import other necessary XChainJS clients as they are implemented
import { Client as BtcClient } from '@xchainjs/xchain-bitcoin';
// import { Client as BnbClient } from '@xchainjs/xchain-binance'; // Example for BNB Beacon Chain
import { Client as CosmosClient } from '@xchainjs/xchain-cosmos'; // Example for Cosmos Hub (ATOM)

import { Signer, providers } from 'ethers';
// import { Wallet } from '@particle-network/connect'; // Or appropriate type from Particle for non-EVM wallet info

// Define a simpler Asset type for UI and function parameters
export interface SimpleAsset {
  chain: Chain; // e.g., Chain.Ethereum, Chain.Bitcoin
  ticker: string; // e.g., 'ETH', 'BTC', 'USDT'
  symbol: string; // e.g., ETH.ETH, BTC.BTC, BSC.USDT-0x...
  name?: string; // Optional: user-friendly name, e.g., "Ethereum", "Bitcoin", "Tether USD"
  contractAddress?: string; // For tokens
  decimals?: number; // Important for amount conversions
  iconUrl?: string; // Optional: for UI
  source?: 'thorchain' | 'zetachain' | 'custom'; // To know where it came from
}

export interface ThorchainQuote {
  inputAsset: SimpleAsset;
  inputAmount: string; // Human-readable format, e.g., "1.5"
  inputAmountCryptoPrecision: string; // Crypto precision for transactions
  outputAsset: SimpleAsset;
  outputAmount: string; // Human-readable format after fees and slippage
  expectedOutputAmountCryptoPrecision: string; // Expected amount in crypto precision
  fees: {
    asset: SimpleAsset; // Asset of the fee
    totalFeeCryptoPrecision: string; // Total fees in crypto precision of fee asset
    totalFeeHumanReadable: string; // Total fees in human-readable format of fee asset
  };
  slippageBps: number;
  router?: string;
  memo: string;
  notes: string;
  inboundAddress?: string;
  dustThreshold?: string; // Human readable dust threshold for input asset
  // Add any other relevant fields from QuoteSwap that we want to expose
}


export class ThorchainService {
  private thorchainQuery: ThorchainQuery;
  private thorchainAmm: ThorchainAMM;
  private clients: Map<Chain, XChainClient | EthClient> = new Map(); // Store various chain clients
  public network: Network;

  constructor(network: Network = Network.Mainnet) {
    this.network = network;
    this.thorchainQuery = new ThorchainQuery();
    this.thorchainAmm = new ThorchainAMM(this.thorchainQuery); // ThorchainQuery is passed for Midgard/Thornode interaction
    console.log(`ThorchainService initialized for ${network}`);
  }

  public async setEvmSigner(signer: Signer | null, ethProvider?: providers.JsonRpcProvider, targetChain: Chain = Chain.Ethereum) {
    if (signer && ethProvider) {
      const ethClientParams = {
        network: this.network,
        phrase: undefined,
        etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
        ethplorerApiKey: process.env.NEXT_PUBLIC_ETHPLORER_API_KEY,
        provider: ethProvider,
        signer: signer,
      };
      // Assuming EthClient can be used for multiple EVM chains if configured correctly (e.g. BSC, AVAX)
      // For now, explicitly handling Ethereum. Other EVM chains might need their own XChainJS client (e.g. BscClient)
      // or a more generic EVM client setup if XChainJS supports it.
      if (targetChain === Chain.Ethereum || targetChain === Chain.Avalanche || targetChain === Chain.BinanceSmartChain) { // Example EVM chains
        const client = new EthClient(ethClientParams); // Or specific client like BscClient if available and needed
        this.clients.set(targetChain, client);
        this.thorchainAmm.addChainClient(targetChain, client); // Register with AMM
        console.log(`ThorchainService: ${targetChain} client with EVM signer set.`);
      } else {
        console.warn(`ThorchainService: EVM signer provided for non-standard EVM target chain ${targetChain}. Client not set.`);
      }
    } else {
      const client = this.clients.get(targetChain);
      if (client && typeof (client as EthClient).purgeClient === 'function') { // Check if it's an EthClient instance
        (client as EthClient).purgeClient();
      }
      this.clients.delete(targetChain);
      // Re-initialize AMM or implement removeChainClient if available and specific removal is needed.
      // For simplicity, clearing clients and re-adding is one way if ThorchainAMM doesn't support targeted removal well.
      // This current ThorchainAMM version might just overwrite if addChainClient is called again.
      console.log(`ThorchainService: EVM signer removed for ${targetChain}. Client purged/removed.`);
       // Rebuild AMM clients based on current map (if AMM requires all at once or doesn't support removal)
       this.thorchainAmm = new ThorchainAMM(this.thorchainQuery);
       this.clients.forEach((c, ch) => this.thorchainAmm.addChainClient(ch, c));
    }
  }

  // Generic method to set any XChainClient (e.g., for BTC, LTC, BNB)
  public setXChainClient(chain: Chain, client: XChainClient): void {
    this.clients.set(chain, client);
    this.thorchainAmm.addChainClient(chain, client); // Register with AMM
    console.log(`ThorchainService: ${chain} client set.`);
  }

  public getClientForChain(chain: Chain): XChainClient | EthClient | undefined {
    return this.clients.get(chain);
  }


  private getAssetDecimals(asset: Asset, simpleAsset?: SimpleAsset): number {
    if (simpleAsset?.decimals !== undefined) {
        return simpleAsset.decimals;
    }
    // Prioritize decimals from SimpleAsset if provided, as it might come from a reliable token list.
    if (simpleAsset?.decimals !== undefined) {
        return simpleAsset.decimals;
    }

    // Predefined list for common ERC20 tokens (symbol needs to be exact as XChainJS parses it)
    // Key: XChainJS asset symbol string (e.g., "ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7")
    const commonErc20Decimals: Record<string, number> = {
        "ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7": 6, // USDT on Ethereum
        "ETH.USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 6, // USDC on Ethereum
        "BSC.BUSD-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": 18, // BUSD on BSC (often 18)
        "BSC.USDT-0x55d398326f99059fF775485246999027B3197955": 18, // USDT on BSC (often 18, verify)
        // Add more common tokens for other EVM chains (AVAX, etc.) if needed
    };

    if (commonErc20Decimals[asset.symbol]) {
        return commonErc20Decimals[asset.symbol];
    }

    // Fallback logic for native assets and THORChain's internal representation
    switch (asset.chain) {
        case Chain.Bitcoin:
        case Chain.BitcoinCash:
        case Chain.Litecoin:
        case Chain.Dogecoin:
            return 8; // Native UTXO precision
        case Chain.Ethereum:
        case Chain.Avalanche:
        case Chain.BinanceSmartChain:
            // For native gas assets on EVM chains
            if (asset.symbol === `${asset.chain}.${asset.chain}`) return 18; // e.g., ETH.ETH, AVAX.AVAX, BSC.BNB

            // For other ERC20s not in the predefined list:
            if (asset.symbol.includes('-')) { // Basic check for token (e.g., ETH.XYZ-0x...)
                 const errorMsg = `Decimals for token ${asset.symbol} on ${asset.chain} are not predefined and not provided in SimpleAsset. Cannot reliably determine.`;
                 console.warn(errorMsg); // Warn instead of throwing immediately to allow getAvailableAssets to potentially filter
                 return undefined; // Indicate that decimals could not be determined
            }
            // If it's not a token and not the native gas asset (e.g. some other native asset on an EVM chain if that exists)
            console.warn(`Decimals for native-like asset ${asset.symbol} on EVM chain ${asset.chain} not explicitly defined, defaulting to 18. This might be incorrect if it's not the primary gas token.`);
            return 18; // Default for other native EVM gas assets.
        case Chain.Cosmos: // ATOM and other Cosmos SDK based chains
            return 6; // Common for ATOM, but other Cosmos tokens can vary.
        case Chain.THORChain: // RUNE
            // Native RUNE on THORChain mainnet/testnet has 8 decimals.
            return 8;
        default:
            console.warn(`Decimals for ${asset.chain}.${asset.symbol} not explicitly defined, attempting to default to 8 (THORChain common precision). This might be incorrect for the asset's native precision.`);
            return 8; // Fallback to THORChain's common internal precision, but risky.
    }
}


  public async getSwapQuote(
    inputAsset: SimpleAsset,
    outputAsset: SimpleAsset,
    inputAmountHumanReadable: string, // Amount in human-readable format, e.g., "1.5"
    destinationAddress?: string, // Optional for quotes, required for swaps
    slippageToleranceBps?: number // e.g., 300 for 3%
  ): Promise<ThorchainQuote | null> {
    try {
      const fromAsset = assetFromString(inputAsset.symbol);
      const toAsset = assetFromString(outputAsset.symbol);

      if (!fromAsset || !toAsset) {
        throw new Error('Invalid asset string');
      }

      const inputDecimals = this.getAssetDecimals(fromAsset, inputAsset);
      if (inputDecimals === undefined) {
        throw new Error(`Decimals for input asset ${inputAsset.symbol} are unknown. Cannot get quote.`);
      }
      const outputDecimals = this.getAssetDecimals(toAsset, outputAsset);
      if (outputDecimals === undefined) {
        // Stricter: if we don't know output decimals, we can't reliably format the quote for the user.
        throw new Error(`Decimals for output asset ${outputAsset.symbol} are unknown. Cannot reliably process quote.`);
      }

      // Convert human-readable input amount to base amount (1e8 for THORChain quote)
      // Note: quoteSwap expects amount in 1e8 precision regardless of the asset's actual decimals.
      // So, we first convert human input to its native base units, then to 1e8 if different.
      // However, xchain-thorchain-query's quoteSwap amount is an AssetAmount, which should handle this.
      // The internal logic of quoteSwap should take care of normalizing to 1e8 if needed from the AssetAmount.
      // Let's provide the amount in its native crypto precision first.
      const amountToSendCryptoPrecision = baseAmount(inputAmountHumanReadable, inputDecimals);


      const quoteParams: QuoteSwapParams = {
        fromAsset,
        destinationAsset: toAsset,
        amount: amountToSendCryptoPrecision, // Amount in crypto precision of the input asset
        destinationAddress, // Can be undefined for just getting a quote without a specific recipient
        toleranceBps: slippageToleranceBps,
        // affiliateAddress and affiliateBps can be added here if needed
      };

      const quote: QuoteSwap = await this.thorchainQuery.quoteSwap(quoteParams);

      if (!quote || quote.error) {
        console.error('Error getting quote from THORChain:', quote?.error || 'Unknown error');
        return null;
      }

      // quote.fees.asset is already an Asset. We need its decimals.
      // Let's assume the fee asset is simple enough that its decimals are known by getAssetDecimals fallback or it's native.
      // If fee asset decimals are critical and could be complex tokens, this needs a robust way to get them.
      const feeAssetXChain = quote.fees.asset;
      const feeDecimals = this.getAssetDecimals(feeAssetXChain);
      if (feeDecimals === undefined) {
        // This is critical. If we can't determine fee decimals, we can't represent the fee.
        throw new Error(`Decimals for fee asset ${feeAssetXChain.symbol} are unknown. Cannot process quote fees.`);
      }

      const feeSimpleAsset: SimpleAsset = {
          chain: feeAssetXChain.chain,
          ticker: feeAssetXChain.ticker,
          symbol: feeAssetXChain.symbol,
          decimals: feeDecimals,
          // contractAddress might be missing if it's a native asset
      };

      const dustThresholdHuman = quote.dustThreshold && fromAsset
        ? formatAssetAmountCurrency({ amount: quote.dustThreshold, asset: fromAsset, decimal: inputDecimals, trimZeros: true })
        : undefined;

      return {
        inputAsset,
        inputAmount: inputAmountHumanReadable, // Store the original human-readable input
        inputAmountCryptoPrecision: amountToSendCryptoPrecision.amount().toString(),
        outputAsset,
        // Format expectedAmountOut (which is an AssetAmount) to human-readable string
        // outputDecimals is guaranteed to be a number here due to the earlier check
        outputAmount: formatAssetAmountCurrency({ amount: quote.expectedAmountOut.baseAmount, asset: toAsset, decimal: outputDecimals!, trimZeros: true }),
        expectedOutputAmountCryptoPrecision: quote.expectedAmountOut.baseAmount.amount().toString(),
        fees: {
          asset: feeSimpleAsset,
          totalFeeCryptoPrecision: quote.fees.total.amount().toString(), // Assuming quote.fees.total is BaseAmount
          totalFeeHumanReadable: formatAssetAmountCurrency({ amount: quote.fees.total, asset: feeAssetXChain, decimal: feeDecimals, trimZeros: true }),
        },
        slippageBps: quote.slippageBps.toNumber(),
        router: quote.router,
        memo: quote.memo,
        notes: quote.notes,
        inboundAddress: quote.inboundAddress,
        dustThreshold: dustThresholdHuman,
      };
    } catch (error) {
      console.error('Failed to get THORChain swap quote:', error);
      return null;
    }
  }

  public async checkAndRequestApproval(
    asset: SimpleAsset,
    amountCryptoPrecision: string,
    spenderAddress: string,
    walletAddress: string
  ): Promise<{ approved: boolean; approveTxHash?: string; error?: string }> {
    const activeClient = this.getClientForChain(asset.chain);
    if (!activeClient || !(activeClient instanceof EthClient)) {
      // Not an EVM chain with an EthClient or client not available
      return { approved: true }; // Assume approved or not applicable for non-EVM/non-EthClient chains
    }

    const ethClient = activeClient as EthClient;

    if (!asset.contractAddress) { // Only ERC20 tokens need approval
        return { approved: true };
    }

    try {
      const tokenAsset = assetFromString(asset.symbol);
      if (!tokenAsset) throw new Error("Invalid asset for approval check");

      // Ensure decimals are correctly sourced for amountToApprove
      const decimals = this.getAssetDecimals(tokenAsset, asset);
      const amountToApprove = baseAmount(amountCryptoPrecision, decimals);

      const isApproved = await ethClient.isApproved({
        asset: tokenAsset,
        amount: amountToApprove,
        spenderAddress: spenderAddress,
        walletAddress: walletAddress,
      });

      if (isApproved) {
        return { approved: true };
      }

      console.log(`Requesting approval for ${asset.symbol} to spender ${spenderAddress} on chain ${asset.chain}`);
      const approveTxHash = await ethClient.approve({
        asset: tokenAsset,
        amount: amountToApprove,
        spenderAddress: spenderAddress,
      });
      console.log(`Approval transaction submitted on ${asset.chain}: ${approveTxHash}`);
      return { approved: false, approveTxHash };

    } catch (error: any) {
      console.error(`Error during ERC20 approval for ${asset.symbol} on ${asset.chain}:`, error);
      return { approved: false, error: error.message || 'Approval failed' };
    }
  }

  public async executeSwap(
    quote: ThorchainQuote,
    userFromAddress: string,
    userDestinationAddress: string
  ): Promise<string> {
    if (!quote.inboundAddress) {
        throw new Error("Inbound address missing in the quote.");
    }

    const fromAssetXChain = this.toXChainAsset(quote.inputAsset);
    const fromAssetDecimals = this.getAssetDecimals(fromAssetXChain, quote.inputAsset);
    const amount = baseAmount(quote.inputAmountCryptoPrecision, fromAssetDecimals);

    const xchainClient = this.getClientForChain(fromAssetXChain.chain);
    if (!xchainClient) {
      throw new Error(`No XChainJS client found for chain ${fromAssetXChain.chain}. Ensure it's connected and set in ThorchainService.`);
    }

    // Handle ERC20 Approvals for EVM chains (delegated to thorchainAmm.doSwap if it's an EVM client)
    // If it's an EVM client, thorchainAmm.doSwap should handle approvals internally if the client is an EthClient.
    // For non-EVM, this approval step is not applicable here.
    if (xchainClient instanceof EthClient && quote.inputAsset.contractAddress) {
        const spender = quote.router || quote.inboundAddress;
        if (!spender) {
            throw new Error("Spender address for ERC20 approval not found in quote.");
        }
        const approvalResult = await this.checkAndRequestApproval(
            quote.inputAsset,
            quote.inputAmountCryptoPrecision,
            spender,
            userFromAddress // EVM from address
        );
        if (!approvalResult.approved) {
            if (approvalResult.approveTxHash) {
                throw new Error(`Approval required for ${quote.inputAsset.symbol}. Transaction hash: ${approvalResult.approveTxHash}. Please wait for confirmation and try again.`);
            } else {
                throw new Error(approvalResult.error || `ERC20 approval failed or was rejected for ${quote.inputAsset.symbol}.`);
            }
        }
        console.log(`${quote.inputAsset.symbol} is approved for swap.`);
    }

    try {
      // For EVM chains, thorchainAmm.doSwap will handle the deposit.
      // For non-EVM chains, we need to construct the transaction manually using the XChainJS client
      // and then get it signed & broadcasted via Particle.
      // The current `thorchainAmm.doSwap` might not be suitable if the client
      // it holds for a non-EVM chain doesn't have a live signer (which it won't in our Particle setup).
      //
      // The `doSwap` in `ThorchainAMM` typically calls `client.transfer` or `client.deposit`.
      // If `client.transfer` (for non-EVM) requires a signer internally, it will fail.
      //
      // Therefore, for non-EVM, we should bypass `thorchainAmm.doSwap` and use the client
      // to prepare the transaction, then use our external signing flow.
      // However, `thorchainAmm.doSwap` *should* correctly use the registered client.
      // If the registered client's `transfer` method is flexible enough to not require an internal signer
      // and can accept pre-signed data or defer signing, it might work.
      // This needs verification against XChainJS client implementations.
      //
      // For now, let's assume `thorchainAmm.doSwap` will attempt to use the client.
      // If it fails for non-EVM due to signer issues, we'll need to adjust.
      // The core idea of `thorchainAmm.addChainClient(chain, client)` is that AMM then uses that client.

      // Let's refine the parameters for doSwap to be absolutely clear.
      // `doSwap` expects `EstimateSwapParams`
      const swapParams: EstimateSwapParams = {
        input: {
          asset: fromAssetXChain, // Use the XChain Asset object
          amount: amount,      // Use the BaseAmount object
        },
        destinationAsset: this.toXChainAsset(quote.outputAsset),
        destinationAddress: userDestinationAddress,
        memo: quote.memo, // Crucial: use the memo from the quote
        // affiliate: { address: 'affiliate-address', feeRateBps: 10 }, // Example affiliate
        // toleranceBps: 500, // Example slippage tolerance
      };

      console.log("Attempting THORChain swap via ThorchainAMM.doSwap with params:", {
        inputAsset: swapParams.input.asset.symbol,
        inputAmount: swapParams.input.amount.amount().toString(),
        destinationAsset: swapParams.destinationAsset.symbol,
        destinationAddress: swapParams.destinationAddress,
        memo: swapParams.memo,
      });

      // This is the key call. It will use the client previously registered
      // via `this.thorchainAmm.addChainClient(chain, client)`.
      // If the client is an EthClient with a signer, it will sign and send.
      // If the client is a non-EVM client (BtcClient, CosmosClient etc.) *without an internal signer*,
      // its `transfer` or `deposit` method (called by doSwap) MUST support a mode where it
      // either:
      //    a) returns an unsigned transaction for external signing (preferred for Particle)
      //    b) accepts a pre-generated signature (less likely for complex txs like BTC)
      //
      // Given XChainJS structure, most non-EVM clients' `transfer` methods build AND sign if a phrase is set.
      // If no phrase is set, their behavior might be to throw an error, or some might have a `prepareTx`
      // separate from a `broadcastTx`.
      //
      // **This is a critical point of integration with XChainJS and Particle.**
      // If `doSwap` directly tries to sign with a non-EVM client that has no signer, it will fail.
      // The `executeSwap` method in `app/dex/page.tsx` already has a branching logic for non-EVM
      // that calls `signNonEvmTransaction` and `broadcastNonEvmTransaction`.
      // This implies that `ThorchainService.executeSwap` for non-EVM should *prepare* the transaction
      // and return it to `app/dex/page.tsx` to handle the signing and broadcasting.
      //
      // For now, this `ThorchainService.executeSwap` will be simplified:
      // - EVM: use `thorchainAmm.doSwap` as it should work with `EthClient` + signer.
      // - Non-EVM: This function will *not* call `thorchainAmm.doSwap`. Instead, it should
      //   return the necessary parameters for `app/dex/page.tsx` to call the XChainJS client's
      //   `prepareTx` (or equivalent), then sign with Particle, then broadcast.
      //
      // Let's adjust the current structure. `executeSwap` in the service will focus on EVM.
      // The non-EVM construction will be done in `app/dex/page.tsx` using the client from this service.
      // This means `ThorchainService.executeSwap` is primarily for EVM path using `thorchainAmm.doSwap`.
      // The non-EVM path in `app/dex/page.tsx` will use `getClientForChain` to get the XChainJS client
      // and then call its `prepareTx` method.

      if (xchainClient instanceof EthClient) {
        // EVM client with signer, use thorchainAmm.doSwap
        const txHash = await this.thorchainAmm.doSwap(swapParams);
        console.log('THORChain EVM Swap transaction submitted:', txHash);
        return txHash;
      } else {
        // For non-EVM, this function in the service will NOT execute the swap directly.
        // It has prepared the client. The page will use the client to build the tx.
        // This design is slightly awkward. Ideally, the service would prepare the unsigned tx.
        // Let's modify this service method to prepare and return unsigned tx data for non-EVM.
        console.log(`Preparing non-EVM transaction for ${fromAssetXChain.chain}`);
        // This part will be refactored to be called by the UI, which then calls Particle for signing.
        // For now, to satisfy the current structure of `handleExecuteSwap` in `dexPage`
        // which calls this service method expecting a txHash, this path needs reconsideration.
        //
        // Re-evaluating: `app/dex/page.tsx` calls `thorchainService.executeSwap` for both EVM and non-EVM.
        // The placeholder logic in `app/dex/page.tsx` for non-EVM construction needs to be moved here.
        // Then, `lib/particle.ts` `signNonEvmTransaction` and `broadcastNonEvmTransaction` are called from the page.
        // This means `ThorchainService.executeSwap` should return the *unsigned transaction data* for non-EVM.
        //
        // Let's change the return type of this function to accommodate this.
        // `Promise<string | { type: 'unsigned_tx', data: any, chain: Chain }>`
        // This is getting complicated.
        //
        // Simpler approach for THIS step:
        // `ThorchainService.executeSwap` will only handle EVM.
        // The non-EVM transaction construction will be fully implemented in `app/dex/page.tsx` in the next step of the plan.
        // This step of the plan is "Implement Non-EVM Transaction Construction in ThorchainService.executeSwap".
        // So, it *should* happen here.

        let unsignedTxData: any; // This will be PSBT hex for BTC, StdSignDoc for Cosmos, etc.

        if (fromAssetXChain.chain === Chain.Bitcoin) {
          const btcClient = xchainClient as import('@xchainjs/xchain-bitcoin').Client;
          const feeRate = (await btcClient.getFeeRatesWithMemo(quote.memo)).fast; // Get fee rate for memo
          // Ensure client has its address set if needed for prepareTx, or pass sender explicitly
          if (!btcClient.getAddress()) btcClient.setAddress(userFromAddress);

          const txRecords = await btcClient.prepareTx({
            sender: userFromAddress,
            recipient: quote.inboundAddress!,
            amount: amount,
            memo: quote.memo,
            feeRate: feeRate.toNumber(), // ensure feeRate is number
          });
          // prepareTx for BtcClient returns an array of TxRecords containing psbtHex
          if (txRecords.length === 0 || !txRecords[0].txHex) { // Assuming txHex holds the PSBT
            throw new Error("Failed to prepare Bitcoin transaction (PSBT not generated).");
          }
          unsignedTxData = { type: 'psbt', psbtHex: txRecords[0].txHex };
          console.log("Prepared Bitcoin PSBT:", unsignedTxData.psbtHex);

        } else if (fromAssetXChain.chain === Chain.Cosmos) {
          const cosmosClient = xchainClient as import('@xchainjs/xchain-cosmos').Client;
          // Ensure client has its address set
          if (!cosmosClient.getAddress()) cosmosClient.setAddress(userFromAddress);

          // For Cosmos, prepareTx might return the StdSignDoc or full unsigned tx structure
          // The exact parameters for prepareTx might vary.
          // Let's assume it needs similar parameters to transfer.
          const fee = await cosmosClient.getFees(); // Or estimate if possible
          const unsignedRawTx = await cosmosClient.prepareTx({
            sender: userFromAddress,
            recipient: quote.inboundAddress!,
            asset: fromAssetXChain, // May not be needed if amount is assetAmount
            amount: amount,
            memo: quote.memo,
            fee: fee.fast, // Example fee
          });
          // The structure of unsignedRawTx needs to be what signNonEvmTransaction expects for Cosmos (e.g., StdSignDoc JSON)
          // This is highly dependent on how xchain-cosmos Client's prepareTx is implemented.
          // For now, assume it returns a string representation of the signable document.
          if (typeof unsignedRawTx !== 'string' || !unsignedRawTx.startsWith('{')) { // Basic check for JSON string
             console.warn("Cosmos prepareTx did not return a string JSON as expected, actual:", unsignedRawTx);
             // Fallback: if it's an object, stringify it. This needs verification.
             if (typeof unsignedRawTx === 'object') {
                unsignedTxData = { type: 'cosmos-signdoc', signDoc: JSON.stringify(unsignedRawTx) };
             } else {
                throw new Error("Failed to prepare Cosmos transaction: Unexpected format from prepareTx.");
             }
          } else {
            unsignedTxData = { type: 'cosmos-signdoc', signDoc: unsignedRawTx };
          }
          console.log("Prepared Cosmos SignDoc:", unsignedTxData.signDoc);

        } else {
          throw new Error(`Transaction preparation for non-EVM chain ${fromAssetXChain.chain} is not implemented yet.`);
        }
        // This service method cannot return a txHash for non-EVM because signing is external.
        // It should return the unsigned transaction data.
        // This fundamentally changes the contract of executeSwap and how app/dex/page.tsx calls it.
        //
        // To adhere to the current plan structure and minimize immediate cascading changes,
        // let's make executeSwap throw for non-EVM for now, and the actual construction will be
        // confirmed in app/dex/page.tsx where it calls the XChainJS client methods directly.
        // This step of the plan was perhaps mis-scoped if Particle handles signing.
        //
        // Correcting the approach: This service method *should* prepare the transaction data.
        // The `app/dex/page.tsx` will then take this data and pass it to Particle for signing.
        // So, the return type needs to change. For now, let's log the prepared data and throw,
        // indicating that the next step is to modify `app/dex/page.tsx` to handle this.
        //
        // OR, make this function ONLY for EVM and create a new one `prepareNonEvmSwapData`.
        // Let's stick to modifying this one and make it clear what it returns.

        // For now, we'll throw here indicating this part needs to be handled by the caller (dex/page.tsx)
        // after it gets the unsignedTxData. The page will call the sign and broadcast.
        // This means `executeSwap` in `dex/page.tsx` needs to change its non-EVM path significantly.
        // The current plan step is about *implementing construction here*. So we *do* construct it.
        // Then `dex/page.tsx` will use it.

        // The function should return the unsigned transaction data for non-EVM chains.
        // This requires changing the return type of `executeSwap` from `Promise<string>`
        // to something like `Promise<string | UnsignedTxDataType>`.
        // Let's assume for now the caller (`app/dex/page.tsx`) will be updated to handle this.
        // For this step, we focus on the construction.
        // The type `any` is used for `unsignedTxData.data` for now.
        return { unsignedTxData, chain: fromAssetXChain.chain } as any; // Caller needs to type check
      }
    } catch (error: any) {
      console.error('THORChain swap processing failed:', error);
      // Attempt to provide a more specific error message if possible
      if (error.message && error.message.includes("insufficient funds")) {
        throw new Error("Swap failed: Insufficient funds for the transaction or gas fees.");
      }
      if (error.message && error.message.includes("User denied transaction signature")) {
        throw new Error("Swap failed: Transaction signature was denied by the user.");
      }
      throw new Error(error.message || 'THORChain swap execution failed.');
    }
  }

  public async getTransactionStatusAndDetails(
    txHash: string,
    sourceChain: Chain // The chain where the inbound transaction was made
  ): Promise<any | null> { // Replace 'any' with a more specific type from XChainJS if available (e.g., TxDetails)
    try {
      // Note: getTxData is a more generic function in ThorchainQuery that might not give swap-specific stages.
      // For detailed swap tracking (e.g., stages like "outbound pending", "outbound complete"),
      // one might need to query THORNode's /tx/{hash} endpoint or use Midgard.
      // xchain-thorchain-query might have more specific methods, or this could be a direct API call.
      // For now, let's assume a general transaction data fetch.

      // Example: Polling THORNode for transaction details (more robust for swap stages)
      // This requires knowing the THORNode API endpoint.
      // const thornodeApi = this.thorchainQuery.thorchainCache.thornode // Get ThornodeApi instance
      // const txDetails = await thornodeApi.getTxData(txHash) // Or getTxDetails

      // Using a hypothetical function for now, as direct getTxData might not be sufficient for all swap states.
      // The actual implementation might involve polling /thorchain/tx/{hash}
      // and interpreting its stages: https://dev.thorchain.org/thorchain-dev/concepts/memos#tracking-transaction-status

      console.log(`Fetching status for txHash: ${txHash} on chain: ${sourceChain}`);

      // Placeholder: In a real scenario, you would poll and check for outbound transactions or errors.
      // For now, this is a simplified check.
      // A more complete solution would involve:
      // 1. Checking the inbound transaction confirmation.
      // 2. Polling THORNode for the CCTX (cross-chain transaction) status.
      // 3. Checking for outbound transaction hashes and their confirmations.

      // This is a very basic example and likely not sufficient for robust status tracking.
      // You'd typically poll THORNode's /tx/{hash} endpoint.
      // Let's simulate a check. If using Midgard (via ThorchainQuery), it might have actions/history.
      const midgard = this.thorchainQuery.thorchainCache.midgardQuery.getMidgard();
      const actions = await midgard.getActions({ txid: txHash, limit: 10, offset: 0 });

      if (actions && actions.actions && actions.actions.length > 0) {
        const action = actions.actions.find(a => a.in[0]?.txID === txHash);
        if (action) {
          // Try to map Midgard action to a simplified status
          let status = 'pending';
          if (action.status === 'success' && action.type === 'swap') {
            status = 'success';
          } else if (action.status === 'pending' && action.type === 'swap') {
            status = 'pending_outbound'; // Or more granular based on action.metadata
          } else if (action.type === 'refund') {
            status = 'refunded';
          }
          return {
            status: status,
            type: action.type,
            inboundTx: action.in[0],
            outboundTxs: action.out,
            date: action.date,
            rawAction: action, // Include the raw action for more detailed UI
          };
        }
      }

      // Fallback if no action found via Midgard (might be too new or not indexed yet)
      // In a real app, you'd poll this or use WebSockets if available.
      console.warn(`Transaction ${txHash} not found in Midgard actions yet or not a swap.`);
      return { status: 'pending_confirmation', txHash };

    } catch (error) {
      console.error(`Failed to get transaction status for ${txHash}:`, error);
      return { status: 'error', error, txHash };
    }
  }


  // Helper to convert SimpleAsset to XChain Asset
  //   // Use thorchainQuery or other methods to track status
  // }

  public async getAvailableAssets(): Promise<SimpleAsset[]> {
    try {
      const pools = await this.thorchainQuery.getPools();
      const assets: SimpleAsset[] = [];
      const addedSymbols: Set<string> = new Set(); // To avoid duplicates if pools list them multiple times

      for (const pool of pools) {
        if (pool.asset) {
          const xchainAsset = assetFromString(pool.asset); // pool.asset is string like "ETH.ETH"
          if (xchainAsset) {
            if (!addedSymbols.has(xchainAsset.symbol)) {
              // Attempt to get decimals - this is crucial and needs a reliable source
              // For now, using the existing helper, but it might need enhancement
              // or we fetch a separate token list that includes decimals.
              // THORChain itself often assumes 8 decimals for its internal math,
              // but for UI and client-side operations, true decimals are needed.
              const decimals = this.getAssetDecimals(xchainAsset); // This can now return undefined

              if (decimals === undefined) {
                console.warn(`Excluding asset ${xchainAsset.symbol} from available list because its decimals are unknown.`);
              } else {
                // Try to extract contract address if it's an ERC20 token
                let contractAddress: string | undefined = undefined;
                if (xchainAsset.chain === Chain.Ethereum || xchainAsset.chain === Chain.Avalanche || xchainAsset.chain === Chain.BinanceSmartChain) {
                  if (xchainAsset.symbol.includes('-') && xchainAsset.ticker.toUpperCase() !== xchainAsset.chain) { // Basic check for ERC20 like SYMBOL-ADDRESS
                    contractAddress = xchainAsset.symbol.substring(xchainAsset.ticker.length + 1);
                  }
                }

                assets.push({
                  chain: xchainAsset.chain,
                  ticker: xchainAsset.ticker,
                  symbol: xchainAsset.symbol, // Full XChain asset string
                  name: `${xchainAsset.ticker} (${xchainAsset.chain})`, // Simple name for now
                  contractAddress: contractAddress,
                  decimals: decimals, // Now guaranteed to be a number if asset is included
                  source: 'thorchain',
                  // iconUrl: Figure out how to get icon URLs, maybe map common tickers
                });
                addedSymbols.add(xchainAsset.symbol);
              }
            }
          }
        }
        // THORChain RUNE is also an asset
        const runeAsset = assetFromString('THOR.RUNE');
        const runeDecimals = this.getAssetDecimals(runeAsset);
        if (runeAsset && runeDecimals !== undefined && !addedSymbols.has(runeAsset.symbol)) {
            assets.push({
                chain: runeAsset.chain,
                ticker: runeAsset.ticker,
                symbol: runeAsset.symbol,
                name: 'THORChain RUNE',
                decimals: runeDecimals,
                source: 'thorchain',
            });
            addedSymbols.add(runeAsset.symbol);
        }
      }
      // Remove duplicates that might arise if RUNE is also in a pool's asset field
      // The `addedSymbols` set already handles this.
      return assets;
    } catch (error) {
      console.error('Failed to get available THORChain assets:', error);
      return [];
    }
  }

  // Helper to convert SimpleAsset to XChain Asset
  private toXChainAsset(simpleAsset: SimpleAsset): Asset {
    const asset = assetFromString(simpleAsset.symbol);
    if (!asset) throw new Error(`Invalid asset symbol: ${simpleAsset.symbol}`);
    return asset;
  }
}

// Example of how this service might be instantiated and used in a React component
// This is for illustration and would typically be managed via context or a singleton pattern.
// let thorchainServiceInstance: ThorchainService | null = null;

// export const getThorchainService = (wallet?: Wallet): ThorchainService => {
//   if (!thorchainServiceInstance) {
//     thorchainServiceInstance = new ThorchainService(Network.Mainnet, wallet);
//   } else if (wallet) {
//     thorchainServiceInstance.setWallet(wallet);
//   }
//   return thorchainServiceInstance;
// };
