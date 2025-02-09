'use client';
import React, { useEffect } from 'react';
import { getWidget } from '@rango-exchange/rango-client/widget';

const DexPage: React.FC = () => {
  useEffect(() => {
    const widget = getWidget({
      apiKey: process.env.NEXT_PUBLIC_RANGO_API_KEY,
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      theme: 'dark',
      defaultTokens: {
        from: 'BTC',
        to: 'ETH'
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
