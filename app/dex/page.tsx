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


const DexPage: React.FC = () => {
  const [ctaText, setCta] = useState('Start Trading');
  const { userInfo, walletAccounts, isLoadingAuth, login, logout, connectWallet, openWallet } = useParticleAuth();

  // Thorchain Service instance
  // Memoize to avoid re-creating on every render, re-create if network changes
  const thorchainService = useMemo(() => new ThorchainService(Network.Mainnet), []); // Or Network.Testnet
  const zetaChainService = useMemo(() => new ZetaChainService(), []);


  // Thorchain Swap UI state
  const [fromAssetSymbol, setFromAssetSymbol] = useState<string>('ETH.ETH'); // Default example
  const [toAssetSymbol, setToAssetSymbol] = useState<string>('BTC.BTC');   // Default example
  const [amount, setAmount] = useState<string>('0.1');
  const [quote, setQuote] = useState<ThorchainQuote | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapTxHash, setSwapTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<any | null>(null); // To store status from polling

  // ZetaChain UI State
  const [zetaForeignCoins, setZetaForeignCoins] = useState<any[]>([]);
  const [isFetchingZetaCoins, setIsFetchingZetaCoins] = useState<boolean>(false);
  const [zetaError, setZetaError] = useState<string | null>(null);


  // Effect to initialize ThorchainService & ZetaChainService with signer when wallet connects
  useEffect(() => {
    const initServicesWithSigner = async () => {
      if (walletAccounts && walletAccounts.length > 0) {
        const signer = await getEthersSigner(); // From lib/particle
        const provider = getEthersProvider(); // From lib/particle
        
        // Initialize ThorchainService
        if (signer && provider) {
          thorchainService.setEvmSigner(signer, provider);
          console.log("ThorchainService EVM signer initialized.");
        } else {
          thorchainService.setEvmSigner(null);
          console.log("Failed to get EVM signer for ThorchainService from Particle.");
        }

        // Initialize ZetaChainService
        // IMPORTANT: This assumes getEthersSigner() returns an ethers v5 compatible signer
        // if ZetaChainClient strictly requires it. If there's a version mismatch (e.g. Particle uses ethers v6)
        // this initialization might fail or behave unexpectedly.
        // A dedicated getEthersV5Signer() might be needed in lib/particle.ts
        if (signer) {
          // @ts-ignore TODO: Address potential ethers v5/v6 signer incompatibility if issues arise.
          const success = await zetaChainService.initializeClient(signer as Signer); // Cast if necessary
          if (success) {
            console.log("ZetaChainService client initialized.");
          } else {
            console.error("Failed to initialize ZetaChainService client.");
            setZetaError("Failed to initialize ZetaChain client. Ensure wallet is on a supported network or check console.");
          }
        } else {
            console.log("No EVM signer available for ZetaChainService.");
        }

      } else {
        thorchainService.setEvmSigner(null); // Clear Thorchain signer
        // Consider how to de-initialize or handle ZetaChainService when wallet disconnects
        // zetaChainService.deinitializeClient(); // if such a method exists
        console.log("Wallet disconnected, signers cleared for services.");
      }
    };
    initServicesWithSigner();
  }, [walletAccounts, thorchainService, zetaChainService]);


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
    if (!fromAssetSymbol || !toAssetSymbol || !amount) {
      setError("Please fill in all fields for the quote.");
      return;
    }
    const fromAssetDetails = getAssetDetails(fromAssetSymbol);
    const toAssetDetails = getAssetDetails(toAssetSymbol);

    if (!fromAssetDetails || !toAssetDetails) {
      setError("Invalid asset symbol provided. Please use format like ETH.ETH or BTC.BTC.");
      return;
    }

    // Use the connected wallet address as the destination if not specified otherwise
    // For quotes, destination might not be strictly needed by THORChain but good to have.
    const destinationAddress = walletAccounts?.[0]; // Use the first connected account

    setIsFetchingQuote(true);
    try {
      const fetchedQuote = await thorchainService.getSwapQuote(
        fromAssetDetails,
        toAssetDetails,
        amount, // Input amount is human-readable
        destinationAddress // Optional for quote, but good to pass if available
      );
      if (fetchedQuote) {
        setQuote(fetchedQuote);
      } else {
        setError("Failed to fetch quote from THORChain. Check console for details.");
      }
    } catch (e: any) {
      console.error("Error fetching quote:", e);
      setError(e.message || "An unknown error occurred while fetching the quote.");
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleFetchZetaForeignCoins = async () => {
    setZetaError(null);
    setIsFetchingZetaCoins(true);
    try {
      if (!zetaChainService.isInitialized()) {
        setZetaError("ZetaChain client not initialized. Connect wallet and ensure it's on a supported network.");
        setIsFetchingZetaCoins(false);
        // Attempt to re-initialize if wallet is connected but service isn't ready
        if (walletAccounts && walletAccounts.length > 0) {
            const signer = await getEthersSigner();
            if (signer) {
                // @ts-ignore
                await zetaChainService.initializeClient(signer as Signer);
                if (zetaChainService.isInitialized()) {
                    const coins = await zetaChainService.listSupportedForeignCoins();
                    setZetaForeignCoins(coins);
                } else {
                     setZetaError("Failed to re-initialize ZetaChain client.");
                }
            }
        }
        return;
      }
      const coins = await zetaChainService.listSupportedForeignCoins();
      setZetaForeignCoins(coins);
    } catch (e: any) {
      console.error("Error fetching ZetaChain foreign coins:", e);
      setZetaError(e.message || "Failed to fetch ZetaChain foreign coins.");
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

          {/* Asset Selection & Amount Input - Basic Implementation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="fromAsset" className="block text-sm font-medium text-gray-700">From Asset (e.g., ETH.ETH)</label>
              <input
                type="text"
                name="fromAsset"
                id="fromAsset"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fromAssetSymbol}
                onChange={(e) => setFromAssetSymbol(e.target.value)}
                placeholder="ETH.ETH"
              />
            </div>
            <div>
              <label htmlFor="toAsset" className="block text-sm font-medium text-gray-700">To Asset (e.g., BTC.BTC)</label>
              <input
                type="text"
                name="toAsset"
                id="toAsset"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={toAssetSymbol}
                onChange={(e) => setToAssetSymbol(e.target.value)}
                placeholder="BTC.BTC"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Swap</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.0"
            />
          </div>

          <button
            onClick={handleGetQuote}
            disabled={isFetchingQuote || !fromAssetSymbol || !toAssetSymbol || !amount}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isFetchingQuote ? 'Fetching Quote...' : 'Get Quote'}
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

      {/* ZetaChain Section */}
      {userInfo && walletAccounts && walletAccounts.length > 0 && zetaChainService.isInitialized() && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">ZetaChain Interactions</h2>
          <button
            onClick={handleFetchZetaForeignCoins}
            disabled={isFetchingZetaCoins}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isFetchingZetaCoins ? 'Fetching ZRC20s...' : 'List Supported ZRC20s (Foreign Coins)'}
          </button>
          {zetaError && <p className="mt-2 text-red-500">ZetaChain Error: {zetaError}</p>}
          {zetaForeignCoins.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium">Supported Foreign Coins (ZRC20s on ZetaChain):</h4>
              <ul className="list-disc list-inside text-sm max-h-48 overflow-y-auto bg-gray-50 p-2 rounded">
                {zetaForeignCoins.map((coin, index) => (
                  <li key={index}>
                    {coin.symbol} (on chain ID: {coin.foreign_chain_id}) - ZRC20: <code className="text-xs">{coin.zrc20_contract_address}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
       {userInfo && walletAccounts && walletAccounts.length > 0 && !zetaChainService.isInitialized() && (
         <div className="mt-6 p-4 border rounded-lg shadow-md bg-yellow-50">
            <p className="text-yellow-700">ZetaChain client not initialized. Please ensure your connected wallet is on a network supported by ZetaChain for interactions (e.g., a testnet like Goerli for ZetaChain Athens-3 testnet) or try reconnecting your wallet.</p>
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
