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
    const rango = new RangoClient(c.env.RANGO_API_KEY);

    // 1. Get best route
    const bestRoute = await rango.getBestRoute({
      from: {
        blockchain: from.network.toUpperCase(),
        symbol: from.token.symbol,
        address: from.token.address || null
      },
      to: {
        blockchain: to.network.toUpperCase(),
        symbol: to.token.symbol,
        address: to.token.address || null
      },
      amount: amount.toString(),
      checkPrerequisites: false,
      selectedWallets: {
        [from.network.toUpperCase()]: from.address,
        [to.network.toUpperCase()]: to.address
      }
    });

    // 2. Confirm route
    const confirmedRoute = await rango.confirmRoute({
      requestId: bestRoute.requestId,
      selectedWallets: {
        [from.network.toUpperCase()]: from.address,
        [to.network.toUpperCase()]: to.address
      },
      destination: to.address
    });

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
        // 3. Create transaction
        const transaction = await rango.createTransaction({
          requestId: confirmedRoute.requestId,
          step: 1,
          userSettings: {
            slippage: '3.0',
            infiniteApprove: false
          },
          validations: {
            balance: true,
            fee: true,
            approve: true
          }
        });

        // 4. Sign and broadcast
        const signer = new BitcoinSigner(c.env.BTC_PRIVATE_KEY);
        const txHash = await signer.executeSwap(
          transaction.type === 'EVM' 
            ? transaction.rawTransaction
            : transaction.serializedMessage
        );

        // 5. Monitor status
        let status;
        do {
          await new Promise(resolve => setTimeout(resolve, 15000));
          status = await rango.checkStatus({
            requestId: confirmedRoute.requestId,
            step: 1,
            txId: txHash
          });
        } while (status?.status === 'RUNNING');

        if (status?.status !== 'SUCCESS') {
          throw new SwapError('TX_FAILED', { txHash, step: 1 });
        }

        return { success: true, txHash };
      } catch (error) {
        await c.env.TX_QUEUE.delete(queueId);
        await rango.reportFailure({
          requestId: confirmedRoute.requestId,
          eventType: 'TX_EXECUTION_FAILED',
          reason: error instanceof Error ? error.message : 'Unknown error'
        });
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
