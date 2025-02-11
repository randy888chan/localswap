import { QueueManager } from '@rango-exchange/queue-manager';
import { QueueManagerConfig } from '../config/rango';

export class QueueService {
  private static instance: QueueManager;

  public static init(config: QueueManagerConfig): QueueManager {
    if (!this.instance) {
      this.instance = new QueueManager({
        retries: config.maxRetries,
        retryDelay: config.retryDelay,
        concurrency: config.concurrency,
        autostart: config.enabled
      });
    }
    return this.instance;
  }

  public static getQueue(): QueueManager {
    if (!this.instance) throw new Error('QueueManager not initialized');
    return this.instance;
  }

  public static monitorHealth() {
    this.instance.on('error', (err) => {
      fetch('https://api.monitoring.service/alert', {
        method: 'POST',
        body: JSON.stringify({
          project: 'crypto-exchange',
          error: err.stack,
          severity: 'CRITICAL'
        })
      });
    });
  }

  public static createPriorityChannel(priority: 'high' | 'medium' | 'low') {
    return new QueueManager({
      retries: RangoConfig.queueRetries[priority],
      retryDelay: RangoConfig.queueRetryDelays[priority],
      concurrency: RangoConfig.queueConcurrency[priority],
      autostart: true
    }, priority === 'high' ? 3 : priority === 'medium' ? 2 : 1);
  }

  public static handleContention() {
    // Blockchain node priority mapping
    const chainPriority: Record<string, number> = {
      'bitcoin': 3, 
      'ethereum': 2,
      'tron': 1
    };

    this.instance.process((tx, ctx) => {
      if(tx.chainId in chainPriority) {
        ctx.setPriority(chainPriority[tx.chainId]);
      }
      return processTx(tx); // Existing transaction handler
    });
  }
}
