import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../pages/index';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock the API response
const server = setupServer(
    rest.get('/api/hello', (req, res, ctx) => {
        return res(ctx.json({ message: 'Hello from the API!' }));
    }),
    rest.get('/api/p2p', (req, res, ctx) => {
        return res(ctx.json({ offers: [
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
        ] }));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('HomePage', () => {
    it('renders the landing page with P2P offers', async () => {
        render(<HomePage />);

        // Check for the main heading
        expect(screen.getByText(/Unified Crypto Exchange/i)).toBeInTheDocument();

        // Check for the P2P section heading
        expect(screen.getByText(/P2P Trading/i)).toBeInTheDocument();

        // Wait for the offers to load
        await waitFor(() => {
            expect(screen.getByText(/Alice/i)).toBeInTheDocument();
            expect(screen.getByText(/Bob/i)).toBeInTheDocument();
        });

        // Check for the DEX/Aggregator section heading
        expect(screen.getByText(/Cross-Chain DEX & Aggregator/i)).toBeInTheDocument();

        // Check for the User Dashboard section heading
        expect(screen.getByText(/User Dashboard/i)).toBeInTheDocument();
    });
});
