import { Network, TxParams } from '@xchainjs/xchain-client';
import { ThorchainAMM, QuoteSwapParams as ThorchainAmmQuoteSwapParams, EstimateSwapParams } from '@xchainjs/xchain-thorchain-amm';
import { ThorchainQuery, QuoteSwapParams, QuoteSwap, LastBlock, LiquidityPool } from '@xchainjs/xchain-thorchain-query';
import { assetAmount, assetFromString, Asset, formatAssetAmountCurrency, baseAmount, AssetAmount } from '@xchainjs/xchain-util';
import { Client as EthClient, ETHAddress } from '@xchainjs/xchain-ethereum';
import { Signer, providers } from 'ethers';
import { Chain } from '@xchainjs/xchain-util';

// Define a simpler Asset type for UI and function parameters
export interface SimpleAsset {
  chain: Chain; // e.g., Chain.Ethereum, Chain.Bitcoin
  ticker: string; // e.g., 'ETH', 'BTC', 'USDT'
  symbol: string; // e.g., ETH.ETH, BTC.BTC, BSC.USDT-0x...
  contractAddress?: string; // For tokens
  decimals?: number; // Important for amount conversions
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
  private ethClient?: EthClient; // For Ethereum interactions
  // Add other clients (BTC, BNB etc. as needed)
  public network: Network;

  constructor(network: Network = Network.Mainnet) {
    this.network = network;
    this.thorchainQuery = new ThorchainQuery();
    // ThorchainAMM is initialized without clients initially.
    // Clients are added via setSigner or similar methods.
    this.thorchainAmm = new ThorchainAMM(this.thorchainQuery);
    console.log(`ThorchainService initialized for ${network}`);
  }

  // Method to update the EVM signer (e.g., from Particle Network)
  public async setEvmSigner(signer: Signer | null, ethProvider?: providers.JsonRpcProvider) {
    if (signer && ethProvider) {
      // TODO: Make network & phrase configurable or dynamically determined
      // For xchain-ethereum, a phrase is not strictly needed if a signer is provided for online operations.
      // Default XChainJS Ethereum client parameters:
      const ethClientParams = {
        network: this.network,
        phrase: undefined, // Not needed with a signer for online operations
        etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY, // Optional: for faster tx confirmation
        ethplorerApiKey: process.env.NEXT_PUBLIC_ETHPLORER_API_KEY, // Optional: for token balances
        provider: ethProvider, // Ethers provider
        signer: signer, // Ethers signer
      };
      this.ethClient = new EthClient(ethClientParams);
      // Add or update the Ethereum client in ThorchainAMM
      this.thorchainAmm.addChainClient(Chain.Ethereum, this.ethClient);
      console.log("ThorchainService: EVM Signer and Ethereum client set.");
    } else {
      if (this.ethClient) {
        this.ethClient.purgeClient();
      }
      this.ethClient = undefined;
      // If you need to remove the client from ThorchainAMM or re-initialize AMM:
      this.thorchainAmm = new ThorchainAMM(this.thorchainQuery); // Re-init or implement removeChainClient if available
      console.log("ThorchainService: EVM Signer removed. Ethereum client purged.");
    }
  }

