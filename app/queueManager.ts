interface Transaction {
  id: string;
  type: 'rango-swap' | 'regular';
  rangoRequestId?: string;
  swapState?: 'pending' | 'confirmed';
  priority: number;
}

class QueueManager {
  private queue: Transaction[];
  private rangoStatusMap = new Map<string, 'pending' | 'confirmed'>();
  private lastReconciliation = Date.now();
  
  constructor() {
    this.queue = [];
  }

  private async reconcileRangoStates() {
    if (Date.now() - this.lastReconciliation > 300000) { // 5 minutes
      try {
        const pendingTransactions = this.queue.filter(tx => 
          tx.type === 'rango-swap' && tx.swapState === 'pending'
        );
        
        for (const tx of pendingTransactions) {
          const status = await rangoService.checkTransactionStatus(tx.rangoRequestId!);
          if (status === 'COMPLETED') {
            this.rangoStatusMap.set(tx.id, 'confirmed');
            this.queue = this.queue.filter(item => item.id !== tx.id);
          }
        }
        
        this.lastReconciliation = Date.now();
      } catch (error) {
        console.error('Rango state reconciliation failed:', error);
      }
    }
  }

  getRangoTransactionState(txId: string) {
    return this.rangoStatusMap.get(txId) || 'unknown';
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
    this.reconcileRangoStates();
    
    while (this.queue.length > 0) {
      const nextTx = this.queue.shift();
      if (nextTx.type === 'rango-swap') {
        this.processRangoTransaction(nextTx);
        this.rangoStatusMap.set(nextTx.id, 'pending');
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
