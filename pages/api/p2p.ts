import type { NextApiRequest, NextApiResponse } from 'next';
import offers from '../../data/p2pOffers.json';

type Offer = {
  id: string;
  user: string;
  cryptocurrency: string;
  amount: number;
  price: number;
  paymentMethod: string;
};

type Data = {
  offers: Offer[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ offers });
}
