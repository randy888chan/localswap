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

  const [widgetInitialized, setWidgetInitialized] = useState(false);

  useEffect(() => {
    const initWidget = async () => {
      try {
        const res = await fetch('/api/rango-token');
        const { token } = await res.json();
        
        const widget = getWidget({
          apiKey: token,
          walletConnectProjectId: '', // Disable WalletConnect
          particleAuthParams: {
            projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
            clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY!,
            appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID!,
          },
          theme: 'dark',
          networkStatus: {
            Bitcoin: bitcoinStatus,
            Ethereum: ethereumStatus
          },
          authCallback: (userInfo) => {
            console.log('Particle user authenticated:', userInfo)
          }
        });

        widget.mount('#rango-widget-container');
        return () => {
          widget.unmount();
          widget.destroy();
        };
      } catch (error) {
        console.error('Widget initialization failed:', error);
      }
    };

    if (!widgetInitialized) {
      initWidget();
      setWidgetInitialized(true);
    }
  }, [widgetInitialized, bitcoinStatus, ethereumStatus]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <NetworkStatus status={bitcoinStatus} label="Bitcoin" />
        <NetworkStatus status={ethereumStatus} label="Ethereum" />
      </div>
      <div id="rango-widget-container" className="min-h-[600px] relative">
        {!bitcoinStatus && <div className="absolute inset-0 bg-red-500/20" />}
      </div>
    </div>
  );
};

export default DexPage;
