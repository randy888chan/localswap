'use client';
import React, { useEffect, useState } from 'react';
// import { getWidget } from '@rango-exchange/rango-client/widget'; // Removed Rango import
// import { useSession } from 'next-auth/react'; // Removed next-auth import
import { useParticleAuth } from '@/components/ParticleAuthContext'; // Import Particle Auth hook

// function NetworkStatus({ status, label }: { status: boolean; label: string }) {
//   return (
//     <div className={`fixed bottom-4 right-4 p-2 bg-opacity-90 rounded-lg ${
//       status ? 'bg-green-500' : 'bg-red-500'
//     }`}>
//       {label}: {status ? 'Connected' : 'Disconnected'}
//     </div>
//   );
// }

const DexPage: React.FC = () => {
  // const [bitcoinStatus, setBitcoinStatus] = useState(false);
  // const [ethereumStatus, setEthereumStatus] = useState(false);

  // useEffect(() => {
  //   const checkBitcoin = () => {
  //     navigator.serviceWorker?.controller?.postMessage({ type: 'ping' })
  //       .then(() => setBitcoinStatus(true))
  //       .catch(() => setBitcoinStatus(false));
  //   };

  //   const checkEthereum = async () => {
  //     setEthereumStatus(!!window.ethereum?.isConnected());
  //   };

  //   const interval = setInterval(() => {
  //     checkBitcoin();
  //     checkEthereum();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // const [widgetInitialized, setWidgetInitialized] = useState(false); // Rango specific

  // useEffect(() => { // Rango specific widget initialization
    // const initWidget = async () => {
    //   try {
    //     const res = await fetch('/api/rango-token');
    //     const { token } = await res.json();
        
    //     const widget = getWidget({
    //       apiKey: token,
    //       particleAuthParams: { // This was Rango's way of potentially using Particle, will be handled by Particle SDK directly
    //         projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
    //         clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY!,
    //         appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID!,
    //         chainOptions: {
    //           btc: { isTestnet: false },
    //           evm: [
    //             { chainId: 1, name: 'Ethereum' },
    //             { chainId: 56, name: 'BSC' }
    //           ]
    //         }
    //       },
    //       theme: 'dark',
    //       networkStatus: {
    //         Bitcoin: bitcoinStatus,
    //         Ethereum: ethereumStatus,
    //         Polygon: bitcoinStatus && ethereumStatus
    //       },
    //       hooks: {
    //         onRouteComputed: (route) => {
    //           console.log('Best route:', route);
    //           // analytics.track('route_computed', route); // Assuming analytics and pubSub are defined elsewhere or part of Rango
    //         },
    //         onSwapStatus: (status) => {
    //           // pubSub.publish(`swap-${status.requestId}`, status);
    //         }
    //       }
    //     });

    //     // Auto-refresh session token 30s before expiration
    //     // This logic is Rango specific
    //     // setTimeout(async () => {
    //     //   const newRes = await fetch('/api/rango-refresh', {
    //     //     method: 'POST',
    //     //     body: JSON.stringify({ token })
    //     //   });
    //     //   const { token: newToken } = await newRes.json();
    //     //   widget.updateConfig({ apiKey: newToken });
    //     // }, expires - Date.now() - 30000); // Assuming 'expires' was defined in Rango context

    //     widget.mount('#rango-widget-container');
    //     return () => {
    //       widget.unmount();
    //       widget.destroy();
    //     };
    //   } catch (error) {
    //     console.error('Widget initialization failed:', error);
    //   }
    // };

    // if (!widgetInitialized) {
    //   initWidget();
    //   setWidgetInitialized(true);
    // }
  // }, [widgetInitialized, bitcoinStatus, ethereumStatus]);

  const [ctaText, setCta] = useState('Start Trading');
  // const { data: session } = useSession(); // Assuming useSession is for general app session, not Rango specific
  const { userInfo, isLoading: isAuthLoading } = useParticleAuth();

  useEffect(() => {
    // if (session?.user) { // Check if session and user exist
    if (userInfo && !isAuthLoading) { // Use Particle user info
      const generateCta = async () => {
        try {
          // This assumes session.user has experienceLevel, walletBalances, and lastActivity
          // These might need to be adapted based on how Particle Network provides user data
          // For now, we'll pass placeholder/mocked data or skip if userInfo doesn't have these details.
          // TODO: Adapt generateCta based on actual data available from Particle's userInfo
          // For example, Particle's userInfo might not directly provide 'experienceLevel' or 'walletBalances'
          // in the same structure as next-auth's session.user. This will need adjustment.

          // Mocking payload for now as userInfo structure is different
          const payload = {
            // experience: (userInfo as any).experienceLevel, // This field likely doesn't exist on Particle's UserInfo
            // balances: (userInfo as any).walletBalances, // This field likely doesn't exist on Particle's UserInfo
            userId: userInfo.uuid, // Use a field that exists, like uuid or email
            device: navigator.platform
          };

          const res = await fetch('/api/generate-cta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          setCta(data.text);
        } catch (err){
          console.error("Failed to generate CTA:", err);
          setCta('Trade Now'); // Fallback
        }
      };

      generateCta();
    } else if (!isAuthLoading) {
      // User is not logged in, set a default CTA or handle as needed
      setCta('Login to Trade');
    }
  }, [userInfo, isAuthLoading]);

  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex gap-4 mb-4">
        <NetworkStatus status={bitcoinStatus} label="Bitcoin" />
        <NetworkStatus status={ethereumStatus} label="Ethereum" />
      </div> */}
      {/* <div id="rango-widget-container" className="min-h-[600px] relative"> */}
        {/* {!bitcoinStatus && <div className="absolute inset-0 bg-red-500/20" />} */}
      {/* </div> */}
      <div>
        <p>DEX Page - Thorchain/ZetaChain integration coming soon...</p>
        {/* Placeholder for the new swap interface */}
      </div>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg mt-4">
        {ctaText}
      </button>
    </div>
  );
};

export default DexPage;
