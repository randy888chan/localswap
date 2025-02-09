'use client';
import React, { useEffect, useState } from 'react';
import { getWidget } from '@rango-exchange/rango-client/widget';

function NetworkStatus({ status, label }: { status: boolean; label: string }) {
  return (
    <div className={`fixed bottom-4 right-4 p-2 bg-opacity-90 rounded-lg ${
      status ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {label}: {status ? 'Connected' : 'Disconnected'}
    </div>
  );
}

const DexPage: React.FC = () => {
  const [bitcoinStatus, setBitcoinStatus] = useState(false);
  const [ethereumStatus, setEthereumStatus] = useState(false);

  useEffect(() => {
    const checkBitcoin = () => {
      navigator.serviceWorker?.controller?.postMessage({ type: 'ping' })
        .then(() => setBitcoinStatus(true))
        .catch(() => setBitcoinStatus(false));
    };

    const checkEthereum = async () => {
      setEthereumStatus(!!window.ethereum?.isConnected());
    };

    const interval = setInterval(() => {
      checkBitcoin();
      checkEthereum();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const widget = getWidget({
        apiKey: process.env.NEXT_PUBLIC_RANGO_API_KEY!,
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        theme: 'dark',
        networkStatus: {
          Bitcoin: bitcoinStatus,
          Ethereum: ethereumStatus
        }
    });

    widget.mount('#rango-widget-container');

    return () => widget.unmount();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cross-Chain DEX & Aggregator
      </h1>
      <div id="rango-widget-container" className="min-h-[600px]" />
    </div>
  );
};

export default DexPage;
