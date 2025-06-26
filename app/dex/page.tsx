'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useParticleAuth } from '@/components/ParticleAuthContext'; // Import Particle Auth hook
import { ThorchainService, SimpleAsset as ThorchainSimpleAsset, ThorchainQuote } from '@/services/ThorchainService'; // Adjust path as needed
import { ZetaChainService, ZetaSimpleAsset } from '@/services/ZetaChainService'; // Adjust path as needed
import { getEthersSigner, getEthersProvider } from '@/lib/particle'; // Adjust path as needed
import { Chain } from '@xchainjs/xchain-util';
import { Network } from '@xchainjs/xchain-client';
import { Signer } from 'ethers'; // Assuming this will be ethers v5 if ZetaChain toolkit requires it.

// A mock function to get asset details, replace with actual asset fetching/list
const getAssetDetails = (symbol: string): SimpleAsset | null => {
  // This is a placeholder. In a real app, you'd look this up from a list
  // or allow users to select from assets returned by thorchainQuery.getPools()
  // Crucially, 'decimals' must be correct.
  if (symbol.toUpperCase() === 'ETH.ETH') {
    return { chain: Chain.Ethereum, ticker: 'ETH', symbol: 'ETH.ETH', decimals: 18 };
  }
  if (symbol.toUpperCase() === 'BTC.BTC') {
    return { chain: Chain.Bitcoin, ticker: 'BTC', symbol: 'BTC.BTC', decimals: 8 };
  }
  if (symbol.toUpperCase() === 'ETH.USDT') { // Example ERC20, address is needed for real use
    return { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 };
  }
  if (symbol.toUpperCase() === 'BSC.BNB') {
      return { chain: Chain.BinanceSmartChain, ticker: 'BNB', symbol: 'BSC.BNB', decimals: 18};
  }
  // Add more assets as needed for testing
  console.warn(`Asset details not found for ${symbol}. Please add to getAssetDetails mock.`);
  return null;
};

// Helper to get a unique key for SimpleAsset, useful for React lists
const getAssetKey = (asset: SimpleAsset) => `${asset.chain}-${asset.symbol}`;

