import { Hono } from 'hono';
// import { QueueManager } from '@rango-exchange/rango-client/queue-manager'; // Rango specific
import { ParticleNetwork } from '@particle-network/aa';
import { P2PService } from './p2pService';
import { BitcoinSigner } from './signer';
import { KVNamespace } from '@cloudflare/workers-types';

// Forward declaration for NetworkMonitor if it's used elsewhere and defined later
// For now, assuming it's either defined elsewhere or its usage here will be adapted/removed.
declare class NetworkMonitor {
  checkRangoStatus(apiName: string): Promise<boolean>;
  // Add other methods if used by this file, e.g., getStatus()
}


interface Env {
  TX_QUEUE: KVNamespace;
  BTC_PRIVATE_KEY: string;
  RANGO_QUEUE: any; // Define more specifically if RangoQueueDO structure is known and kept
  RANGO_API_KEY: string; // For RangoClient, will be removed
  KV_ENCRYPTION_KEY: string; // For crypto operations
}

const app = new Hono<{ Bindings: Env }>();
// const queue = new QueueManager(); // Rango specific

// Initialize Particle AA
const particle = new ParticleNetwork({
  projectId: process.env.PARTICLE_PROJECT_ID,
  clientKey: process.env.PARTICLE_CLIENT_KEY,
  appId: process.env.PARTICLE_APP_ID,
  chainName: 'evm', // Default chain
  chainId: 1 // Ethereum mainnet
});

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

// New imports
// import { RangoQueueDO } from './durable-objects/RangoQueueDO'; // Rango specific Durable Object
// import { RangoClient } from '@rango-exchange/rango-client'; // Rango specific client

