import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { lcsApiRequest } from '@/lib/api-client';

// Load from .env.test
const TEST_API_KEY = process.env.LOCALCOINSWAP_API_KEY!;

describe('P2P Trading API', () => {
  let testOfferId: string;
  let testTradeId: string;

  beforeAll(async () => {
    // Create test offer
    const offerRes = await lcsApiRequest('offers/', {
      method: 'POST',
      headers: { Authorization: `Token ${TEST_API_KEY}` },
      body: JSON.stringify({
        trading_type: 'sell',
        coin_currency: 'BTC',
        fiat_currency: 'USD',
        payment_method: 'bank_transfer',
        country_code: 'US',
        min_trade_size: 100,
        max_trade_size: 1000,
        pricing_type: 'margin',
        pricing_expression: "1.05",
        trading_conditions: "Vitest Test Offer",
        automatic_cancel_time: 60
      })
    });
    
    testOfferId = (await offerRes.json()).uuid;
  });

  it('should complete full trade lifecycle', async () => {
    // Create Trade
    const tradeRes = await lcsApiRequest('trades/non-custodial/create/', {
      method: 'POST',
      headers: { Authorization: `Token ${TEST_API_KEY}` },
      body: JSON.stringify({
        offer: testOfferId,
        fiat_amount: 150,
        wallet_address: "tb1qtestaddress",
        wallet_type: "web"
      })
    });
    
    const tradeData = await tradeRes.json();
    testTradeId = tradeData.uuid;
    expect(tradeRes.status).toBe(201);

    // Verify Escrow
    const verifyRes = await lcsApiRequest(`trades/${testTradeId}/verify`);
    expect(verifyRes.status).toBe(200);

    // Simulate Payment
    const paymentRes = await lcsApiRequest(`trades/${testTradeId}/payment`, {
      method: 'POST',
      headers: { Authorization: `Token ${TEST_API_KEY}` },
      body: JSON.stringify({ proof: "bank_transfer_12345" })
    });
    expect(paymentRes.status).toBe(200);

    // Release Escrow
    const releaseRes = await lcsApiRequest(`trades/${testTradeId}/release`, {
      method: 'POST',
      headers: { Authorization: `Token ${TEST_API_KEY}` }
    });
    expect(releaseRes.status).toBe(200);
  });

  afterAll(async () => {
    // Cleanup Test Offer
    await lcsApiRequest(`offers/${testOfferId}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${TEST_API_KEY}` }
    });
  });
});
