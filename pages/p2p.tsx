import React from 'react';

const P2PPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">P2P Crypto Exchange</h1>
      <p className="mb-4">
        This is the P2P trading section where users can buy and sell
        cryptocurrencies directly with each other using various payment methods.
      </p>
      {/* Placeholder for displaying offers */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-gray-500">P2P trading coming soon...</p>
      </div>
    </div>
  );
};

export default P2PPage;
