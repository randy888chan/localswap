export interface Transaction {
  id: string;
  userId: string;
  type: 'buy' | 'sell' | 'swap';
  amount: string;
  currencyFrom: string;
  currencyTo: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}
