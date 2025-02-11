import type { NextApiRequest, NextApiResponse } from 'next';
import { lcsApiRequest } from '@/lib/api-client';

type OfferParams = {
  coin_currency?: string;
  fiat_currency?: string;
  payment_method?: string;
  limit?: number;
  offset?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params: OfferParams = {
      coin_currency: req.query.coin_currency?.toString(),
      fiat_currency: req.query.fiat_currency?.toString(),
      payment_method: req.query.payment_method?.toString(),
      limit: Number(req.query.limit) || 20,
      offset: Number(req.query.offset) || 0
    };

    const searchParams = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
    
    const response = await lcsApiRequest(`offers/search/?${searchParams}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch offers');
    }

    const { results } = await response.json();
    res.status(200).json({ offers: results });
    
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'P2P_FETCH_FAILED'
    });
  }
}
