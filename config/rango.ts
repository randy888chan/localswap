export interface WalletsConfig {
  [key: string]: {
    provider: string;
    network: string;
    multisig: boolean;
  };
}

export interface QueueManagerConfig {
  enabled: boolean;
  concurrency: number;
  maxRetries: number;
  retryDelay: number;
}

export const RangoConfig = {
  wallets: {
    bitcoin: {
      provider: 'your-bitcoin-node-url',
      network: 'mainnet',
      multisig: false,
    },
    eth: {
      provider: 'your-ethereum-node-url',
    },
    ton: {
      provider: 'your-ton-node-url',
    },
  } as WalletsConfig,

  queueManager: {
    enabled: true,
    concurrency: 5,
    maxRetries: 3,
    retryDelay: 1000,
  } as QueueManagerConfig,
};
