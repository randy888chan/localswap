import { useState } from 'react';
import { getSwapQuote } from '../lib/rango';

const DEX: NextPage = () => {
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('ETH');
  const [amount, setAmount] = useState(1);
  const [quote, setQuote] = useState(null);

  const handleSwap = async () => {
    const quote = await getSwapQuote(from, to, amount);
    setQuote(quote);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Cross-Chain DEX & Aggregator</h1>
      <div>
        <label>From:</label>
        <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div>
        <label>To:</label>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <button onClick={handleSwap}>Get Quote</button>
      {quote && <div>Quote: {JSON.stringify(quote)}</div>}
    </div>
  );
};

export default DEX;
