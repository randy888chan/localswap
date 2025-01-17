import React from 'react';
import { GetServerSideProps } from 'next';
import { getSwapQuote } from '../lib/rango';

interface DEXPageProps {
  quote: any; // Replace 'any' with a more specific type later
}

const DEXPage: React.FC<DEXPageProps> = ({ quote }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cross-Chain DEX/Aggregator</h1>
      <p className="mb-4">
        This is the DEX/Aggregator section where users can swap tokens across
        different blockchains.
      </p>
      {/* Placeholder UI elements */}
      <div className="bg-gray-100 p-4 rounded">
        {quote ? (
          <div>
            <p>From: {quote.from.blockchain} {quote.from.symbol}</p>
            <p>To: {quote.to.blockchain} {quote.to.symbol}</p>
            <p>Amount: {quote.requestAmount}</p>
            <p>Estimated Output: {quote.result.outputAmount}</p>
            {/* Add more details from the quote as needed */}
          </div>
        ) : (
          <p className="text-gray-500">
            Swap UI coming soon...
          </p>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<DEXPageProps> = async () => {
  // Fetch a mock swap quote for now
  const quote = await getSwapQuote('BSC', 'AVAX_CCHAIN', '1');

  return {
    props: {
      quote,
    },
  };
};

export default DEXPage;