app.post('/swap', async (c) => {
  // const { from, to, amount } = await c.req.json();
  // const nm = new NetworkMonitor(); // Assuming NetworkMonitor is defined/imported correctly
  
  // Safety checks
  // if (!await nm.checkRangoStatus('rango_api')) { // Rango specific check
  //   return c.json({ error: "Rango API unavailable" }, 503);
  // }

  // Get Rango instance
  // const rango = new RangoClient(c.env.RANGO_API_KEY); // Rango specific
  
  // Get Durable Object stub
  // const queueId = c.env.RANGO_QUEUE.newUniqueId(); // Rango specific
  // const queue = c.env.RANGO_QUEUE.get(queueId); // Rango specific

  // Process in 3 stages - This entire block is Rango specific
  // return c.stream(async (stream) => {
    // Stage 1: Get quote
    // await stream.write(`{"stage":1}\n`);
    // const quote = await rango.getBestRoute({ from, to, amount });
    
    // Stage 2: Queue processing
    // await stream.write(`{"stage":2}\n`);
    // await queue.fetch("http://queue/process", {
    //   method: "POST",
    //   body: JSON.stringify(quote)
    // });

    // Stage 3: Final confirmation
    // await stream.write(`{"stage":3}\n`);
    // const result = await queue.fetch(`http://queue/status/${quote.requestId}`);
    
  //   await stream.end(result.body);
  // }, {
  //   headers: { "Content-Type": "application/x-ndjson" }
  // })
  // }); // End of original c.stream callback for Rango logic

  // Fallback for the /swap endpoint after Rango removal
  return c.json({ message: "/swap endpoint needs complete refactoring for Thorchain/ZetaChain or removal if frontend handles all DEX logic." }, 501);

  /* // Original Rango logic beyond the streaming part, also to be removed/refactored
  try {
    const { from, to, amount } = await c.req.json();
    // const rango = new RangoClient(c.env.RANGO_API_KEY); // Rango specific

    // 1. Get best route
    // const bestRoute = await rango.getBestRoute({ ... }); // Rango specific

    // 2. Confirm route
    // const confirmedRoute = await rango.confirmRoute({ ... }); // Rango specific

    // Get encryption key from environment (this part might be reusable)
    const encoder = new TextEncoder();
    // const cryptoKey = await crypto.subtle.importKey( // This logic might be reusable
    //   'raw',
    //   encoder.encode(c.env.KV_ENCRYPTION_KEY),
    //   { name: 'AES-GCM' },
    //   false,
    //   ['encrypt', 'decrypt']
    // );

    // const txId = crypto.randomUUID();
    // const queueId = `swap_${txId}`;

    // const txQueue = queue.createQueue({ // queue is Rango specific
    //   concurrency: 2,
    //   retries: 1,
    //   retryDelay: 10000,
    //   rateLimiter: {
    //     maxJobs: 10,
    //     per: 60000
    //   }
    // });

    // Encrypt transaction data before storage
    // const iv = crypto.getRandomValues(new Uint8Array(12)); // This logic might be reusable
    // const encryptedData = await crypto.subtle.encrypt( // This logic might be reusable
    //   { name: 'AES-GCM', iv },
    //   cryptoKey,
    //   encoder.encode(JSON.stringify({ from, to, amount }))
    // );

    // Store in KV with TTL
    // await c.env.TX_QUEUE.put( // This logic might be reusable
    //   queueId,
    //   Buffer.concat([iv, new Uint8Array(encryptedData)]).toString('base64'),
    //   { expirationTtl: 86400 }
    // );

    // Chain-specific transaction processor (this generic structure might be adaptable)
    // const processTransaction = async (
    //   transaction: any,
    //   signer: BitcoinSigner // Should be a generic signer type based on Particle
    // ) => {
    //   switch(transaction.type) {
    //     case 'RAW_BITCOIN':
    //       return signer.signBitcoinTx(transaction.rawtx);
    //     case 'EVM':
    //       return signer.signEVMTx({ // This would use Particle's EVM signer
    //         to: transaction.to,
    //         data: transaction.data,
    //         value: transaction.value
    //       });
    //     case 'SOLANA':
    //       return signer.signSolanaTx( // This would use Particle's Solana signer
    //         transaction.serializedInstruction,
    //         transaction.recentBlockhash
    //       );
    //     default:
    //       throw new SwapError('UNSUPPORTED_CHAIN');
    //   }
    // };

    // Queue event handlers (queue is Rango specific, so these handlers would need a new system)
    // txQueue
    //   .on('active', async (job) => { ... })
    //   .on('completed', async (job, result) => { ... })
    //   .on('failed', async (job, error) => { ... })
    //   .add(async () => {
        // try {
          // 3. Create transaction
          // const transaction = await rango.createTransaction({ ... }); // Rango specific

        // 4. Sign and broadcast (this logic needs to adapt to Thorchain/ZetaChain)
        // const signer = new BitcoinSigner(c.env.BTC_PRIVATE_KEY); // Should use Particle signers
        // const txHash = await signer.executeSwap( ... );

        // 5. Monitor status (this logic needs to adapt to Thorchain/ZetaChain)
        // let status;
        // do {
        //   await new Promise(resolve => setTimeout(resolve, 15000));
        //   status = await rango.checkStatus({ ... }); // Rango specific
        // } while (status?.status === 'RUNNING');

        // if (status?.status !== 'SUCCESS') {
        //   throw new SwapError('TX_FAILED', { txHash, step: 1 });
        // }

        // return { success: true, txHash };
      // } catch (error) {
      //   await c.env.TX_QUEUE.delete(queueId);
      //   await rango.reportFailure({ ... }); // Rango specific
      //   console.error('Swap failed:', error);
    // });

    // return c.json({
    //   status: 'queued',
    //   position: txQueue.length, // txQueue is Rango specific
    //   queueId
    // });
  // } catch (error) {
  //   console.error('Request processing failed:', error);
  //   if (error instanceof SwapError) {
  //     return c.json({
  //       error: error.code,
  //       details: error.details
  //     }, 500);
  //   }
  //   return c.json({
  //     error: 'INTERNAL_ERROR',
  //     details: { message: 'An unexpected error occurred' }
  //   }, 500);
  // }
  */
});

app.post('/p2p-trade', async (c) => {
  try {
    const { offerId, accountKey, amount } = await c.req.json();
    const signer = new BitcoinSigner(c.env.BTC_PRIVATE_KEY);
    
    // 1. Lock trade terms
    const trade = await P2PService.tradeCommitment(offerId, accountKey, amount);
    
    // 2. Build funding transaction
    const psbt = new Psbt({ network: networks.bitcoin });
    psbt.addInput({
      hash: Buffer.from(trade.funding_txid, 'hex'),
      index: 0,
      nonWitnessUtxo: Buffer.from(trade.funding_rawtx, 'hex')
    });
    
    psbt.addOutput({
      address: await signer.generateAddress(),
      value: Math.floor(amount * 1e8)
    });

    // 3. Store in KV with encrypted secrets
    await c.env.TX_QUEUE.put(
      `p2p:${trade.id}`,
      JSON.stringify({
        psbt: psbt.toHex(),
        secret: trade.secret,
        timeout: trade.timeout,
        status: 'funding_required'
      }),
      { expirationTtl: 3600 }
    );

    return c.json({
      status: 'pending_funding',
      tradeId: trade.id,
      bitcoinAddress: trade.deposit_address,
      requiredAmount: amount
    });
  } catch (error) {
    console.error('P2P trade failed:', error);
    return c.json({ 
      error: 'TRADE_FAILURE',
      details: error.response?.data || {}
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
