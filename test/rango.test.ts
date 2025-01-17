import { describe, it, expect } from 'vitest';
import { getSwapQuote } from '../lib/rango';

describe('getSwapQuote', () => {
  it('should return a swap quote', async () => {
    const quote = await getSwapQuote('BSC', 'AVAX_CCHAIN', '1');

    expect(quote).toHaveProperty('requestId');
    expect(quote).toHaveProperty('requestAmount');
    expect(quote).toHaveProperty('from');
    expect(quote).toHaveProperty('to');
    expect(quote).toHaveProperty('result');
    expect(quote.result).toHaveProperty('outputAmount');
    expect(quote.result).toHaveProperty('route');

    // Add more specific assertions based on the expected structure of the mock quote
    expect(quote.from.blockchain).toBe('BSC');
    expect(quote.to.blockchain).toBe('AVAX_CCHAIN');
  });
});
