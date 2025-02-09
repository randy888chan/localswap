import { Hono } from 'hono';
import { QueueManager } from '@rango-exchange/rango-client/queue-manager';
import { BitcoinSigner } from './signer';
import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  TX_QUEUE: KVNamespace;
  BTC_PRIVATE_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();
const queue = new QueueManager();

// Persistent queue storage
async function saveQueueState(queueId: string, state: any) {
  await app.env.TX_QUEUE.put(`queue:${queueId}`, JSON.stringify(state));
}

async function loadQueueState(queueId: string) {
  const state = await app.env.TX_QUEUE.get(`queue:${queueId}`);
  return state ? JSON.parse(state) : null;
}

// Enhanced error handler
class SwapError extends Error {
  constructor(
    public readonly code: string,
    public readonly details: Record<string, any> = {}
  ) {
    super(`Swap error: ${code}`);
    this.name = 'SwapError';
  }
}

app.post('/execute-swap', async (c) => {
  try {
    const { from, to, amount } = await c.req.json();
    
    // Get encryption key from environment
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(c.env.KV_ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    const txId = crypto.randomUUID(); 
    const queueId = `swap_${txId}`;

    const txQueue = queue.createQueue({
      concurrency: 2,
      retries: 1,
      retryDelay: 10000,
      rateLimiter: {
        maxJobs: 10,
        per: 60000
      }
    });

    // Encrypt transaction data before storage
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(JSON.stringify({ from, to, amount }))
    );

    // Store in KV with TTL
    await c.env.TX_QUEUE.put(
      queueId,
      Buffer.concat([iv, new Uint8Array(encryptedData)]).toString('base64'),
      { expirationTtl: 86400 }
    );

    txQueue.add(async () => {
      try {
        const item = await c.env.TX_QUEUE.get(queueId);
        if (!item) throw new Error('Transaction not found');
        
        // Decrypt data
        const buffer = Buffer.from(item, 'base64');
        const data = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: buffer.subarray(0, 12) },
          cryptoKey,
          buffer.subarray(12)
        );
        
        const { from, to, amount } = JSON.parse(new TextDecoder().decode(data));
        const signer = new BitcoinSigner(c.env.BTC_PRIVATE_KEY);
        const txHash = await signer.executeSwap({ from, to, amount });
        return { success: true, txHash };
      } catch (error) {
        await c.env.TX_QUEUE.delete(queueId);
        console.error('Swap failed:', error);
    });

    return c.json({ 
      status: 'queued', 
      position: txQueue.length,
      queueId
    });
  } catch (error) {
    console.error('Request processing failed:', error);
    if (error instanceof SwapError) {
      return c.json({ 
        error: error.code,
        details: error.details
      }, 500);
    }
    return c.json({ 
      error: 'INTERNAL_ERROR',
      details: { message: 'An unexpected error occurred' }
    }, 500);
  }
});

// Add health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/swap-status/:id', async (c) => {
  const status = await c.env.TX_QUEUE.get(c.req.param('id'));
  return status 
    ? c.json({ status: 'exists' }) 
    : c.json({ error: 'Not found' }, 404);
});

export default app;
