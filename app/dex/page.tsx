'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useParticleAuth } from '@/components/ParticleAuthContext'; // Import Particle Auth hook
import { ThorchainService, SimpleAsset, ThorchainQuote } from '@/services/ThorchainService';
import { ZetaChainService } from '@/services/ZetaChainService';
import { getEthersSigner, getEthersProvider, getNonEvmAddress, signNonEvmTransaction, broadcastNonEvmTransaction } from '@/lib/particle';
import { Chain } from '@xchainjs/xchain-util';
import { Network as XChainNetwork } from '@xchainjs/xchain-client'; // XChainTxParams removed
import { Signer as EthersSigner } from 'ethers';
// assetToString, baseAmount removed as they are not used directly here

// XChainJS clients for non-EVM chains - to be instantiated dynamically
// Keeping these imports for now as they indicate future direction for non-EVM swaps,
// though not directly used in the current placeholder logic.
import { Client as BtcClient, defaultBTCParams as defaultBtcParams } from '@xchainjs/xchain-bitcoin';
import { Client as CosmosClient, defaultCosmosParams } from '@xchainjs/xchain-cosmos';
// Add other clients like BchClient, LtcClient, DogeClient if needed for Thorchain swaps


// Helper to get a unique key for SimpleAsset, useful for React lists
const getAssetKey = (asset: SimpleAsset) => `${asset.chain}-${asset.symbol}`;

