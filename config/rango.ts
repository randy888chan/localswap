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
  baseURL: 'https://api.rango.exchange',
  timeout: 10000,
  apiKey: process.env.RANGO_API_KEY,
  
  blockchainMappings: {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    ton: 'TON'
  },
  
  feeParameters: {
    baseMultiplier: 1.2,
    maxPriorityFee: '2000000000' // 2 Gwei
  },
  
  wallets: {
    bitcoin: {
      provider: 'your-bitcoin-node-url',
      network: 'mainnet',
      multisig: {
        type: 'p2wsh', // Rango requires specific multisig type
        requiredSignatures: 2,
        publicKeys: [
          'xpub661My...', // Your key
          'xpub68V4Z...'  // Rango key
        ]
      },
      apiOptions: {
        listUnspentMethod: 'scantxoutset' // Rango-preferred method
      }
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
