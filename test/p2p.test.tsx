import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import P2PPage from '../pages/p2p';
import * as localcoinswap from '../lib/localcoinswap';
import { Offer } from '../types/localcoinswap';

// Mock the getOffers function
vi.mock('../lib/localcoinswap', () => ({
  getOffers: vi.fn(),
}));

const mockOffers: Offer[] = [
  {
    trading_type: {
      slug: 'buy',
      name: 'Buy',
      opposite_name: 'Sell',
    },
    uuid: '6c393ba2-665d-48c3-8aa6-e57c2e73fa24',
    coin_currency: {
      title: 'Bitcoin',
      symbol: 'BTC',
      symbol_filename: 'btc.svg',
      is_crypto: true,
    },
    fiat_currency: {
      title: 'United States Dollar',
      symbol: 'USD',
      symbol_filename: 'None',
      is_crypto: false,
    },
    payment_method: {
      name: 'PayPal',
      slug: 'paypal',
    },
    country_code: 'AW',
    min_trade_size: 10,
    max_trade_size: 2000,
    trading_conditions: 'Please be polite.',
    headline: '',
    hidden: false,
    enforced_sizes: '',
    automatic_cancel_time: 240,
    sms_required: false,
    minimum_feedback: 0,
    custodial_type: 0,
  },
];

describe('P2PPage', () => {
  it('renders the P2P page with offers', async () => {
    // Mock the getOffers function to return the mock offers
    vi.mocked(localcoinswap.getOffers).mockResolvedValue(mockOffers);

    render(<P2PPage offers={mockOffers} />);

    // Assert that the heading is rendered
    const heading = screen.getByRole('heading', {
      name: /P2P Crypto Exchange/i,
    });
    expect(heading).toBeInTheDocument();

    // Assert that the offers are rendered
    const offerElement = screen.getByText(/BTC \/ USD - Buy \(PayPal\)/i);
    expect(offerElement).toBeInTheDocument();
  });

  it('renders a message when there are no offers', async () => {
    // Mock the getOffers function to return an empty array
    vi.mocked(localcoinswap.getOffers).mockResolvedValue([]);

    render(<P2PPage offers={[]} />);

    // Assert that the no offers message is rendered
    const noOffersMessage = screen.getByText(/No offers available./i);
    expect(noOffersMessage).toBeInTheDocument();
  });
});
