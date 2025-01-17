import React from 'react';
import { GetServerSideProps } from 'next';
import { getOffers } from '../lib/localcoinswap';
import { Offer } from '../types/localcoinswap';

interface P2PPageProps {
  offers: Offer[];
}

const P2PPage: React.FC<P2PPageProps> = ({ offers }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">P2P Crypto Exchange</h1>
      <p className="mb-4">
        This is the P2P trading section where users can buy and sell
        cryptocurrencies directly with each other using various payment methods.
      </p>
      {/* Display offers */}
      <div className="bg-gray-100 p-4 rounded">
        {offers.length > 0 ? (
          <ul>
            {offers.map((offer) => (
              <li key={offer.uuid} className="mb-2">
                {offer.coin_currency.symbol} / {offer.fiat_currency.symbol} -{' '}
                {offer.trading_type.name} ({offer.payment_method.name})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No offers available.</p>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<P2PPageProps> = async () => {
  const offers = await getOffers();

  return {
    props: {
      offers,
    },
  };
};

export default P2PPage;
