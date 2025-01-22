import { render, screen, waitFor, act } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Home from '../app/page'; // Import your Home component (adjust path if needed)

// Mock P2P offers data
const mockOffers = [
  {
    id: 'offer1',
    user: 'Alice',
    cryptocurrency: 'BTC',
    amount: 0.5,
    price: 30000,
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'offer2',
    user: 'Bob',
    cryptocurrency: 'ETH',
    amount: 2,
    price: 1800,
    paymentMethod: 'PayPal',
  },
];

// Set up a mock server
const server = setupServer(
  rest.get('/api/p2p', (req, res, ctx) => {
    return res(ctx.json({ offers: mockOffers }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('P2P Component', () => {
  it('renders loading state initially', async () => {
    await act(async () => {
        render(<Home />);
    });
    const loadingIndicator = screen.getByText(/Loading/i);
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('fetches and renders P2P offers', async () => {
    await act(async () => {
        render(<Home />);
    });

    // Wait for the offers to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Bob/i)).toBeInTheDocument();
    });

    // Check if the offer details are rendered correctly
    expect(screen.getByText(/0.5 BTC @ \$30000/i)).toBeInTheDocument();
    expect(screen.getByText(/2 ETH @ \$1800/i)).toBeInTheDocument();
  });

  it('displays error message on API error', async () => {
    // Mock an error response from the API
    server.use(
      rest.get('/api/p2p', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    await act(async () => {
        render(<Home />);
    });

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Error: Server error/i)).toBeInTheDocument();
    });
  });
});
