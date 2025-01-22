'use client';
import React from 'react';

const DexPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cross-Chain DEX & Aggregator
      </h1>

      <section className="mb-8">
        <p>
          Swap tokens across different blockchains with the best rates from top
          decentralized exchanges.
        </p>

        {/* Input fields for the swap */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="fromToken" className="block mb-2">
              From Token
            </label>
            <input
              type="text"
              id="fromToken"
              className="border p-2 rounded w-full"
              placeholder="e.g., BTC"
            />
          </div>
          <div>
            <label htmlFor="toToken" className="block mb-2">
              To Token
            </label>
            <input
              type="text"
              id="toToken"
              className="border p-2 rounded w-full"
              placeholder="e.g., ETH"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="border p-2 rounded w-full"
              placeholder="e.g., 1.5"
            />
          </div>
        </div>

        {/* Placeholder for swap quote */}
        <div className="border p-4 rounded-md shadow-md mb-4">
          <p className="font-semibold">Swap Quote</p>
          <p>...</p> {/* We'll display the quote here later */}
        </div>

        {/* Swap button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Swap
        </button>
      </section>
    </div>
  );
};

export default DexPage;
