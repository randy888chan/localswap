export interface SwapRoute {
  type: 'DEX' | 'BRIDGE';
  from: {
    blockchain: string;
    symbol: string;
    address: string | null;
  };
  to: {
    blockchain: string;
    symbol: string;
    address: string;
  };
  amount: string;
  dex?: string;
  bridge?: string;
  path: string[];
}

export interface SwapQuoteResult {
  outputAmount: string;
  fee: string;
  route: SwapRoute[];
}

export interface SwapQuote {
  requestId: string;
  requestAmount: string;
  from: {
    blockchain: string;
    symbol: string;
    address: string | null;
  };
  to: {
    blockchain: string;
    symbol: string;
    address: string;
  };
  result: SwapQuoteResult;
  validationStatus: any; // Define a more specific type later if needed
  diagnosisMessages: string[];
  missingBlockchains: string[];
  blockchains: string[];
  processingLimitReached: boolean;
  walletNotSupportingFromBlockchain: boolean;
  error: any; // Define a more specific type later if needed
  errorCode: any; // Define a more specific type later if needed
  traceId: any; // Define a more specific type later if needed
}
