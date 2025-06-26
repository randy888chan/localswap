'use client'; // Added 'use client' as it's a client component using hooks

import React, { useState, useEffect } from 'react'; // Added React import
import { useParticleAuth } from './ParticleAuthContext'; // Import Particle Auth hook

// Assuming trackCTAConversion is defined elsewhere or can be imported
// declare function trackCTAConversion(intent: string): void;

// interface ButtonPromptArgs { // This interface doesn't seem to be used directly in the component props
//   intent: 'trade' | 'learn';
//   userLevel: 'beginner' | 'intermediate' | 'pro';
// }

export default function PersonalizedButton({ intent }: { intent: string }) {
  // const { data: session } = useSession(); // Removed useSession
  const { userInfo, isLoading: isAuthLoading } = useParticleAuth();
  const [ctaText, setCta] = useState('Start Trading');

  useEffect(() => {
    let apiUrl = `/api/generate-cta?intent=${intent}`;
    if (userInfo && !isAuthLoading) {
      // TODO: Determine how to get userLevel from Particle userInfo or other app state
      // For now, we'll omit the level or send a default.
      // Example: if (userInfo.customFieldForTier) { apiUrl += `&level=${userInfo.customFieldForTier}`; }
      // Or, if no specific user level from Particle, send a generic request or default.
      // For now, just sending intent, assuming the API can handle missing level.
    } else if (!isAuthLoading) {
      // User not logged in, perhaps a different CTA or default.
      // The API might return a generic CTA if level is not provided.
    }

    if (!isAuthLoading) { // Fetch only when auth state is determined
        fetch(apiUrl)
          .then(res => {
            if (!res.ok) {
              throw new Error(`API request failed with status ${res.status}`);
            }
            return res.json();
          })
          .then(({ text }) => {
            if (text) {
                setCta(text)
            } else {
                // Fallback if API doesn't return text for some reason
                setCta(intent === 'trade' ? 'Trade Now' : 'Learn More');
            }
          })
          .catch(error => {
            console.error("Failed to fetch PersonalizedButton CTA:", error);
            setCta(intent === 'trade' ? 'Trade Now' : 'Learn More'); // Fallback on error
          });
    }

  }, [intent, userInfo, isAuthLoading]);

  // Assuming trackCTAConversion is a global function or imported
  const handleButtonClick = () => {
    if (typeof trackCTAConversion === 'function') {
      trackCTAConversion(intent);
    } else {
      console.warn('trackCTAConversion function not defined');
    }
    // Potentially navigate or perform other actions based on intent
    // Example: if (intent === 'trade') router.push('/dex');
  };

  return (
    <button 
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
      onClick={handleButtonClick}
      disabled={isAuthLoading} // Disable button while auth state is loading
    >
      {isAuthLoading ? 'Loading...' : ctaText}
    </button>
  );
}
