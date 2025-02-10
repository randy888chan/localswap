export async function fetchCoinData(slug: string) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${slug}`);
  return res.ok ? res.json() : null;
}
