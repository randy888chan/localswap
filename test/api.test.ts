import { describe, it, expect } from 'vitest';
import { getUserTransactions } from '../lib/db';

describe('getUserTransactions', () => {
  it('should return an array of transactions for a given user ID', async () => {
    const userId = 'user123';
    const transactions = await getUserTransactions(userId);

    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0); // Assuming mock data has at least one transaction

    // Add more specific assertions based on the expected structure of the mock transactions
    const transaction = transactions[0];
    expect(transaction).toHaveProperty('id');
    expect(transaction).toHaveProperty('userId');
    expect(transaction.userId).toBe(userId);
    expect(transaction).toHaveProperty('type');
    expect(transaction).toHaveProperty('amount');
    expect(transaction).toHaveProperty('currencyFrom');
    expect(transaction).toHaveProperty('currencyTo');
    expect(transaction).toHaveProperty('status');
    expect(transaction).toHaveProperty('timestamp');
  });
});
````

**Task 1.1.6: Set up a GitHub Action to run tests on every push.**

We need to create a `.github/workflows` directory and a YAML file for the workflow.

.github/workflows/test.yml
````yaml
<<<<<<< SEARCH
