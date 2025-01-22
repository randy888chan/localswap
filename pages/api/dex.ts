import type { NextApiRequest, NextApiResponse } from 'next';

type SwapQuote = {
  fromToken: string;
  toToken: string;
  amount: number;
  estimatedGas: number;
  rate: number;
};

type Data = {
  quote: SwapQuote;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const mockQuote: SwapQuote = {
    fromToken: 'ETH',
    toToken: 'USDT',
    amount: 1,
    estimatedGas: 0.002,
    rate: 1800,
  };
  res.status(200).json({ quote: mockQuote });
}
