import fetch from 'node-fetch';

const API_KEY = process.env.RANGO_API_KEY;
const BASE_URL = 'https://api.rango.exchange/v1';

export const getSwapQuote = async (from: string, to: string, amount: number) => {
  const response = await fetch(`${BASE_URL}/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ from, to, amount }),
  });
  const data = await response.json();
  return data;
};
