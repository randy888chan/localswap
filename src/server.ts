import { Hono } from 'hono';
import { QueueManager } from '@rango-exchange/rango-client/queue-manager';
import { BitcoinSigner } from './signer';  // Your existing signer

const app = new Hono();
const queue = new QueueManager();

app.post('/execute-swap', async (c) => {
  const { from, to, amount } = await c.req.json();
  
  const txQueue = queue.createQueue({
    concurrency: 3,
    retries: 2,
    retryDelay: 5000
  });

  const signer = new BitcoinSigner(process.env.BTC_PRIVATE_KEY!);
  
  txQueue.add(async () => {
    try {
      const txHash = await signer.executeSwap({ from, to, amount });
      return { success: true, txHash };
    } catch (error) {
      console.error('Swap failed:', error);
      throw error; // Will trigger retry
    }
  });

  return c.json({ status: 'queued', position: txQueue.length });
});

export default app;