const DexPage: React.FC = () => {
  const [ctaText, setCta] = useState('Start Trading');
  const { userInfo, walletAccounts, isLoadingAuth, login, logout, connectWallet, openWallet } = useParticleAuth();

  // Services
  const thorchainService = useMemo(() => new ThorchainService(Network.Mainnet), []);
  const zetaChainService = useMemo(() => new ZetaChainService(), []);

  // Asset lists
  const [allAssets, setAllAssets] = useState<SimpleAsset[]>([]);
  const [fromAssets, setFromAssets] = useState<SimpleAsset[]>([]);
  const [toAssets, setToAssets] = useState<SimpleAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState<boolean>(false);

  // Selected assets
  const [selectedFromAssetSymbol, setSelectedFromAssetSymbol] = useState<string>(''); // Store symbol string
  const [selectedToAssetSymbol, setSelectedToAssetSymbol] = useState<string>('');     // Store symbol string

  const [amount, setAmount] = useState<string>('0.1');
  const [quote, setQuote] = useState<ThorchainQuote | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<any | null>(null);

  // ZetaChain UI State (keeping existing structure for now)
  const [zetaAssetsForDisplay, setZetaAssetsForDisplay] = useState<SimpleAsset[]>([]);
  const [isFetchingZetaCoins, setIsFetchingZetaCoins] = useState<boolean>(false);
  const [zetaError, setZetaError] = useState<string | null>(null);

  // Effect to initialize services and fetch assets
  useEffect(() => {
    const initializeAndLoadAssets = async () => {
      setIsLoadingAssets(true);
      let signerAvailable = false;
      if (walletAccounts && walletAccounts.length > 0) {
        const signer = await getEthersSigner();
        const provider = getEthersProvider();
        if (signer && provider) {
          await thorchainService.setEvmSigner(signer, provider);
          console.log("ThorchainService EVM signer initialized.");
          // @ts-ignore TODO: Confirm ethers v5/v6 compatibility for ZetaChain
          const zetaSuccess = await zetaChainService.initializeClient(signer as Signer);
          if (zetaSuccess) {
            console.log("ZetaChainService client initialized.");
          } else {
            console.error("Failed to initialize ZetaChainService client.");
            setZetaError("Failed to initialize ZetaChain client.");
          }
          signerAvailable = true;
        } else {
          thorchainService.setEvmSigner(null); // Clear signer if not available
          console.log("EVM signer/provider not available from Particle.");
        }
      } else {
        thorchainService.setEvmSigner(null); // Clear Thorchain signer if wallet disconnects
        // Handle ZetaChain de-initialization if applicable
        console.log("Wallet disconnected, signers cleared for services.");
      }

      try {
        const tcAssets = await thorchainService.getAvailableAssets();
        let zcAssets: SimpleAsset[] = [];
        if (zetaChainService.isInitialized()) {
          zcAssets = await zetaChainService.listSupportedForeignCoins();
          setZetaAssetsForDisplay(zcAssets); // For the separate ZetaChain display section
        }

        // Combine and de-duplicate assets
        const combined = [...tcAssets];
        const zetaSymbols = new Set(tcAssets.map(a => a.symbol));
        zcAssets.forEach(za => {
          if (!zetaSymbols.has(za.symbol)) { // Basic deduplication by symbol
            combined.push(za);
          }
        });

        setAllAssets(combined);
        // Initially, from and to assets can be all available assets.
        // Filtering can be added later (e.g. based on chain compatibility or if an asset is ZRC20 only)
        setFromAssets(combined);
        setToAssets(combined);

        // Set default selected assets if list is not empty
        if (combined.length > 0) {
          // Try to set previous defaults or sensible new defaults
          const defaultFrom = combined.find(a => a.symbol === 'ETH.ETH') || combined[0];
          setSelectedFromAssetSymbol(defaultFrom.symbol);

          if (combined.length > 1) {
            const defaultTo = combined.find(a => a.symbol === 'BTC.BTC') || combined.find(a => a.symbol !== defaultFrom.symbol) || combined[1];
            if (defaultTo) setSelectedToAssetSymbol(defaultTo.symbol);
          } else {
             setSelectedToAssetSymbol(''); // Or handle single asset case
          }
        }

      } catch (err) {
        console.error("Error loading assets:", err);
        setError("Failed to load available assets.");
      } finally {
        setIsLoadingAssets(false);
      }
    };

    initializeAndLoadAssets();
  }, [walletAccounts, thorchainService, zetaChainService]); // Re-run if wallet or services change


  useEffect(() => {
    if (userInfo && !isLoadingAuth) {
      const generateCta = async () => {
        try {
          // TODO: Adapt generateCta based on actual data available from Particle's userInfo
          // For now, using userInfo.uuid or email if available.
          const payload = {
            userId: userInfo.uuid || userInfo.email,
            device: navigator.platform,
            // Other relevant user data from userInfo if available and needed by /api/generate-cta
          };

          const res = await fetch('/api/generate-cta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`CTA generation failed with status: ${res.status}`);
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
      setError("Selected asset details not found. Please refresh asset list or check selection.");
      return;
    }

    // TODO: Ensure decimals are correctly populated in allAssets
    if (fromAssetDetails.decimals === undefined || toAssetDetails.decimals === undefined) {
        setError(`Asset decimals missing for ${fromAssetDetails.symbol} or ${toAssetDetails.symbol}. Cannot proceed.`);
        console.error("Asset decimals missing", fromAssetDetails, toAssetDetails);
        return;
    }

    const destinationAddress = walletAccounts?.[0];

    setIsFetchingQuote(true);
    try {
      const fetchedQuote = await thorchainService.getSwapQuote(
        fromAssetDetails,
        toAssetDetails,
        amount,
        destinationAddress
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

  // This function might be redundant if assets are fetched once on load
  // Or it can be used as a manual refresh for Zeta assets specifically
  const handleFetchZetaAssetsForDisplay = async () => {
    if (!zetaChainService.isInitialized()) {
      setZetaError("ZetaChain client not initialized.");
      // Attempt re-initialization
      if (walletAccounts && walletAccounts.length > 0) {
        const signer = await getEthersSigner();
        if (signer) { // @ts-ignore
            await zetaChainService.initializeClient(signer as Signer);
        }
      }
      if (!zetaChainService.isInitialized()) return;
    }
    setIsFetchingZetaCoins(true);
    setZetaError(null);
    try {
      const coins = await zetaChainService.listSupportedForeignCoins();
      setZetaAssetsForDisplay(coins); // Update the specific display list
    } catch (e: any) {
      setZetaError(e.message || "Failed to fetch ZetaChain assets.");
    } finally {
      setIsFetchingZetaCoins(false);
    }
  };


  const pollTransactionStatus = async (txHash: string, chain: Chain) => {
    setTransactionStatus({ status: 'polling', message: `Polling status for ${txHash}...` });
    try {
      // Simple polling mechanism
      for (let i = 0; i < 60; i++) { // Poll for a max of 5 minutes (60 * 5s)
        const statusDetails = await thorchainService.getTransactionStatusAndDetails(txHash, chain);
        setTransactionStatus(statusDetails); // Update UI with the latest status

        if (statusDetails?.status === 'success' || statusDetails?.status === 'refunded' || statusDetails?.status === 'error') {
          console.log('Final transaction status received:', statusDetails);
          if (statusDetails?.status === 'success') {
            // Consider fetching updated balances here
          }
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before next poll
      }
      setTransactionStatus({ status: 'timeout', message: 'Polling timed out. Please check the transaction manually.' });
    } catch (e: any) {
      console.error("Error polling transaction status:", e);
      setTransactionStatus({ status: 'error', message: e.message || 'Failed to poll transaction status.' });
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote || !walletAccounts || walletAccounts.length === 0) {
      setError("No quote available or wallet not connected.");
      return;
    }
    setError(null);
    setSwapTxHash(null);
    setIsSwapping(true);

    try {
      const fromAddress = walletAccounts[0];
      // For simplicity, destination is also the user's current wallet for the output chain.
      // This might need to be configurable in a real UI.
      // Ensure quote.outputAsset.chain is valid for deriving destination.
      // For now, assuming the user wants the swapped asset back to their connected wallet context,
      // if the chain matches. If chains are different, user might need to specify.
      // For THORChain, the destination address in the memo is what matters for final delivery.
      // The 'userDestinationAddress' for doSwap should be the actual final recipient on the destination chain.

      // A more robust way to get destination address for the output chain might be needed.
      // For example, if output is BTC, and user is connected with ETH wallet, they need to provide a BTC address.
      // For now, we'll use the connected wallet address if the output chain is EVM and matches, otherwise error.
      // This part needs careful handling in a full UI.
      let finalDestinationAddress = walletAccounts[0]; // Default to current wallet
      if (quote.outputAsset.chain !== Chain.Ethereum && quote.outputAsset.chain !== Chain.BinanceSmartChain /* add other EVM chains user might be connected with via Particle */) {
          // Prompt user for a destination address for non-EVM or different chain outputs
          const promptedAddress = prompt(`Enter destination address for ${quote.outputAsset.symbol}:`);
          if (!promptedAddress) {
              setError("Destination address for the output asset is required.");
              setIsSwapping(false);
              return;
          }
          finalDestinationAddress = promptedAddress;
      }


      const txHash = await thorchainService.executeSwap(quote, fromAddress, finalDestinationAddress);
      setSwapTxHash(txHash);
      pollTransactionStatus(txHash, quote.inputAsset.chain);
    } catch (e: any) {
      console.error("Error executing swap:", e);
      setError(e.message || "An unknown error occurred during the swap.");
      // If error is about approval, guide user.
      if (e.message && e.message.includes("Approval required")) {
        setError(e.message + " Please wait for approval and try swapping again, or approve manually if tx hash provided.");
      }
    } finally {
      setIsSwapping(false);
    }
  };


  // Basic login/logout/connect buttons for testing Particle integration
  const renderAuthButtons = () => {
    if (isLoadingAuth) {
      return <p>Loading authentication...</p>;
    }
    if (userInfo) {
      return (
        <div className="my-4">
          <p>Welcome, {userInfo.name || userInfo.email || userInfo.uuid}!</p>
          {walletAccounts && walletAccounts.length > 0 ? (
            <p>Connected Wallet: {walletAccounts[0]}</p>
          ) : (
            <button
              onClick={() => connectWallet('metaMask')} // Example: connect MetaMask
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Connect Wallet
            </button>
          )}
          <button
            onClick={openWallet}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            disabled={!walletAccounts}
          >
            Open Particle Wallet
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
        <button
          onClick={() => login('google')} // Example: login with Google
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Google
        </button>
        {/* Add other login provider buttons as needed */}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Decentralized Exchange</h1>

      {renderAuthButtons()}

      {/* Thorchain Swap UI */}
      {userInfo && walletAccounts && walletAccounts.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">THORChain Swap</h2>

          {isLoadingAssets && <p>Loading available assets...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fromAsset" className="block text-sm font-medium text-gray-700">From Asset</label>
              <select
                id="fromAsset"
                name="fromAsset"
                value={selectedFromAssetSymbol}
                onChange={(e) => setSelectedFromAssetSymbol(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoadingAssets || fromAssets.length === 0}
              >
                <option value="" disabled>Select asset</option>
                {fromAssets.map((asset) => (
                  <option key={getAssetKey(asset)} value={asset.symbol}>
                    {asset.name || `${asset.ticker} (${asset.chain})`} ({asset.source})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="toAsset" className="block text-sm font-medium text-gray-700">To Asset</label>
              <select
                id="toAsset"
                name="toAsset"
                value={selectedToAssetSymbol}
                onChange={(e) => setSelectedToAssetSymbol(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isLoadingAssets || toAssets.length === 0}
              >
                <option value="" disabled>Select asset</option>
                {toAssets.map((asset) => (
                  <option key={getAssetKey(asset)} value={asset.symbol}>
                    {asset.name || `${asset.ticker} (${asset.chain})`} ({asset.source})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Swap</label>
            <input
              type="text" // Changed to text to allow for easier decimal input by user
              name="amount"
              id="amount"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
            />
          </div>

          <button
            onClick={handleGetQuote}
            disabled={isFetchingQuote || isLoadingAssets || !selectedFromAssetSymbol || !selectedToAssetSymbol || !amount}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isFetchingQuote ? 'Fetching Quote...' : (isLoadingAssets ? 'Assets Loading...' : 'Get Quote')}
          </button>

          {/* Display Quote */}
          {quote && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="text-lg font-medium">Quote Details:</h3>
              <p>Output: {quote.outputAmount} {quote.outputAsset.ticker}</p>
              <p>Fee: {quote.fees.totalFeeHumanReadable} {quote.fees.asset.ticker}</p>
              <p>Memo: <code className="text-xs bg-gray-200 p-1 rounded">{quote.memo}</code></p>
              <p>Inbound Address: <code className="text-xs bg-gray-200 p-1 rounded">{quote.inboundAddress}</code></p>
              {quote.dustThreshold && <p>Dust Threshold: {quote.dustThreshold} {quote.inputAsset.ticker}</p>}
              <button
                onClick={handleExecuteSwap}
                disabled={isSwapping}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isSwapping ? 'Swapping...' : 'Execute Swap'}
              </button>
            </div>
          )}
          {swapTxHash && <p className="mt-2 text-green-700">Swap Initiated! Tx Hash: <code className="text-sm">{swapTxHash}</code></p>}
          {error && <p className="mt-2 text-red-500">Error: {error}</p>}

          {/* Display Transaction Status from Polling */}
          {transactionStatus && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800">Transaction Status:</h3>
              <p>Status: <span className="font-semibold">{transactionStatus.status}</span></p>
              {transactionStatus.message && <p>{transactionStatus.message}</p>}
              {transactionStatus.type && <p>Type: {transactionStatus.type}</p>}
              {transactionStatus.inboundTx && (
                <div className="mt-1">
                  <p className="text-sm">Inbound: {transactionStatus.inboundTx.txID} ({transactionStatus.inboundTx.chain})</p>
                </div>
              )}
              {transactionStatus.outboundTxs && transactionStatus.outboundTxs.length > 0 && (
                <div className="mt-1">
                  <p className="text-sm">Outbound:</p>
                  {transactionStatus.outboundTxs.map((tx: any, index: number) => (
                    <p key={index} className="ml-2 text-xs">{tx.txID} ({tx.chain}) - Amount: {tx.amount} {tx.asset}</p>
                  ))}
                </div>
              )}
               {transactionStatus.rawAction && (
                <details className="mt-1 text-xs">
                  <summary>Raw Action Details</summary>
                  <pre className="bg-gray-200 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(transactionStatus.rawAction, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}

          {/* ZetaChain Section - Displaying assets fetched during initial load */}
      {userInfo && walletAccounts && walletAccounts.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">ZetaChain ZRC20 Assets</h2>
          <button
            onClick={handleFetchZetaAssetsForDisplay} // Can be used as a manual refresh
            disabled={isFetchingZetaCoins || !zetaChainService.isInitialized()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-2"
          >
            {isFetchingZetaCoins ? 'Refreshing ZRC20s...' : 'Refresh ZRC20 List'}
          </button>
          {!zetaChainService.isInitialized() && <p className="text-sm text-yellow-600">ZetaChain client not ready (connect wallet or check console).</p>}
          {zetaError && <p className="mt-2 text-red-500">ZetaChain Error: {zetaError}</p>}

          {zetaAssetsForDisplay.length > 0 ? (
            <div className="mt-3">
              <h4 className="font-medium">Available ZRC20s on ZetaChain:</h4>
              <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto bg-gray-50 p-2 rounded">
                {zetaAssetsForDisplay.map((asset) => (
                  <li key={getAssetKey(asset)}>
                    {asset.name || asset.ticker} ({asset.symbol}) - ZRC20: <code className="text-xs">{asset.contractAddress}</code>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ZRC20 assets loaded or available.</p>
          )}
        </div>
      )}

      {!zetaChainService.isInitialized() && userInfo && walletAccounts && walletAccounts.length > 0 && (
         <div className="mt-6 p-4 border rounded-lg shadow-md bg-yellow-50">
            <p className="text-yellow-700">ZetaChain client not initialized. Ensure your connected wallet is on a network supported by ZetaChain for interactions (e.g., a testnet like Goerli for ZetaChain Athens-3 testnet) or try reconnecting your wallet.</p>
            {zetaError && <p className="mt-1 text-red-600">Last attempt error: {zetaError}</p>}
         </div>
       )}

      {!userInfo || !walletAccounts || walletAccounts.length === 0 && (
        <div className="my-4 p-4 border rounded bg-gray-50">
          {isLoadingAuth ? (
            <p>Checking authentication status...</p>
          ) : !userInfo ? (
            <p>Please log in to use the DEX features.</p>
          ) : (
            <p>Please connect your wallet to proceed with trading.</p>
          )}
        </div>
      )}

      {/* This button's text is now dynamic based on auth and CTA generation */}
      <button
        className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4"
        disabled={isLoadingAuth || !userInfo || !walletAccounts || walletAccounts.length === 0}
        onClick={() => console.log("CTA button clicked, wallet: ", walletAccounts ? walletAccounts[0] : 'none')} // Placeholder action
      >
        {ctaText}
      </button>
    </div>
  );
};

export default DexPage;
