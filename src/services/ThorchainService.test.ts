import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThorchainService, SimpleAsset } from './ThorchainService';
import { Network } from '@xchainjs/xchain-client';
import { Chain, assetFromString, baseAmount } from '@xchainjs/xchain-util';
import { ThorchainQuery, QuoteSwap, LiquidityPool } from '@xchainjs/xchain-thorchain-query';
import { ThorchainAMM } from '@xchainjs/xchain-thorchain-amm';
import { Client as EthClient } from '@xchainjs/xchain-ethereum';
import { Signer, providers } from 'ethers';

// Mock XChainJS and other dependencies
vi.mock('@xchainjs/xchain-thorchain-query', () => {
  const mockQuoteSwap: QuoteSwap = {
    memo: 'mockMemo',
    notes: 'mockNotes',
    dustThreshold: baseAmount(10000, 8),
    expectedAmountOut: baseAmount(100000000, 8), // e.g., 1 BTC
    outboundDelayBlocks: 10,
    outboundDelaySeconds: 60,
    inboundAddress: 'mockInboundAddress',
    router: 'mockRouterAddress',
    expiry: new Date().getTime() + 3600000,
    warning: '',
    error: undefined, // No error for success case
    fees: {
      asset: assetFromString('THOR.RUNE')!,
      affiliateFee: baseAmount(0),
      outboundFee: baseAmount(1000, 8),
      liquidityFee: baseAmount(500, 8),
      total: baseAmount(1500, 8),
      slippageBps: baseAmount(0), // Not used directly here, quoteSwap has it
      totalBps: baseAmount(0), // Not used directly here
    },
    slippageBps: baseAmount(300), // 3%
    inboundConfirmationSeconds: 600,
    swaps: [],
    expectedAmountOutStreaming: baseAmount(0),
    streamingSwapBlocks: 0,
    totalSwapSecondsStreaming: 0,
    meta: {
      isStreaming: false,
      quantity: 0,
      interval: 0
    }
  };

  return {
    ThorchainQuery: vi.fn().mockImplementation(() => ({
      quoteSwap: vi.fn().mockResolvedValue(mockQuoteSwap),
      getPools: vi.fn().mockResolvedValue([
        { asset: 'ETH.ETH', status: 'available', price: '3000' } as LiquidityPool,
        { asset: 'BTC.BTC', status: 'available', price: '40000' } as LiquidityPool,
        { asset: 'BNB.BNB', status: 'available', price: '400' } as LiquidityPool,
        // Mock an ERC20 token recognized by THORChain
        { asset: 'ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7', status: 'available', price: '1'} as LiquidityPool,
      ]),
      thorchainCache: { // Mock this structure if getTransactionStatusAndDetails uses it
        midgardQuery: {
          getMidgard: vi.fn().mockReturnValue({
            getActions: vi.fn().mockResolvedValue({ actions: [] }), // Default empty actions
          }),
        },
      },
    })),
  };
});

vi.mock('@xchainjs/xchain-thorchain-amm', () => ({
  ThorchainAMM: vi.fn().mockImplementation(() => ({
    addChainClient: vi.fn(),
    doSwap: vi.fn().mockResolvedValue('mockTxHash'),
  })),
}));

vi.mock('@xchainjs/xchain-ethereum', () => ({
  Client: vi.fn().mockImplementation(() => ({
    isApproved: vi.fn().mockResolvedValue(true),
    approve: vi.fn().mockResolvedValue('mockApproveTxHash'),
    purgeClient: vi.fn(),
  })),
}));


