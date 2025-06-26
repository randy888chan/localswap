import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZetaChainService } from './ZetaChainService';
import { Chain } from '@xchainjs/xchain-util';
import { Signer, BigNumber } from 'ethers'; // Using ethers v5 as per service
import { ZetaChainClient } from '@zetachain/toolkit/client';
import { ForeignCoin, GetQuoteResponse, ContractTransaction, GetFeesResponse } from '@zetachain/toolkit/types'; // Assuming these types

// Mock @zetachain/toolkit/client
vi.mock('@zetachain/toolkit/client', () => {
  const mockForeignCoins: ForeignCoin[] = [
    {
      foreign_chain_id: 5, // Goerli ETH
      zrc20_contract_address: '0xZRC20_gETH_ADDR',
      symbol: 'gETH',
      name: 'Goerli Ether',
      decimals: 18,
      coin_type: 0, // Assuming 0 for Gas token, need actual values
      // Add other fields if your actual ForeignCoin type has them
    },
    {
      foreign_chain_id: 18332, // Bitcoin Testnet
      zrc20_contract_address: '0xZRC20_tBTC_ADDR',
      symbol: 'tBTC',
      name: 'Testnet Bitcoin',
      decimals: 8,
      coin_type: 1, // Assuming 1 for ERC20 type, need actual values
    },
  ];

  const mockQuoteResponse: GetQuoteResponse = {
    amountOut: BigNumber.from('1000000000000000000'), // 1 token with 18 decimals
    // ... other fields like feeData, etc.
  } as GetQuoteResponse; // Cast as it might be more complex

  const mockTx = { hash: 'mockTxHash' } as ContractTransaction;
  const mockCctxResponse = { status: 'Mined' /* or other statuses */ };
  const mockFeesResponse = {} as GetFeesResponse;


  return {
    ZetaChainClient: vi.fn().mockImplementation(() => ({
      getForeignCoins: vi.fn().mockResolvedValue(mockForeignCoins),
      evmDeposit: vi.fn().mockResolvedValue(mockTx),
      getQuote: vi.fn().mockResolvedValue(mockQuoteResponse),
      zetachainWithdraw: vi.fn().mockResolvedValue({ tx: mockTx }),
      trackCCTX: vi.fn().mockResolvedValue(mockCctxResponse),
      getFees: vi.fn().mockResolvedValue(mockFeesResponse),
      // Mock other methods as needed for more tests
    })),
  };
});

const mockEthersSigner = {
  getAddress: vi.fn().mockResolvedValue('0xMockSignerAddress'),
  provider: {} // Needs a mock provider if methods on it are called during init
} as unknown as Signer;


