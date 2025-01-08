import fetch from 'node-fetch';

const API_KEY = process.env.LOCALCOINSWAP_API_KEY;
const BASE_URL = 'https://api.localcoinswap.com/v1';

export const getOffers = async () => {
  const response = await fetch(`${BASE_URL}/offers`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });
  const data = await response.json();
  return data;
};