describe('ThorchainService', () => {
  let service: ThorchainService;
  const mockSigner = {} as Signer; // Minimal mock
  const mockProvider = {} as providers.JsonRpcProvider; // Minimal mock

  beforeEach(() => {
    service = new ThorchainService(Network.Testnet); // Use Testnet for tests
    // Clear mocks before each test if necessary, or reset specific mock states
    vi.clearAllMocks();
    // Re-initialize mocks for ThorchainQuery and ThorchainAMM for a clean state if they store internal state
     const TQ = (ThorchainQuery as any);
     TQ.mockImplementation(() => ({
      quoteSwap: vi.fn().mockResolvedValue({
        memo: 'mockMemo',
        notes: 'mockNotes',
        dustThreshold: baseAmount(10000, 8),
        expectedAmountOut: baseAmount(100000000, 8), // 1 BTC
        outboundDelayBlocks: 10,
        outboundDelaySeconds: 60,
        inboundAddress: 'mockInboundAddress',
        router: 'mockRouterAddress',
        expiry: new Date().getTime() + 3600000,
        warning: '',
        error: undefined,
        fees: {
          asset: assetFromString('THOR.RUNE')!,
          affiliateFee: baseAmount(0),
          outboundFee: baseAmount(1000, 8),
          liquidityFee: baseAmount(500, 8),
          total: baseAmount(1500, 8),
          slippageBps: baseAmount(0),
          totalBps: baseAmount(0),
        },
        slippageBps: baseAmount(300),
        inboundConfirmationSeconds: 600,
        swaps: [],
        expectedAmountOutStreaming: baseAmount(0),
        streamingSwapBlocks: 0,
        totalSwapSecondsStreaming: 0,
        meta: { isStreaming: false, quantity: 0, interval: 0 }
      }),
      getPools: vi.fn().mockResolvedValue([
        { asset: 'ETH.ETH', status: 'available', price: '3000' } as LiquidityPool,
        { asset: 'BTC.BTC', status: 'available', price: '40000' } as LiquidityPool,
        { asset: 'BNB.BNB', status: 'available', price: '400' } as LiquidityPool,
        { asset: 'ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7', status: 'available', price: '1'} as LiquidityPool,
      ]),
      thorchainCache: {
        midgardQuery: {
          getMidgard: vi.fn().mockReturnValue({
            getActions: vi.fn().mockResolvedValue({ actions: [] }),
          }),
        },
      },
    }));
    const TAMM = (ThorchainAMM as any);
    TAMM.mockImplementation(() => ({
        addChainClient: vi.fn(),
        doSwap: vi.fn().mockResolvedValue('mockTxHash'),
    }));

    service = new ThorchainService(Network.Testnet); // Re-create service with fresh mocks
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAssetDecimals', () => {
    it('should return correct decimals for known assets', () => {
      // Access private method for testing (common in JS/TS testing, or test via public methods)
      // @ts-ignore
      expect(service.getAssetDecimals(assetFromString('BTC.BTC')!)).toBe(8);
      // @ts-ignore
      expect(service.getAssetDecimals(assetFromString('ETH.ETH')!)).toBe(18);
       // @ts-ignore
      expect(service.getAssetDecimals(assetFromString('THOR.RUNE')!)).toBe(8); // Native RUNE
    });

    it('should prioritize SimpleAsset.decimals if provided', () => {
        const simpleEth: SimpleAsset = { chain: Chain.Ethereum, symbol: 'ETH.ETH', ticker: 'ETH', decimals: 18 };
         // @ts-ignore
        expect(service.getAssetDecimals(assetFromString('ETH.ETH')!, simpleEth)).toBe(18);

        const simpleUsdt: SimpleAsset = { chain: Chain.Ethereum, symbol: 'ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7', ticker: 'USDT', decimals: 6, contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' };
        // @ts-ignore
        expect(service.getAssetDecimals(assetFromString(simpleUsdt.symbol)!, simpleUsdt)).toBe(6);
    });
  });

  describe('getAvailableAssets', () => {
    it('should fetch and transform assets from pools', async () => {
      const assets = await service.getAvailableAssets();
      expect(assets.length).toBeGreaterThan(0);
      expect(assets.some(a => a.symbol === 'ETH.ETH')).toBe(true);
      expect(assets.some(a => a.symbol === 'BTC.BTC')).toBe(true);
      expect(assets.some(a => a.symbol === 'THOR.RUNE')).toBe(true);

      const usdtAsset = assets.find(a => a.ticker === 'USDT');
      expect(usdtAsset).toBeDefined();
      expect(usdtAsset?.contractAddress).toBe('0xdAC17F958D2ee523a2206206994597C13D831ec7');
      expect(usdtAsset?.source).toBe('thorchain');
    });
  });

  describe('getSwapQuote', () => {
    const fromAsset: SimpleAsset = { chain: Chain.Ethereum, symbol: 'ETH.ETH', ticker: 'ETH', decimals: 18 };
    const toAsset: SimpleAsset = { chain: Chain.Bitcoin, symbol: 'BTC.BTC', ticker: 'BTC', decimals: 8 };

    it('should return a valid quote for given assets and amount', async () => {
      const quote = await service.getSwapQuote(fromAsset, toAsset, '1', 'mockDestAddress');
      expect(quote).toBeDefined();
      expect(quote).not.toBeNull();
      if (!quote) return; // Type guard

      expect(quote.inputAsset.symbol).toBe(fromAsset.symbol);
      expect(quote.outputAsset.symbol).toBe(toAsset.symbol);
      expect(quote.memo).toBe('mockMemo');
      expect(quote.inboundAddress).toBe('mockInboundAddress');
      // Expected output is 1 BTC (100,000,000 satoshis), formatted with 8 decimals
      expect(quote.outputAmount).toBe('1.00000000'); // Format may vary slightly based on trimZeros, check actual output
    });

    it('should return null if ThorchainQuery fails', async () => {
      const TQ = (ThorchainQuery as any);
      TQ.mockImplementationOnce(() => ({ // Use mockImplementationOnce for specific test case
        quoteSwap: vi.fn().mockResolvedValue({ error: 'Failed to fetch quote' }),
         getPools: vi.fn().mockResolvedValue([]), // Keep other mocks if needed by constructor
         thorchainCache: { midgardQuery: { getMidgard: vi.fn().mockReturnValue({ getActions: vi.fn() }) } },
      }));
       service = new ThorchainService(Network.Testnet); // Re-init with new mock for this test

      const quote = await service.getSwapQuote(fromAsset, toAsset, '1');
      expect(quote).toBeNull();
    });
  });

  describe('setEvmSigner and client management', () => {
    it('should set and retrieve an EthClient for Ethereum chain', async () => {
      await service.setEvmSigner(mockSigner, mockProvider, Chain.Ethereum);
      const client = service.getClientForChain(Chain.Ethereum);
      expect(client).toBeDefined();
      expect(client instanceof EthClient).toBe(true); // Check instance type if possible, or just that it's defined
    });

    it('should clear EVM signer and client', async () => {
      await service.setEvmSigner(mockSigner, mockProvider, Chain.Ethereum);
      expect(service.getClientForChain(Chain.Ethereum)).toBeDefined();

      await service.setEvmSigner(null, undefined, Chain.Ethereum);
      expect(service.getClientForChain(Chain.Ethereum)).toBeUndefined();
    });
  });

  // TODO: Add tests for checkAndRequestApproval (needs EthClient mock methods like isApproved, approve)
  // TODO: Add tests for executeSwap (more complex, needs client mocks for doSwap, potentially approval flows)
  // TODO: Add tests for getTransactionStatusAndDetails (mocking Midgard responses)

});

// Helper to ensure consistent mockQuoteSwap object for tests needing it
const getMockQuoteSwap = (): QuoteSwap => ({
    memo: 'mockMemo',
    notes: 'mockNotes',
    dustThreshold: baseAmount(10000, 8),
    expectedAmountOut: baseAmount(100000000, 8),
    outboundDelayBlocks: 10,
    outboundDelaySeconds: 60,
    inboundAddress: 'mockInboundAddress',
    router: 'mockRouterAddress',
    expiry: new Date().getTime() + 3600000,
    warning: '',
    error: undefined,
    fees: {
      asset: assetFromString('THOR.RUNE')!,
      affiliateFee: baseAmount(0),
      outboundFee: baseAmount(1000, 8),
      liquidityFee: baseAmount(500, 8),
      total: baseAmount(1500, 8),
      slippageBps: baseAmount(0),
      totalBps: baseAmount(0),
    },
    slippageBps: baseAmount(300),
    inboundConfirmationSeconds: 600,
    swaps: [],
    expectedAmountOutStreaming: baseAmount(0),
    streamingSwapBlocks: 0,
    totalSwapSecondsStreaming: 0,
    meta: { isStreaming: false, quantity: 0, interval: 0 }
});