const DexPage: React.FC = () => {
  const [ctaText, setCta] = useState('Start Trading');
  const { userInfo, walletAccounts, isLoadingAuth, login, logout, connectWallet, openWallet } = useParticleAuth();

  // Services - XChainNetwork.Mainnet used for ThorchainService
  const thorchainService = useMemo(() => new ThorchainService(XChainNetwork.Mainnet), []);
  const zetaChainService = useMemo(() => new ZetaChainService(), []);

  // Asset lists
  const [allAssets, setAllAssets] = useState<SimpleAsset[]>([]); // Unified SimpleAsset
  const [fromAssets, setFromAssets] = useState<SimpleAsset[]>([]); // Unified SimpleAsset
  const [toAssets, setToAssets] = useState<SimpleAsset[]>([]); // Unified SimpleAsset
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(false);

  // Selected assets
  const [selectedFromAssetSymbol, setSelectedFromAssetSymbol] = useState<string>(''); // Store symbol string
  const [selectedToAssetSymbol, setSelectedToAssetSymbol] = useState<string>('');     // Store symbol string

  // Current non-EVM address for the selected 'from' asset, if applicable
  const [currentNonEvmFromAddress, setCurrentNonEvmFromAddress] = useState<string | null>(null);


  const [amount, setAmount] = useState<string>('0.1');
  const [quote, setQuote] = useState<ThorchainQuote | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<any | null>(null);

  // ZetaChain UI State (keeping existing structure for now)
  const [zetaAssetsForDisplay, setZetaAssetsForDisplay] = useState<SimpleAsset[]>([]); // Unified SimpleAsset
  const [isFetchingZetaCoins, setIsFetchingZetaCoins] = useState<boolean>(false);
  const [zetaError, setZetaError] = useState<string | null>(null);

  // Effect to initialize services and fetch assets
  useEffect(() => {
    const initializeAndLoadAssets = async () => {
      setIsLoadingAssets(true);
      setError(null);
      if (walletAccounts && walletAccounts.length > 0) {
        const signer = await getEthersSigner(); // For EVM interactions
        const provider = getEthersProvider();

        if (signer && provider) {
          await thorchainService.setEvmSigner(signer, provider, Chain.Ethereum); // Specify chain
          // Example for BSC if Particle connects to BSC and provides signer via Ethereum provider compatibility
          // await thorchainService.setEvmSigner(signer, provider, Chain.BinanceSmartChain);
          console.log("ThorchainService EVM signer initialized for Ethereum.");

          const zetaSuccess = await zetaChainService.initializeClient(signer as EthersSigner);
          if (zetaSuccess) {
            console.log("ZetaChainService client initialized.");
          } else {
            console.error("Failed to initialize ZetaChainService client.");
            setZetaError("Failed to initialize ZetaChain client.");
          }
        } else {
          thorchainService.setEvmSigner(null); // Clear signer if not available
          console.log("EVM signer/provider not available from Particle for Thorchain/ZetaChain.");
        }
      } else {
        thorchainService.setEvmSigner(null); // Clear Thorchain EVM signer if wallet disconnects
        // Handle ZetaChain de-initialization if applicable
        console.log("Wallet disconnected, EVM signers cleared for services.");
      }

      try {
        const tcAssets = await thorchainService.getAvailableAssets();
        let zcAssets: SimpleAsset[] = [];
        if (zetaChainService.isInitialized()) {
          zcAssets = await zetaChainService.listSupportedForeignCoins();
          setZetaAssetsForDisplay(zcAssets);
        }

        const combined = [...tcAssets];
        const combinedSymbols = new Set(tcAssets.map(a => a.symbol));
        zcAssets.forEach(za => {
          if (!combinedSymbols.has(za.symbol)) {
            combined.push(za);
            combinedSymbols.add(za.symbol);
          }
        });

        setAllAssets(combined);
        setFromAssets(combined);
        setToAssets(combined);

        if (combined.length > 0) {
          const defaultFrom = combined.find(a => a.symbol === 'ETH.ETH') || combined[0];
          setSelectedFromAssetSymbol(defaultFrom.symbol);

          if (combined.length > 1) {
            const defaultTo = combined.find(a => a.symbol === 'BTC.BTC') || combined.find(a => a.symbol !== defaultFrom.symbol) || combined[1];
            if (defaultTo) setSelectedToAssetSymbol(defaultTo.symbol);
          } else {
             setSelectedToAssetSymbol('');
          }
        }
      } catch (err: any) {
        console.error("Error loading assets:", err);
        setError(err.message || "Failed to load available assets.");
      } finally {
        setIsLoadingAssets(false);
      }
    };

    initializeAndLoadAssets();
  }, [walletAccounts, thorchainService, zetaChainService]);


  // Effect to fetch non-EVM address when selectedFromAssetSymbol changes to a non-EVM asset
  useEffect(() => {
    const fetchNonEvmAddr = async () => {
      const fromAssetDetails = allAssets.find(a => a.symbol === selectedFromAssetSymbol);
      if (fromAssetDetails && !isEvmChain(fromAssetDetails.chain) && fromAssetDetails.chain !== Chain.THORChain /* THORChain itself doesn't need this flow */) {
        setError(null);
        setCurrentNonEvmFromAddress(null);
        console.log(`Fetching non-EVM address for ${fromAssetDetails.chain}`);
        try {
          const address = await getNonEvmAddress(fromAssetDetails.chain);
          if (address) {
            setCurrentNonEvmFromAddress(address);
            console.log(`Got ${fromAssetDetails.chain} address from Particle: ${address}`);
          } else {
            setError(`Could not get address for ${fromAssetDetails.chain} from connected wallet. Ensure the correct wallet type is connected and Particle supports it.`);
          }
        } catch (e: any) {
          setError(`Error fetching address for ${fromAssetDetails.chain}: ${e.message}`);
        }
      } else {
        setCurrentNonEvmFromAddress(null); // Clear if EVM or no asset selected
      }
    };
    if (selectedFromAssetSymbol) {
      fetchNonEvmAddr();
    }
  }, [selectedFromAssetSymbol, allAssets, walletAccounts]);


  useEffect(() => {
    // CTA generation logic (can be kept or adapted)
    if (userInfo && !isLoadingAuth) {
      const generateCta = async () => {
        try {
          const payload = { userId: userInfo.uuid || userInfo.email, device: navigator.platform };
          const res = await fetch('/api/generate-cta', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`CTA generation failed: ${res.status}`);
          const data = await res.json();
          setCta(data.text);
        } catch (err){
          console.error("Failed to generate CTA:", err);
          setCta(walletAccounts && walletAccounts.length > 0 ? 'Trade Now' : 'Connect Wallet to Trade');
        }
      };
      generateCta();
    } else if (!isLoadingAuth) {
      setCta('Login to Trade');
    }
  }, [userInfo, walletAccounts, isLoadingAuth]);

  const isEvmChain = (chain: Chain) => {
    return [Chain.Ethereum, Chain.BinanceSmartChain, Chain.Avalanche, Chain.Polygon].includes(chain);
  };

  const handleGetQuote = async () => {
    setError(null);
    setQuote(null);
    if (!selectedFromAssetSymbol || !selectedToAssetSymbol || !amount) {
      setError("Please select assets and enter an amount for the quote.");
      return;
    }

    const fromAssetDetails = allAssets.find(a => a.symbol === selectedFromAssetSymbol);
    const toAssetDetails = allAssets.find(a => a.symbol === selectedToAssetSymbol);

    if (!fromAssetDetails || !toAssetDetails) {
      setError("Selected asset details not found.");
      return;
    }
    if (fromAssetDetails.decimals === undefined || toAssetDetails.decimals === undefined) {
        setError(`Asset decimals missing for ${fromAssetDetails.symbol} or ${toAssetDetails.symbol}.`);
        return;
    }

    // For non-EVM, use fetched nonEvmFromAddress, for EVM, use walletAccounts[0] from Particle context
    let sourceAddressForQuote = walletAccounts?.[0];
    if (fromAssetDetails && !isEvmChain(fromAssetDetails.chain) && currentNonEvmFromAddress) {
        sourceAddressForQuote = currentNonEvmFromAddress;
    } else if (fromAssetDetails && !isEvmChain(fromAssetDetails.chain) && !currentNonEvmFromAddress) {
        setError(`Please connect a ${fromAssetDetails.chain} wallet or ensure address is fetched.`);
        return;
    }

    // Destination address for quote can often be the source, or a specific one if provided
    // THORChain usually needs a destination for the actual swap memo, but quote might not always.
    // For simplicity, using the primary connected EVM address for now, or non-EVM if output matches.
    let destinationAddressForQuote = walletAccounts?.[0];
     if (toAssetDetails && !isEvmChain(toAssetDetails.chain)) {
        // Ideally, get a specific address for this chain if user has one connected via Particle
        const specificDestAddress = await getNonEvmAddress(toAssetDetails.chain);
        if (specificDestAddress) {
            destinationAddressForQuote = specificDestAddress;
        } else {
            // Fallback or prompt, for quote it might be okay to use a placeholder or primary EVM if allowed by TC
            console.warn(`No specific ${toAssetDetails.chain} address for quote destination, using primary EVM address.`);
        }
    }


    setIsFetchingQuote(true);
    try {
      const fetchedQuote = await thorchainService.getSwapQuote(
        fromAssetDetails,
        toAssetDetails,
        amount,
        destinationAddressForQuote // This is the user's address on the destination chain
      );
      if (fetchedQuote) {
        setQuote(fetchedQuote);
      } else {
        setError("Failed to fetch quote from THORChain.");
      }
    } catch (e: any) {
      setError(e.message || "Error fetching quote.");
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleFetchZetaAssetsForDisplay = async () => {
    // (Existing Zeta asset fetching logic - can remain largely unchanged for now)
    if (!zetaChainService.isInitialized()) {
      setZetaError("ZetaChain client not initialized.");
      if (walletAccounts && walletAccounts.length > 0) {
        const signer = await getEthersSigner();
        if (signer) {
            await zetaChainService.initializeClient(signer as EthersSigner);
        }
      }
      if (!zetaChainService.isInitialized()) return;
    }
    setIsFetchingZetaCoins(true);
    setZetaError(null);
    try {
      const coins = await zetaChainService.listSupportedForeignCoins();
      setZetaAssetsForDisplay(coins);
    } catch (e: any) {
      setZetaError(e.message || "Failed to fetch ZetaChain assets.");
    } finally {
      setIsFetchingZetaCoins(false);
    }
  };

  const pollTransactionStatus = async (txHash: string, chain: Chain) => {
    // (Existing polling logic - can remain largely unchanged)
    setTransactionStatus({ status: 'polling', message: `Polling status for ${txHash}...` });
    try {
      for (let i = 0; i < 60; i++) {
        const statusDetails = await thorchainService.getTransactionStatusAndDetails(txHash, chain);
        setTransactionStatus(statusDetails);
        if (statusDetails?.status === 'success' || statusDetails?.status === 'refunded' || statusDetails?.status === 'error') {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      setTransactionStatus({ status: 'timeout', message: 'Polling timed out. Please check manually.' });
    } catch (e: any) {
      setTransactionStatus({ status: 'error', message: e.message || 'Failed to poll status.' });
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote || !walletAccounts || walletAccounts.length === 0) {
      setError("No quote or wallet not connected.");
      return;
    }
    setError(null);
    setSwapTxHash(null);
    setIsSwapping(true);

    const fromAssetDetails = quote.inputAsset;
    const toAssetDetails = quote.outputAsset;

    let sourceAddress = walletAccounts[0]; // Default to EVM primary
    if (!isEvmChain(fromAssetDetails.chain)) {
        if (!currentNonEvmFromAddress) {
            setError(`Source address for non-EVM chain ${fromAssetDetails.chain} not available.`);
            setIsSwapping(false);
            return;
        }
        sourceAddress = currentNonEvmFromAddress;
    }

    // Determine final destination address for the swap output
    let finalDestinationAddress = walletAccounts[0]; // Default to primary EVM
    if (!isEvmChain(toAssetDetails.chain)) {
        const specificDestAddress = await getNonEvmAddress(toAssetDetails.chain);
        if (specificDestAddress) {
            finalDestinationAddress = specificDestAddress;
        } else {
            // Prompt user for a destination address for non-EVM or different chain outputs
            const promptedAddress = prompt(`Enter destination address for ${toAssetDetails.symbol} on ${toAssetDetails.chain}:`);
            if (!promptedAddress) {
                setError("Destination address for the output asset is required.");
                setIsSwapping(false);
                return;
            }
            finalDestinationAddress = promptedAddress;
        }
    }


    try {
      let txHash: string | null = null;

      if (isEvmChain(fromAssetDetails.chain)) {
        // EVM to Any swap (ThorchainService handles this)
        txHash = await thorchainService.executeSwap(quote, sourceAddress, finalDestinationAddress);
      } else {
        // Non-EVM to Any swap (manual signing flow using Particle placeholders)
        console.log(`Initiating non-EVM swap from ${fromAssetDetails.chain}`);

        // Step 1: Construct unsigned transaction (highly chain-specific and simplified here)
        // This would involve using XChainJS utilities to build the transaction structure.
        // For Bitcoin: determine UTXOs, build tx to quote.inboundAddress with memo.
        // For Cosmos: build MsgSend to quote.inboundAddress with memo.
        // This is a MAJOR simplification. Real implementation needs robust tx construction.
        let unsignedTxData: any;
        if (fromAssetDetails.chain === Chain.Bitcoin) {
          // Placeholder: In reality, you'd build a PSBT or raw tx hex.
          // This would need: UTXOs, fee rate, recipient (quote.inboundAddress), amount, memo.
          // Example using a hypothetical XChainJS method that prepares tx data without signing:
          // const btcClient = new BtcClient({ network: XChainNetwork.Mainnet /* or Testnet */ });
          // const txPayload = btcClient.prepareTx({
          //    sender: sourceAddress, // from currentNonEvmFromAddress
          //    recipient: quote.inboundAddress,
          //    amount: baseAmount(quote.inputAmountCryptoPrecision, fromAssetDetails.decimals),
          //    memo: quote.memo,
          //    feeRate: await btcClient.getFeeRates().then(rates => rates.fast), // example fee rate
          // });
          // unsignedTxData = txPayload.toHex(); // Or whatever format signNonEvmTransaction expects for BTC
          unsignedTxData = {
            type: "BTC_TRANSFER",
            from: sourceAddress,
            to: quote.inboundAddress,
            amount: quote.inputAmountCryptoPrecision, // In satoshis
            memo: quote.memo,
            // This would need to be a PSBT hex or raw tx hex for actual signing
          };
          console.log("Placeholder unsigned BTC tx data:", unsignedTxData);
        } else if (fromAssetDetails.chain === Chain.Cosmos) {
          // Placeholder for Cosmos StdSignDoc
          unsignedTxData = {
            chain_id: "cosmoshub-4", // Example, needs to be dynamic
            account_number: "0", // Needs to be fetched
            sequence: "0", // Needs to be fetched
            fee: { amount: [{ denom: "uatom", amount: "5000" }], gas: "200000" },
            msgs: [{
              type: "cosmos-sdk/MsgSend",
              value: {
                from_address: sourceAddress,
                to_address: quote.inboundAddress, // THORChain inbound address for Cosmos
                amount: [{ denom: "uatom", amount: quote.inputAmountCryptoPrecision }] // Amount in base units
              }
            }],
            memo: quote.memo
          };
           console.log("Placeholder unsigned Cosmos tx data:", unsignedTxData);
        } else {
          throw new Error(`Unsupported non-EVM chain for direct signing: ${fromAssetDetails.chain}`);
        }

        // Step 2: Sign with Particle (using placeholder function)
        const signedTxData = await signNonEvmTransaction(fromAssetDetails.chain, unsignedTxData, sourceAddress);
        if (!signedTxData) {
          throw new Error("Failed to sign non-EVM transaction via Particle.");
        }
        console.log(`Signed non-EVM tx data for ${fromAssetDetails.chain}:`, signedTxData);

        // Step 3: Broadcast with Particle (using placeholder function)
        txHash = await broadcastNonEvmTransaction(fromAssetDetails.chain, signedTxData);
        if (!txHash) {
          throw new Error("Failed to broadcast non-EVM transaction via Particle.");
        }
      }

      if (txHash) {
        setSwapTxHash(txHash);
        pollTransactionStatus(txHash, fromAssetDetails.chain);
      } else {
        setError("Transaction hash not received after execution attempt.");
      }
    } catch (e: any) {
      console.error("Error executing swap:", e);
      setError(e.message || "An unknown error occurred during the swap.");
      if (e.message && e.message.includes("Approval required")) {
        setError(e.message + " Please wait for approval and try swapping again, or approve manually if tx hash provided.");
      }
    } finally {
      setIsSwapping(false);
    }
  };

  const renderAuthButtons = () => {
    // (Existing auth button rendering logic - can remain largely unchanged)
    if (isLoadingAuth) {
      return <p>Loading authentication...</p>;
    }
    if (userInfo) {
      return (
        <div className="my-4">
          <p>Welcome, {userInfo.name || userInfo.email || userInfo.uuid}!</p>
          {walletAccounts && walletAccounts.length > 0 && <p>Connected EVM Wallet: {walletAccounts[0]}</p> }
          {currentNonEvmFromAddress && selectedFromAssetSymbol && !isEvmChain(allAssets.find(a=>a.symbol === selectedFromAssetSymbol)?.chain || Chain.Unknown) && (
            <p>Connected {allAssets.find(a=>a.symbol === selectedFromAssetSymbol)?.chain} Wallet: {currentNonEvmFromAddress}</p>
          )}
          {!walletAccounts && (
            <button
              onClick={() => connectWallet('metaMask')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Connect EVM Wallet
            </button>
          )}
           {/* Button to connect non-EVM might be more complex, depends on Particle's flow */}
           {/* For now, relying on Particle Connect modal to handle various wallet types */}
          <button
            onClick={openWallet}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            disabled={!walletAccounts && !currentNonEvmFromAddress}
          >
            Open Particle Wallet/Connect
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <div className="my-4">
        <button onClick={() => login('google')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          Login with Google
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Decentralized Exchange</h1>
      {renderAuthButtons()}

      {/* Thorchain Swap UI */}
      {(userInfo && (walletAccounts || currentNonEvmFromAddress)) && ( // Show if logged in and any wallet type is connected/address available
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">THORChain Swap</h2>
          {isLoadingAssets && <p>Loading available assets...</p>}
          {/* Asset selection and amount input UI (can remain largely unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fromAsset" className="block text-sm font-medium text-gray-700">From Asset</label>
              <select id="fromAsset" name="fromAsset" value={selectedFromAssetSymbol} onChange={(e) => setSelectedFromAssetSymbol(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled={isLoadingAssets || fromAssets.length === 0}>
                <option value="" disabled>Select asset</option>
                {fromAssets.map((asset) => (<option key={getAssetKey(asset)} value={asset.symbol}>{asset.name || `${asset.ticker} (${asset.chain})`} ({asset.source})</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="toAsset" className="block text-sm font-medium text-gray-700">To Asset</label>
              <select id="toAsset" name="toAsset" value={selectedToAssetSymbol} onChange={(e) => setSelectedToAssetSymbol(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled={isLoadingAssets || toAssets.length === 0}>
                <option value="" disabled>Select asset</option>
                {toAssets.map((asset) => (<option key={getAssetKey(asset)} value={asset.symbol}>{asset.name || `${asset.ticker} (${asset.chain})`} ({asset.source})</option>))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Swap</label>
            <input type="text" name="amount" id="amount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.1"/>
          </div>

          <button onClick={handleGetQuote} disabled={isFetchingQuote || isLoadingAssets || !selectedFromAssetSymbol || !selectedToAssetSymbol || !amount} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
            {isFetchingQuote ? 'Fetching Quote...' : (isLoadingAssets ? 'Assets Loading...' : 'Get Quote')}
          </button>

          {/* Display Quote (can remain largely unchanged) */}
          {quote && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="text-lg font-medium">Quote Details:</h3>
              <p>Output: {quote.outputAmount} {quote.outputAsset.ticker}</p>
              <p>Fee: {quote.fees.totalFeeHumanReadable} {quote.fees.asset.ticker}</p>
              <p>Memo: <code className="text-xs bg-gray-200 p-1 rounded">{quote.memo}</code></p>
              <p>Inbound Address: <code className="text-xs bg-gray-200 p-1 rounded">{quote.inboundAddress}</code></p>
              {quote.dustThreshold && <p>Dust Threshold: {quote.dustThreshold} {quote.inputAsset.ticker}</p>}
              <button onClick={handleExecuteSwap} disabled={isSwapping} className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                {isSwapping ? 'Swapping...' : 'Execute Swap'}
              </button>
            </div>
          )}
          {swapTxHash && <p className="mt-2 text-green-700">Swap Initiated! Tx Hash: <code className="text-sm">{swapTxHash}</code></p>}
          {error && <p className="mt-2 text-red-500">Error: {error}</p>}

          {/* Transaction Status Display (can remain largely unchanged) */}
          {transactionStatus && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800">Transaction Status:</h3>
              <p>Status: <span className="font-semibold">{transactionStatus.status}</span></p>
              {transactionStatus.message && <p>{transactionStatus.message}</p>}
              {transactionStatus.type && <p>Type: {transactionStatus.type}</p>}
              {transactionStatus.inboundTx && (<div className="mt-1"><p className="text-sm">Inbound: {transactionStatus.inboundTx.txID} ({transactionStatus.inboundTx.chain})</p></div>)}
              {transactionStatus.outboundTxs && transactionStatus.outboundTxs.length > 0 && (<div className="mt-1"><p className="text-sm">Outbound:</p>{transactionStatus.outboundTxs.map((tx: any, index: number) => (<p key={index} className="ml-2 text-xs">{tx.txID} ({tx.chain}) - Amount: {tx.amount} {tx.asset}</p>))}</div>)}
              {transactionStatus.rawAction && (<details className="mt-1 text-xs"><summary>Raw Action Details</summary><pre className="bg-gray-200 p-2 rounded overflow-auto max-h-40">{JSON.stringify(transactionStatus.rawAction, null, 2)}</pre></details>)}
            </div>
          )}
        </div>
      )}

      {/* ZetaChain Section (can remain largely unchanged) */}
      {userInfo && walletAccounts && walletAccounts.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">ZetaChain ZRC20 Assets</h2>
          <button onClick={handleFetchZetaAssetsForDisplay} disabled={isFetchingZetaCoins || !zetaChainService.isInitialized()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-2">
            {isFetchingZetaCoins ? 'Refreshing ZRC20s...' : 'Refresh ZRC20 List'}
          </button>
          {!zetaChainService.isInitialized() && <p className="text-sm text-yellow-600">ZetaChain client not ready.</p>}
          {zetaError && <p className="mt-2 text-red-500">ZetaChain Error: {zetaError}</p>}
          {zetaAssetsForDisplay.length > 0 ? (
            <div className="mt-3">
              <h4 className="font-medium">Available ZRC20s on ZetaChain:</h4>
              <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto bg-gray-50 p-2 rounded">
                {zetaAssetsForDisplay.map((asset) => (<li key={getAssetKey(asset)}>{asset.name || asset.ticker} ({asset.symbol}) - ZRC20: <code className="text-xs">{asset.contractAddress}</code></li>))}
              </ul>
            </div>
          ) : (<p className="text-sm text-gray-500">No ZRC20 assets loaded.</p>)}
        </div>
      )}

      {/* Fallback messages (can remain largely unchanged) */}
      {!zetaChainService.isInitialized() && userInfo && walletAccounts && walletAccounts.length > 0 && ( <div className="mt-6 p-4 border rounded-lg shadow-md bg-yellow-50"><p className="text-yellow-700">ZetaChain client not initialized.</p>{zetaError && <p className="mt-1 text-red-600">Last attempt error: {zetaError}</p>}</div>)}
      {(!userInfo || (!walletAccounts && !currentNonEvmFromAddress)) && (<div className="my-4 p-4 border rounded bg-gray-50">{isLoadingAuth ? <p>Checking auth...</p> : !userInfo ? <p>Please log in.</p> : <p>Please connect wallet.</p>}</div>)}

      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4" disabled={isLoadingAuth || !userInfo || (!walletAccounts && !currentNonEvmFromAddress) } onClick={() => console.log("CTA clicked")}>
        {ctaText}
      </button>
    </div>
  );
};

export default DexPage;
