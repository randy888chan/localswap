import { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Unified Crypto Exchange</h1>
      <p className="mt-4 text-xl">
        Buy, sell, and swap cryptocurrencies with ease.
      </p>
    </div>
  );
};

export default Home;
