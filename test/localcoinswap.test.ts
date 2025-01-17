import { describe, it, expect } from 'vitest';
import { getOffers } from '../lib/localcoinswap';

describe('getOffers', () => {
  it('should return an array of offers', async () => {
    const offers = await getOffers();
    expect(Array.isArray(offers)).toBe(true);
    expect(offers.length).toBeGreaterThan(0); // Assuming mock data has at least one offer

    // Add more specific assertions based on the expected structure of the mock offers
    const offer = offers[0];
    expect(offer).toHaveProperty('uuid');
    expect(offer).toHaveProperty('trading_type');
    expect(offer.trading_type).toHaveProperty('slug');
    // ... add more assertions as needed
  });
});
