import React, { useState, useEffect } from 'react';

type Offer = {
  id: string;
  user: string;
  cryptocurrency: string;
  amount: number;
  price: number;
  paymentMethod: string;
};

const HomePage: React.FC = () => {
  const [p2pOffers, setP2pOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchP2pOffers = async () => {
      try {
        const res = await fetch('/api/p2p');
        if (!res.ok) {
          throw new Error('Failed to fetch P2P offers');
        }
        const data = await res.json();
        setP2pOffers(data.offers);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchP2pOffers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Unified Crypto Exchange
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">P2P Trading</h2>
        <p>
          Trade cryptocurrencies directly with other users in a secure and
          decentralized manner.
        </p>
        {isLoading && <p>Loading P2P offers...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p2pOffers.map((offer) => (
              <div key={offer.id} className="border p-4 rounded-md shadow-md">
                <p className="font-semibold">{offer.user}</p>
                <p>
                  {offer.amount} {offer.cryptocurrency} @ ${offer.price}
                </p>
                <p>Payment Method: {offer.paymentMethod}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Other sections (DEX/Aggregator, User Dashboard) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Cross-Chain DEX & Aggregator
        </h2>
        <p>
          Swap tokens across different blockchains with the best rates from
          top decentralized exchanges.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">User Dashboard</h2>
        <p>
          Track your transactions, manage your portfolio, and access other
          personalized features.
        </p>
      </section>
    </div>
  );
};

export default HomePage;