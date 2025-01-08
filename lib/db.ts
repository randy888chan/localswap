import { KVNamespace } from '@cloudflare/workers-types';

declare global {
  // eslint-disable-next-line no-var
  var TRANSACTIONS_KV: KVNamespace;
}

export const getUserTransactions = async (userId: string) => {
  const transactions = await global.TRANSACTIONS_KV.get(userId);
  return JSON.parse(transactions);
};
