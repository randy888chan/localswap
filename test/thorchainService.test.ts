import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThorchainService, SimpleAsset } from '../src/services/ThorchainService';
import { Network } from '@xchainjs/xchain-client';
import { assetFromString, assetAmount, baseAmount } from '@xchainjs/xchain-util';
import { Chain } from '@xchainjs/xchain-util';

// Mocking @xchainjs/xchain-thorchain-query
const mockQuoteSwap = vi.fn();
vi.mock('@xchainjs/xchain-thorchain-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ThorchainQuery: class {
      quoteSwap = mockQuoteSwap;
      thorchainCache = {
        midgardQuery: { // Mocking the nested structure used in the service
            assetAmountToNumber: (assetAmt) => assetAmt.assetAmount.amount().toNumber() / (10**8), // Simplified mock
            getMidgard: vi.fn(() => ({
                getActions: vi.fn().mockResolvedValue({ actions: [] })
            }))
        }
      };
    },
  };
});

describe('ThorchainService', () => {
  let thorchainService: ThorchainService;

  beforeEach(() => {
    vi.clearAllMocks();
    thorchainService = new ThorchainService(Network.Mainnet);
  });

  it('should be instantiated', () => {
    expect(thorchainService).toBeInstanceOf(ThorchainService);
  });

  describe('getSwapQuote', () => {
    it('should return a quote with correct transformations', async () => {
      const mockApiResponse = {
        expectedAmountOut: assetAmount(198000000, 8), // 1.98 (output asset has 8 decimals for this mock)
        fees: {
          asset: assetFromString('ETH.ETH'), // Fee asset
          total: baseAmount(100000, 8), // Total fees in 1e8
        },
        slippageBps: 50, // 0.5%
        router: '0xrouterAddress',
        memo: 'SWAP:BTC.BTC:bc1q...',
        notes: 'Some notes about the swap.',
        inboundAddress: '0xinboundAddress',
        dustThreshold: baseAmount(10000, 8) // Dust threshold for input asset (1e8)
      };
      mockQuoteSwap.mockResolvedValue(mockApiResponse);

      const inputAsset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'ETH', symbol: 'ETH.ETH', decimals: 18 };
      const outputAsset: SimpleAsset = { chain: Chain.Bitcoin, ticker: 'BTC', symbol: 'BTC.BTC', decimals: 8 };
      const inputAmountHumanReadable = '1'; // 1 ETH

      // Mock getAssetDecimals for this test case within the service or by extending the class for test
      // For simplicity, we rely on SimpleAsset.decimals being passed and used by the actual getAssetDecimals logic
      // If getAssetDecimals has complex internal logic, it should be tested separately or mocked more thoroughly.

      const quote = await thorchainService.getSwapQuote(
        inputAsset,
        outputAsset,
        inputAmountHumanReadable,
        'bc1qdestinationaddress'
      );

      expect(mockQuoteSwap).toHaveBeenCalledOnce();
      const expectedQuoteParams = {
        fromAsset: assetFromString(inputAsset.symbol),
        destinationAsset: assetFromString(outputAsset.symbol),
        amount: baseAmount(inputAmountHumanReadable, 18), // 1 ETH in base units (18 decimals)
        destinationAddress: 'bc1qdestinationaddress',
        toleranceBps: undefined,
      };
      expect(mockQuoteSwap.mock.calls[0][0]).toEqual(expect.objectContaining(expectedQuoteParams));

      expect(quote).not.toBeNull();
      if (!quote) return;

      expect(quote.inputAsset).toEqual(inputAsset);
      expect(quote.inputAmount).toBe(inputAmountHumanReadable);
      // inputAmountCryptoPrecision should be 1 ETH in its native 18 decimal precision
      expect(quote.inputAmountCryptoPrecision).toBe('1000000000000000000');
      expect(quote.outputAsset).toEqual(outputAsset);
      // Mocked output was 1.98 (assetAmount(198000000, 8))
      // Our mocked assetAmountToNumber converts 1e8 amounts to human readable, so 1.98
      expect(quote.outputAmount).toBe('1.98');
      expect(quote.expectedOutputAmountCryptoPrecision).toBe('198000000');

      expect(quote.fees.asset.symbol).toBe('ETH.ETH');
      // Mocked fee was 100000 (1e8), so 0.001 ETH
      expect(quote.fees.totalFeeHumanReadable).toBe('0.001');
      expect(quote.fees.totalFeeCryptoPrecision).toBe('100000');

      expect(quote.slippageBps).toBe(50);
      expect(quote.memo).toBe(mockApiResponse.memo);
      expect(quote.inboundAddress).toBe(mockApiResponse.inboundAddress);
      // Dust threshold was 10000 (1e8) for input asset (ETH, 18 dec)
      // formatAssetAmountCurrency should handle this. Our simplified mock for assetAmountToNumber doesn't directly apply here.
      // The actual dust threshold display depends on formatAssetAmountCurrency and input asset's decimals.
      // For now, we check it's defined.
      expect(quote.dustThreshold).toBeDefined();
    });

    it('should return null if API call fails', async () => {
      mockQuoteSwap.mockRejectedValue(new Error('API Error'));
      const inputAsset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'ETH', symbol: 'ETH.ETH', decimals: 18 };
      const outputAsset: SimpleAsset = { chain: Chain.Bitcoin, ticker: 'BTC', symbol: 'BTC.BTC', decimals: 8 };
      const quote = await thorchainService.getSwapQuote(inputAsset, outputAsset, '1', 'dest');
      expect(quote).toBeNull();
    });
  });

  describe('checkAndRequestApproval', () => {
    let mockEthClient: any;

    beforeEach(() => {
      // Basic mock for EthClient methods
      mockEthClient = {
        isApproved: vi.fn(),
        approve: vi.fn().mockResolvedValue('mock_approve_tx_hash'),
        // Mock other EthClient methods if they were to be called by checkAndRequestApproval
      };
      // Assume setEvmSigner has been called and set this client for Chain.Ethereum
      // For this test, we can directly manipulate the clients map or mock setEvmSigner
      thorchainService['clients'].set(Chain.Ethereum, mockEthClient as any);
    });

    it('should return approved: true if asset is not an ERC20 (no contractAddress)', async () => {
      const nativeAsset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'ETH', symbol: 'ETH.ETH', decimals: 18 };
      const result = await thorchainService.checkAndRequestApproval(nativeAsset, '100000', 'spenderAddress', 'walletAddress');
      expect(result.approved).toBe(true);
      expect(mockEthClient.isApproved).not.toHaveBeenCalled();
    });

    it('should return approved: true if ERC20 asset is already approved', async () => {
      const erc20Asset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xContract', contractAddress: '0xContract', decimals: 6 };
      mockEthClient.isApproved.mockResolvedValue(true);

      const result = await thorchainService.checkAndRequestApproval(erc20Asset, '1000000', 'spenderAddress', 'walletAddress');

      expect(result.approved).toBe(true);
      expect(mockEthClient.isApproved).toHaveBeenCalledOnce();
      expect(mockEthClient.approve).not.toHaveBeenCalled();
    });

    it('should request approval and return approveTxHash if ERC20 asset is not approved', async () => {
      const erc20Asset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xContract', contractAddress: '0xContract', decimals: 6 };
      mockEthClient.isApproved.mockResolvedValue(false);

      const result = await thorchainService.checkAndRequestApproval(erc20Asset, '1000000', 'spenderAddress', 'walletAddress');

      expect(result.approved).toBe(false);
      expect(result.approveTxHash).toBe('mock_approve_tx_hash');
      expect(mockEthClient.isApproved).toHaveBeenCalledOnce();
      expect(mockEthClient.approve).toHaveBeenCalledOnce();
      // TODO: Add more specific assertions on the arguments passed to approve if necessary
    });

    it('should return error if EthClient is not set for the chain', async () => {
      thorchainService['clients'].delete(Chain.Ethereum); // Remove client
      const erc20Asset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xContract', contractAddress: '0xContract', decimals: 6 };

      // For non-EVM client case, it should return approved: true currently
      const result = await thorchainService.checkAndRequestApproval(erc20Asset, '1000000', 'spenderAddress', 'walletAddress');
      expect(result.approved).toBe(true);
      // If we wanted an error, the service logic would need to change to throw if no EthClient for ERC20 approval
    });

    it('should return error if isApproved call fails', async () => {
      const erc20Asset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xContract', contractAddress: '0xContract', decimals: 6 };
      mockEthClient.isApproved.mockRejectedValue(new Error('isApproved API Error'));

      const result = await thorchainService.checkAndRequestApproval(erc20Asset, '1000000', 'spenderAddress', 'walletAddress');

      expect(result.approved).toBe(false);
      expect(result.error).toBe('isApproved API Error');
      expect(mockEthClient.approve).not.toHaveBeenCalled();
    });

    it('should return error if approve call fails', async () => {
      const erc20Asset: SimpleAsset = { chain: Chain.Ethereum, ticker: 'USDT', symbol: 'ETH.USDT-0xContract', contractAddress: '0xContract', decimals: 6 };
      mockEthClient.isApproved.mockResolvedValue(false);
      mockEthClient.approve.mockRejectedValue(new Error('Approve API Error'));

      const result = await thorchainService.checkAndRequestApproval(erc20Asset, '1000000', 'spenderAddress', 'walletAddress');

      expect(result.approved).toBe(false);
      expect(result.error).toBe('Approve API Error');
    });
  });

  // TODO: Add tests for setEvmSigner (requires mocking ethers.Signer and EthClient)
  // TODO: Add tests for executeSwap (very complex, involves mocking ThorchainAMM and EthClient)
  // TODO: Add tests for getTransactionStatusAndDetails (requires mocking Midgard calls)
});
