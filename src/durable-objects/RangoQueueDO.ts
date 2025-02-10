interface RangoSwapRequest {
  requestId: string;
  from: string;
  to: string;
  amount: string;
}

export class RangoQueueDO implements DurableObject {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    
    switch(url.pathname) {
      case "/add":
        return this.addSwap(request);
      case "/process":
        return this.processQueue();
      case "/health":
        return new Response(JSON.stringify({ status: "ok" }));
      default:
        return new Response("Not found", { status: 404 });
    }
  }

  private async addSwap(request: Request) {
    const tx: RangoSwapRequest = await request.json();
    
    // Expire swaps after 1 hour
    await this.state.storage.put(`tx-${tx.requestId}`, tx, {
      expirationTtl: 3600
    });

    return new Response(JSON.stringify({
      status: "queued",
      requestId: tx.requestId
    }));
  }

  private async processQueue() {
    const txs = await this.state.storage.list<string, RangoSwapRequest>({
      prefix: "tx-"
    });

    const processor = new SwapProcessor();
    const results = await processor.executeBatch(Array.from(txs.values()));
    
    // Delete processed transactions
    for (const tx of txs.keys()) {
      await this.state.storage.delete(tx);
    }

    return new Response(JSON.stringify(results));
  }
}
