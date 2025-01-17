import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/dashboard';
import * as db from '../lib/db';

// Mock the getUserTransactions function
vi.mock('../lib/db', () => ({
  getUserTransactions: vi.fn(),
}));

const mockTransactions = [
  {
    id: '1',
    userId: 'user123',
    type: 'buy',
    amount: '0.5',
    currencyFrom: 'USD',
    currencyTo: 'BTC',
    status: 'completed',
    timestamp: '2023-06-15T10:00:00Z',
  },
];

describe('Dashboard', () => {
  it('renders the dashboard with transactions', async () => {
    vi.mocked(db.getUserTransactions).mockResolvedValue(mockTransactions);

    render(<Dashboard transactions={mockTransactions} />);

    // Assert that the heading is rendered
    const heading = screen.getByRole('heading', {
      name: /User Dashboard/i,
    });
    expect(heading).toBeInTheDocument();

    // Assert that the transaction details are rendered
    expect(screen.getByText(/0.5/i)).toBeInTheDocument();
  });

  it('renders a message when there are no transactions', async () => {
    vi.mocked(db.getUserTransactions).mockResolvedValue([]);

    render(<Dashboard transactions={[]} />);

    expect(screen.getByText(/No transactions found./i)).toBeInTheDocument();
  });
});
