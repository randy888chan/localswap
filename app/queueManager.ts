interface Transaction {
  id: string;
  type: 'rango-swap' | 'regular';
  rangoRequestId?: string;
  swapState?: 'pending' | 'confirmed';
  priority: number;
}

class QueueManager {
  private queue: Transaction[];
  
  constructor() {
    this.queue = [];
  }

  addTransaction(tx: Transaction, priority: number) {
    // Implement priority-based queueing
    this.queue.push({
      ...tx,
      priority
    });
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  processQueue() {
    while (this.queue.length > 0) {
      const nextTx = this.queue.shift();
      if (nextTx.type === 'rango-swap') {
        this.processRangoTransaction(nextTx);
      } else {
        console.log(`Processing transaction: ${nextTx.id}`);
      }
    }
  }

  private async processRangoTransaction(tx: Transaction) {
    try {
      const result = await rangoService.confirmSwap(tx.rangoRequestId!);
      if (result.status === 'PENDING') {
        this.requeueWithBackoff(tx);
      }
    } catch (error) {
      this.handleRangoError(tx, error);
    }
  }

  private requeueWithBackoff(tx: Transaction) {
    tx.priority += 1; // Increase priority for retry
    this.queue.push(tx);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private handleRangoError(tx: Transaction, error: any) {
    console.error(`Rango transaction failed: ${tx.id}`, error);
    if (tx.priority < RangoConfig.queueManager.maxRetries) {
      this.requeueWithBackoff(tx);
    }
  }

  cancelTransaction(txId: string) {
    // Implement cancellation logic
    this.queue = this.queue.filter(tx => tx.id !== txId);
  }
}
