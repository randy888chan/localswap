'use client';

import React from 'react';
import { useParticleAuth } from './ParticleAuthContext';

const Header: React.FC = () => {
  const {
    userInfo,
    walletAccounts,
    isLoadingAuth,
    isLoadingWallet,
    login,
    logout,
    connectWallet,
    disconnectWallet,
    openWallet
  } = useParticleAuth();

  const handleParticleLogin = async (authType: 'email' | 'google' | 'twitter') => {
    try {
      await login(authType);
    } catch (error) {
      console.error("Login failed in Header:", error);
    }
  };

  const handleParticleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed in Header:", error);
    }
  };

  const handleConnectWallet = async (walletType?: 'particle' | 'metaMask' | 'walletconnect') => {
    try {
      await connectWallet(walletType);
    } catch (error) {
      console.error("Connect wallet failed in Header:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Disconnect wallet failed in Header:", error);
    }
  };

  if (isLoadingAuth && !userInfo) {
    return (
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Unified Crypto Exchange</div>
        <div>Authenticating...</div>
      </header>
    );
  }

  const displayAddress = walletAccounts && walletAccounts.length > 0
    ? `${walletAccounts[0].substring(0, 6)}...${walletAccounts[0].substring(walletAccounts[0].length - 4)}`
    : null;

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Unified Crypto Exchange</div>
      <div className="flex items-center space-x-2">
        {userInfo ? (
          <>
            <span className="mr-2">Welcome, {userInfo.name || userInfo.uuid?.substring(0,8) || 'User'}</span>
            {displayAddress ? (
              <>
                <span className="text-sm bg-gray-700 px-2 py-1 rounded">{displayAddress}</span>
                <button
                  onClick={openWallet}
                  disabled={isLoadingWallet}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50 text-sm"
                >
                  Wallet
                </button>
                <button
                  onClick={handleDisconnectWallet}
                  disabled={isLoadingWallet}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50 text-sm"
                >
                  Disconnect W.
                </button>
              </>
            ) : (
              <button
                onClick={() => handleConnectWallet()} // Default connect, Particle will show options
                disabled={isLoadingWallet}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded disabled:opacity-50 text-sm"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={handleParticleLogout}
              disabled={isLoadingAuth || isLoadingWallet}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleParticleLogin('email')}
              disabled={isLoadingAuth}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Login with Email
            </button>
            <button
              onClick={() => handleParticleLogin('google')}
              disabled={isLoadingAuth}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Login with Google
            </button>
            {/* Add more social login buttons as needed */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
