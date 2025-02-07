import { QueueManager } from '@rango-dao/queue-manager';
import { RangoConfig } from '../config/rango';

export class QueueService {
  private instance: QueueManager;
  private config: typeof RangoConfig['queueManager'];

  constructor() {
    this.config = RangoConfig.queueManager;
    this.init();
  }

  private init(): void {
    const config = {
      verbose: true,
      ...this.config,
    };
    
    if (!this.instance) {
      this.instance = new QueueManager(config);
      this.setupEventListeners();
    }
  }

  public execute<T>(input: T): Promise<boolean> {
    try {
      return this.instance.execute({
        payload: input,
        retryOptions: {
          retries: this.config.maxRetries,
          delay: this.config.retryDelay,
        },
      });
    } catch (error) {
      console.error('Queue execution failed:', error);
      return Promise.resolve(false);
    }
  }

  private setupEventListeners(): void {
    this.instance.on('enqueue', () => {
      console.log('New transaction enqueued');
    });

    this.instance.on('complete', () => {
      console.log('Transaction completed successfully');
    });
  }
}
