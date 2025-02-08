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
}
