import { Transaction } from '../types/transactions';

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  // Mock data for now. In the future, this will be fetched from a database.
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: userId,
      type: 'buy',
      amount: '0.5',
      currencyFrom: 'USD',
      currencyTo: 'BTC',
      status: 'completed',
      timestamp: '2023-06-15T10:00:00Z',
    },
    {
      id: '2',
      userId: userId,
      type: 'sell',
      amount: '2',
      currencyFrom: 'ETH',
      currencyTo: 'USD',
      status: 'completed',
      timestamp: '2023-06-14T15:30:00Z',
    },
    {
      id: '3',
      userId: userId,
      type: 'swap',
      amount: '1',
      currencyFrom: 'BTC',
      currencyTo: 'ETH',
      status: 'pending',
      timestamp: '2023-06-16T09:45:00Z',
    },
  ];

  return mockTransactions;
}