  private getAssetDecimals(asset: Asset, simpleAsset?: SimpleAsset): number {
    if (simpleAsset?.decimals !== undefined) {
        return simpleAsset.decimals;
    }
    // Fallback logic if not provided in SimpleAsset - this needs to be robust
    // For THORChain's internal math, it often uses 8 decimals.
    // However, for displaying to user or constructing client-side txs, true decimals are needed.
    if (asset.chain === Chain.Bitcoin || asset.chain === Chain.BitcoinCash || asset.chain === Chain.Litecoin || asset.chain === Chain.Dogecoin) return 8;
    if (asset.chain === Chain.Ethereum || asset.chain === Chain.Avalanche || asset.chain === Chain.BinanceSmartChain) {
        // Native assets usually have 18 decimals
        if (asset.symbol === Chain.Ethereum || asset.symbol === Chain.Avalanche || asset.symbol === Chain.BinanceSmartChain) return 18;
        // For ERC20s, this is crucial and should ideally come from a trusted source or token list
        // Defaulting to 18 for unknown ERC20s is a common but potentially incorrect assumption.
        // For this example, we'll assume SimpleAsset carries the correct decimals.
        return 18;
    }
    if (asset.chain === Chain.Cosmos || asset.chain === Chain.THORChain) return 6; // Example for ATOM or RUNE (native on its chain)

    console.warn(`Decimals for ${asset.chain}.${asset.symbol} not accurately determined, defaulting to 8. Ensure SimpleAsset.decimals is provided.`);
    return 8; // Default if not found, THORChain's internal default
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
      const outputDecimals = this.getAssetDecimals(toAsset, outputAsset);

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

      const feeAsset = assetFromString(quote.fees.asset.symbol); // quote.fees.asset is already an Asset
      if(!feeAsset) throw new Error(`Unknown fee asset: ${quote.fees.asset.symbol}`);
      const feeDecimals = this.getAssetDecimals(feeAsset); // Assuming fee asset might have different decimals

      const feeSimpleAsset: SimpleAsset = {
          chain: feeAsset.chain,
          ticker: feeAsset.ticker,
          symbol: feeAsset.symbol,
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
        outputAmount: formatAssetAmountCurrency({ amount: quote.expectedAmountOut.baseAmount, asset: toAsset, decimal: outputDecimals, trimZeros: true }),
        expectedOutputAmountCryptoPrecision: quote.expectedAmountOut.baseAmount.amount().toString(),
        fees: {
          asset: feeSimpleAsset,
          totalFeeCryptoPrecision: quote.fees.total.amount().toString(), // Assuming quote.fees.total is BaseAmount
          totalFeeHumanReadable: formatAssetAmountCurrency({ amount: quote.fees.total, asset: feeAsset, decimal: feeDecimals, trimZeros: true }),
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
    amountCryptoPrecision: string, // Amount that needs approval, in crypto precision
    spenderAddress: string, // Typically the THORChain router or inbound address
    walletAddress: string
  ): Promise<{ approved: boolean; approveTxHash?: string; error?: string }> {
    if (asset.chain !== Chain.Ethereum || !asset.contractAddress || !this.ethClient) {
      // Not an EVM ERC20 token or EthClient not available
      return { approved: true };
    }

    try {
      const tokenAsset = assetFromString(asset.symbol);
      if (!tokenAsset) throw new Error("Invalid asset for approval check");

      const amountToApprove = baseAmount(amountCryptoPrecision, asset.decimals || 18);

      const isApproved = await this.ethClient.isApproved({
        asset: tokenAsset,
        amount: amountToApprove,
        spenderAddress: spenderAddress, // Spender is the THORChain router/contract
        walletAddress: walletAddress,
      });

      if (isApproved) {
        return { approved: true };
      }

      // If not approved, request approval
      console.log(`Requesting approval for ${asset.symbol} to spender ${spenderAddress}`);
      const approveTxHash = await this.ethClient.approve({
        asset: tokenAsset,
        amount: amountToApprove, // Could approve max (Infinity) or the specific amount
        spenderAddress: spenderAddress,
        // gasPrice, gasLimit can be optionally passed
      });
      console.log(`Approval transaction submitted: ${approveTxHash}`);
      // It's good practice to wait for the approval transaction to be confirmed.
      // For simplicity here, we return the hash. UI should handle waiting.
      return { approved: false, approveTxHash };

    } catch (error: any) {
      console.error(`Error during ERC20 approval for ${asset.symbol}:`, error);
      return { approved: false, error: error.message || 'Approval failed' };
    }
  }

  public async executeSwap(
    quote: ThorchainQuote,
    userFromAddress: string, // Address of the user initiating the swap (e.g., from Particle)
    userDestinationAddress: string // Final recipient address for the output asset
  ): Promise<string> { // Returns transaction hash
    if (!quote.inboundAddress) {
        throw new Error("Inbound address missing in the quote. Cannot execute swap.");
    }

    const fromAsset = this.toXChainAsset(quote.inputAsset);
    const amount = baseAmount(quote.inputAmountCryptoPrecision, this.getAssetDecimals(fromAsset, quote.inputAsset));

    // Handle ERC20 Approvals for Ethereum chain
    if (fromAsset.chain === Chain.Ethereum && quote.inputAsset.contractAddress) {
        if (!this.ethClient) {
            throw new Error("Ethereum client not initialized. Call setEvmSigner first.");
        }
        // The spender for THORChain swaps is typically the router contract address,
        // which might be different from the inboundAddress.
        // For simplicity, quote.router is often the THORChain EVM router.
        // If quote.router is not available, inboundAddress might be used, but this needs verification per THORChain docs for ERC20s.
        const spender = quote.router || quote.inboundAddress;
        if (!spender) {
            throw new Error("Spender address for ERC20 approval not found in quote.");
        }

        const approvalResult = await this.checkAndRequestApproval(
            quote.inputAsset,
            quote.inputAmountCryptoPrecision,
            spender,
            userFromAddress
        );

        if (!approvalResult.approved) {
            if (approvalResult.approveTxHash) {
                // UI should inform user to wait for approval tx confirmation
                throw new Error(`Approval required. Transaction hash: ${approvalResult.approveTxHash}. Please wait for confirmation and try again.`);
            } else {
                throw new Error(approvalResult.error || "ERC20 approval failed or was rejected.");
            }
        }
        console.log(`${quote.inputAsset.symbol} is approved for swap.`);
    }

    // Ensure ThorchainAMM has the necessary client for the input asset's chain
    if (fromAsset.chain === Chain.Ethereum && !this.ethClient) {
        throw new Error("Ethereum client not configured in ThorchainService for swap.");
    }
    // TODO: Add checks and client configurations for other chains (BTC, BNB, etc.) as they are supported.

    try {
      const params: EstimateSwapParams = {
        input: {
          asset: fromAsset,
          amount: amount,
        },
        destinationAsset: this.toXChainAsset(quote.outputAsset),
        destinationAddress: userDestinationAddress, // User's final destination address
        memo: quote.memo, // Use the memo from the quote
        // toleranceBps, affiliateAddress, affiliateBps can be added if needed
      };

      // Using estimateSwap to get final parameters including potential router address.
      // Then use doSwap if it's a direct call, or transfer to inbound address if it's a simple send.
      // For now, let's assume doSwap handles the complexities.
      // The doSwap method in ThorchainAMM is more high-level.
      // It might internally call deposit on the respective chain client.

      console.log("Executing THORChain swap with params:", {
          asset: params.input.asset.symbol,
          amount: params.input.amount.amount().toString(),
          destination: params.destinationAsset.symbol,
          destinationAddress: params.destinationAddress,
          memo: params.memo,
      });

      // doSwap will use the chain client registered with ThorchainAMM
      const txHash = await this.thorchainAmm.doSwap(params);

      console.log('THORChain Swap transaction submitted:', txHash);
      return txHash;

    } catch (error: any) {
      console.error('THORChain swap execution failed:', error);
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
