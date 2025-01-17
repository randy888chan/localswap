import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DEXPage from '../pages/dex';
import * as rango from '../lib/rango';

// Mock the getSwapQuote function
vi.mock('../lib/rango', () => ({
  getSwapQuote: vi.fn(),
}));

const mockQuote = {
  requestId: 'd10657ce-b13a-405c-825b-b47f8a5016ad',
  requestAmount: '1',
  from: {
    blockchain: 'BSC',
    symbol: 'BNB',
    address: null,
  },
  to: {
    blockchain: 'AVAX_CCHAIN',
    symbol: 'USDT.E',
    address: '0xc7198437980c041c805a1edcba50c1ce5db95118',
  },
  result: {
    outputAmount: '28.5',
    fee: '0.1',
    route: [],
  },
  validationStatus: null,
  diagnosisMessages: [],
  missingBlockchains: [],
  blockchains: ['BSC', 'AVAX_CCHAIN'],
  processingLimitReached: false,
  walletNotSupportingFromBlockchain: false,
  error: null,
  errorCode: null,
  traceId: null,
};

describe('DEXPage', () => {
  it('renders the DEX page with a quote', async () => {
    vi.mocked(rango.getSwapQuote).mockResolvedValue(mockQuote);

    render(<DEXPage quote={mockQuote} />);

    await waitFor(() => {
      expect(screen.getByText(/From: BSC BNB/i)).toBeInTheDocument();
      expect(screen.getByText(/To: AVAX_CCHAIN USDT.E/i)).toBeInTheDocument();
      expect(screen.getByText(/Amount: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Output: 28.5/i)).toBeInTheDocument();
    });
  });

  it('renders a loading message when there is no quote', async () => {
    render(<DEXPage quote={null} />);

    expect(screen.getByText(/Swap UI coming soon.../i)).toBeInTheDocument();
  });
});
