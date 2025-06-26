'use client';
import React, { useState, useEffect } from 'react';
import { useParticleAuth } from '@/components/ParticleAuthContext';

// interface RangoSwap { // Old RangoSwap interface, will be replaced
//   id: string;
//   fromAmount: string;
//   fromCurrency: string;
//   toAmount: string;
//   toCurrency: string;
//   status: string;
//   timestamp: string;
// }

// TODO: Define a new interface for unified transaction history
interface TransactionHistoryItem {
  id: string;
  type: 'swap' | 'transfer' | 'contract_call'; // Example types
  description: string; // e.g., "Swap 0.1 ETH for 150 USDC"
  status: string; // e.g., "Completed", "Pending", "Failed"
  timestamp: string;
  detailsLink?: string; // Link to explorer
}

export default function Dashboard() {
  // const [swapHistory, setSwapHistory] = useState<RangoSwap[]>([]); // Old state
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistoryItem[]>([]);
  const { userInfo, walletAccounts, isLoadingAuth, isLoadingWallet } = useParticleAuth();

  useEffect(() => {
    if (userInfo && walletAccounts && walletAccounts.length > 0) {
      // TODO: Implement fetching transaction history for the connected wallet/user
      // This will involve new API endpoints and logic for Thorchain/ZetaChain/Particle.
      // For now, we can set some mock data or leave it empty.
      console.log('Dashboard: User and wallet connected. Fetch transaction history here.');
      // Example:
      // const loadHistory = async () => {
      //   // const history = await fetch(`/api/user/transactions?wallet=${walletAccounts[0]}&userId=${userInfo.uuid}`).then(res => res.json());
      //   // setTransactionHistory(history);
      // };
      // loadHistory();

      // Simulate fetching Thorchain swap history
      const mockThorchainHistory: TransactionHistoryItem[] = [
        {
          id: 'thor_swap_1',
          type: 'swap',
          description: 'Swapped 0.05 ETH for 0.001 BTC via THORChain',
          status: 'Completed',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          detailsLink: `https://viewblock.io/thorchain/tx/MOCK_THOR_TX_HASH_1`
        },
        {
          id: 'thor_swap_2',
          type: 'swap',
          description: 'Swapped 100 USDT (ERC20) for 0.02 ETH via THORChain',
          status: 'Pending',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
          detailsLink: `https://viewblock.io/thorchain/tx/MOCK_THOR_TX_HASH_2`
        },
      ];
      // In a real app, you'd fetch this from your backend, which gets it from DB
      // and potentially augments with live status from ThorchainService if needed.
      setTransactionHistory(mockThorchainHistory);
    }
    // Old Rango-specific logic:
    // const loadSwaps = async () => {
    //   const swaps = await fetch('/api/user/swaps').then(res => res.json());
    //   setSwapHistory(filterSuccessfulSwaps(swaps));
    // };
    // Realtime updates via SSE
    // const eventSource = new EventSource('/api/swaps/stream');
    // eventSource.onmessage = (e) => {
    //   setSwapHistory(prev => [JSON.parse(e.data), ...prev]);
    // };
    // return () => eventSource.close();
  }, [userInfo, walletAccounts]);

  if (isLoadingAuth) {
    return <div className="p-4">Loading user information...</div>;
  }

  if (!userInfo) {
    return <div className="p-4">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-lg">Welcome, {userInfo.name || userInfo.email || userInfo.uuid}!</p>
      </div>

      {walletAccounts && walletAccounts.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Wallet Information</h2>
          <p>Connected Address: <span className="font-mono bg-gray-100 p-1 rounded">{walletAccounts[0]}</span></p>
          {/* TODO: Display current network/chain if available from ParticleConnect or context */}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Wallet Information</h2>
          <p>No wallet connected. Please connect a wallet via the header.</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        {isLoadingWallet && <p>Loading wallet data...</p>}
        {!isLoadingWallet && transactionHistory.length === 0 && (
          <p>No transactions yet, or history is loading for the first time.</p>
        )}
        {!isLoadingWallet && transactionHistory.length > 0 && (
          <div className="space-y-3">
            {transactionHistory.map(tx => (
              <div key={tx.id} className="border p-3 rounded-lg shadow">
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-gray-600">Status: {tx.status}</p>
                <p className="text-xs text-gray-400">Date: {new Date(tx.timestamp).toLocaleString()}</p>
                {tx.detailsLink && <a href={tx.detailsLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View Details</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// function filterSuccessfulSwaps(swaps: RangoSwap[]): RangoSwap[] { // Old function
//   return swaps.filter(swap =>
//     ['COMPLETED', 'SUCCESS'].includes(swap.status.toUpperCase())
//   );
// }