describe('ZetaChainService', () => {
  let service: ZetaChainService;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Re-initialize mocks for ZetaChainClient for a clean state
    const ZCC = (ZetaChainClient as any);
    ZCC.mockImplementation(() => ({
        getForeignCoins: vi.fn().mockResolvedValue([
            { foreign_chain_id: 5, zrc20_contract_address: '0xZRC20_gETH_ADDR', symbol: 'gETH', name: 'Goerli Ether', decimals: 18, coin_type:0 },
            { foreign_chain_id: 18332, zrc20_contract_address: '0xZRC20_tBTC_ADDR', symbol: 'tBTC', name: 'Testnet Bitcoin', decimals: 8, coin_type:1 },
        ]),
        evmDeposit: vi.fn().mockResolvedValue({ hash: 'mockDepositTxHash' }),
        getQuote: vi.fn().mockResolvedValue({ amountOut: BigNumber.from('1000000000000000000') } as GetQuoteResponse),
        zetachainWithdraw: vi.fn().mockResolvedValue({ tx: { hash: 'mockWithdrawTxHash' } }),
        trackCCTX: vi.fn().mockResolvedValue({ status: 'Mined' }),
        getFees: vi.fn().mockResolvedValue({} as GetFeesResponse),
    }));
    service = new ZetaChainService();
    // Initialize client for most tests, can be skipped for constructor test
    await service.initializeClient(mockEthersSigner);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize client successfully with a signer', async () => {
    const newService = new ZetaChainService();
    const success = await newService.initializeClient(mockEthersSigner);
    expect(success).toBe(true);
    expect(newService.isInitialized()).toBe(true);
  });

  describe('mapZetaChainIdToXChain (private access for test)', () => {
    it('should map known ZetaChain IDs to XChainJS Chains', () => {
      // @ts-ignore - testing private method
      expect(service.mapZetaChainIdToXChain(5)).toBe(Chain.Ethereum); // Goerli -> Ethereum
      // @ts-ignore
      expect(service.mapZetaChainIdToXChain(1)).toBe(Chain.Ethereum); // Mainnet -> Ethereum
      // @ts-ignore
      expect(service.mapZetaChainIdToXChain(56)).toBe(Chain.BinanceSmartChain);
      // @ts-ignore
      expect(service.mapZetaChainIdToXChain(18332)).toBe(Chain.Bitcoin); // BTC Testnet -> Bitcoin
    });

    it('should return undefined for unmapped ZetaChain IDs', () => {
      // @ts-ignore
      expect(service.mapZetaChainIdToXChain(99999)).toBeUndefined();
    });
  });

  describe('listSupportedForeignCoins', () => {
    it('should fetch and transform foreign coins to SimpleAsset format', async () => {
      const assets = await service.listSupportedForeignCoins();
      expect(assets.length).toBe(2);

      const ethAsset = assets.find(a => a.ticker === 'gETH');
      expect(ethAsset).toBeDefined();
      expect(ethAsset?.chain).toBe('ZetaChain'); // As per current mapping
      expect(ethAsset?.contractAddress).toBe('0xZRC20_gETH_ADDR');
      expect(ethAsset?.decimals).toBe(18);
      expect(ethAsset?.source).toBe('zetachain');

      const btcAsset = assets.find(a => a.ticker === 'tBTC');
      expect(btcAsset).toBeDefined();
      expect(btcAsset?.chain).toBe('ZetaChain');
      expect(btcAsset?.contractAddress).toBe('0xZRC20_tBTC_ADDR');
      expect(btcAsset?.decimals).toBe(8);
    });
  });

  describe('depositAssetToZetaChain', () => {
    it('should call client.evmDeposit and return a tx hash', async () => {
      const txHash = await service.depositAssetToZetaChain('0.1', '0xERC20_ADDR', '0xZETA_RECEIVER', 5);
      expect(txHash).toBe('mockDepositTxHash');
      expect(ZetaChainClient().evmDeposit).toHaveBeenCalled();
    });

    it('should throw if service is not initialized', async () => {
      const uninitializedService = new ZetaChainService(); // Don't call initializeClient
      await expect(
        uninitializedService.depositAssetToZetaChain('0.1', '0xERC20_ADDR', '0xZETA_RECEIVER', 5)
      ).rejects.toThrow("ZetaChainService not initialized or signer not available.");
    });
  });

  describe('getZRC20SwapQuote', () => {
    const fromZRC20: AppSimpleAsset = { chain: 'ZetaChain' as Chain, symbol: 'ZETA.gETH', ticker: 'gETH', contractAddress: '0xZRC20_gETH_ADDR', decimals: 18, source: 'zetachain' };
    const toZRC20: AppSimpleAsset = { chain: 'ZetaChain' as Chain, symbol: 'ZETA.tBTC', ticker: 'tBTC', contractAddress: '0xZRC20_tBTC_ADDR', decimals: 8, source: 'zetachain' };

    it('should return a mapped quote', async () => {
      const quote = await service.getZRC20SwapQuote(fromZRC20, toZRC20, '0.1');
      expect(quote).toBeDefined();
      expect(quote?.inputAsset.symbol).toBe(fromZRC20.symbol);
      expect(quote?.outputAsset.symbol).toBe(toZRC20.symbol);
      expect(quote?.outputAmount).toBe('1.0'); // Mocked 1e18 output with 18 decimals for tBTC (adjust mock if tBTC has 8)
                                            // The mock is 1e18, toZRC20 has 8 decimals. 1e18 / 1e8 = 1e10.
                                            // Let's adjust the mock or expected.
                                            // If output is 1e18 tBTC (which has 8 decimals in mock ForeignCoin)
                                            // then human readable is 1e18 / 10^8 = 10,000,000,000
                                            // The mock for getQuote returns BigNumber.from('1000000000000000000') (1e18)
                                            // toZRC20 (tBTC) has 8 decimals. So formatUnits(1e18, 8) = 1e10
      // Re-evaluating the mock:
      // Mock ForeignCoin tBTC has 8 decimals.
      // Mock GetQuoteResponse.amountOut is BigNumber.from('1000000000000000000') (1e18)
      // formatUnits('1000000000000000000', 8) = '10000000000.0'
      expect(quote?.outputAmount).toBe('10000000000.0');
    });
  });

  describe('withdrawZRC20Tokens', () => {
    const zrcToWithdraw: AppSimpleAsset = { chain: 'ZetaChain' as Chain, symbol: 'ZETA.gETH', ticker: 'gETH', contractAddress: '0xZRC20_gETH_ADDR', decimals: 18, source: 'zetachain' };
    it('should call client.zetachainWithdraw and return tx hash', async () => {
        const txHash = await service.withdrawZRC20Tokens(zrcToWithdraw, "0.05", "0xRecipientOnTargetChain", 5);
        expect(txHash).toBe('mockWithdrawTxHash');
        expect(ZetaChainClient().zetachainWithdraw).toHaveBeenCalled();
    });
  });

  describe('trackCCTX', () => {
    it('should call client.trackCCTX and return status', async () => {
        const status = await service.trackCCTX('someTxHash');
        expect(status).toEqual({ status: 'Mined' });
        expect(ZetaChainClient().trackCCTX).toHaveBeenCalledWith({ hash: 'someTxHash', json: true });
    });
  });

  // TODO: Test for executeZRC20Swap once implemented
  // TODO: Test error paths for each method (e.g., client methods throwing errors)

});

// Minimal AppSimpleAsset type for tests if not importing from ThorchainService
interface AppSimpleAsset {
  chain: Chain | string;
  ticker: string;
  symbol: string;
  name?: string;
  contractAddress?: string;
  decimals?: number;
  iconUrl?: string;
  source?: 'thorchain' | 'zetachain' | 'custom';
}
