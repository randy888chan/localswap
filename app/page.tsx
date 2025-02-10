'use client';
import React, { useState, useEffect } from 'react';

type Offer = {
  id: string;
  user: string;
  cryptocurrency: string;
  amount: number;
  price: number;
  paymentMethod: string;
};

// A reusable component to display a single P2P offer
const P2POffer: React.FC<Offer> = ({
  id,
  user,
  cryptocurrency,
  amount,
  price,
  paymentMethod,
}) => (
  <div key={id} className="border p-4 rounded-md shadow-md">
    <p className="font-semibold">{user}</p>
    <p>
      {amount} {cryptocurrency} @ ${price}
    </p>
    <p>Payment Method: {paymentMethod}</p>
  </div>
);

// A reusable loading indicator component
const LoadingIndicator: React.FC = () => (
  <div className="flex justify-center">
    {/* Replace this with a more visually appealing spinner or animation */}
    <p>Loading...</p>
  </div>
);

// A reusable error message component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-red-500">Error: {message}</p>
);

export default function Home() {
  const [personalizedContent, setContent] = useState<LandingContent | null>(null);
  const [p2pOffers, setP2pOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch personalized content
    fetch('/api/personalized-landing')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        // Cookie tracking for returning visitors
        document.cookie = `userSegment=${data.segment}; max-age=2592000`;
      });

    // Fetch P2P offers
    const fetchP2pOffers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/p2p');
        if (!res.ok) {
          switch (res.status) {
            case 404: throw new Error('P2P offers not found');
            case 500: throw new Error('Server error fetching P2P offers');
            default: throw new Error('Failed to fetch P2P offers');
          }
        }
        const data = await res.json();
        setP2pOffers(data.offers);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
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

        {/* Show loading indicator */}
        {isLoading && <LoadingIndicator />}

        {/* Show error message */}
        {error && <ErrorMessage message={error} />}

        {/* Show P2P offers if not loading and no error */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p2pOffers.map((offer) => (
              <P2POffer key={offer.id} {...offer} />
            ))}
          </div>
        )}
      </section>

      {/* Other sections (DEX/Aggregator, User Dashboard) - You can add them here */}
    </div>
  );
}
