'use client';
import React, { useState, useEffect } from 'react';

interface RangoSwap {
  id: string;
  fromAmount: string;
  fromCurrency: string;
  toAmount: string;
  toCurrency: string;
  status: string;
  timestamp: string;
}

export default function Dashboard() {
  const [swapHistory, setSwapHistory] = useState<RangoSwap[]>([]);

  useEffect(() => {
    const loadSwaps = async () => {
      const swaps = await fetch('/api/user/swaps').then(res => res.json());
      setSwapHistory(filterSuccessfulSwaps(swaps));
    };
    
    // Realtime updates via SSE
    const eventSource = new EventSource('/api/swaps/stream');
    eventSource.onmessage = (e) => {
      setSwapHistory(prev => [JSON.parse(e.data), ...prev]);
    };
    
    return () => eventSource.close();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Swap History</h2>
      <div className="space-y-2">
        {swapHistory.map(swap => (
          <div key={swap.id} className="border p-2 rounded">
            <p>{swap.fromAmount} {swap.fromCurrency} → {swap.toAmount} {swap.toCurrency}</p>
            <p className="text-sm text-gray-500">{swap.status} @ {new Date(swap.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function filterSuccessfulSwaps(swaps: RangoSwap[]): RangoSwap[] {
  return swaps.filter(swap => 
    ['COMPLETED', 'SUCCESS'].includes(swap.status.toUpperCase())
  );
}
