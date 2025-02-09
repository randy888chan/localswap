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
    const { from, to, amount, queueId = crypto.randomUUID() } = await c.req.json();
    
    // Load previous state if exists
    const previousState = await loadQueueState(queueId);
    
    const txQueue = queue.createQueue({
      concurrency: 3,
      retries: 2,
      retryDelay: 5000,
      ...(previousState ? { state: previousState } : {})
    });

    const signer = new BitcoinSigner(c.env.BTC_PRIVATE_KEY);
    
    txQueue.add(async () => {
      try {
        const txHash = await signer.executeSwap({ from, to, amount });
        await saveQueueState(queueId, txQueue.getState());
        return { success: true, txHash };
      } catch (error) {
        console.error('Swap failed:', error);
        await saveQueueState(queueId, txQueue.getState());
        
        if (error instanceof Error) {
          throw new SwapError('EXECUTION_FAILED', {
            message: error.message,
            stack: error.stack
          });
        }
        throw new SwapError('UNKNOWN_ERROR');
      }
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

export default app;
