import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZetaChainService, ZetaQuote } from './ZetaChainService';
import { ZetaChainClient } from '@zetachain/toolkit/client';
import { GetQuoteResponse, ForeignCoin, FeeData, GetFeesResponse } from '@zetachain/toolkit/types';
import { Signer, BigNumber } from 'ethers';
import { Chain, formatUnits, parseUnits } from '@xchainjs/xchain-util';
import { SimpleAsset } from './ThorchainService';

// Mock @zetachain/toolkit/client
const mockZetaChainClientInstance = {
  getForeignCoins: vi.fn(),
  getQuote: vi.fn(),
  approveToken: vi.fn(),
  send: vi.fn(),
  evmDeposit: vi.fn(),
  trackCCTX: vi.fn(),
  getFees: vi.fn(),
  // Add any other methods that might be called during initialization or use
};
vi.mock('@zetachain/toolkit/client', () => ({
  ZetaChainClient: vi.fn(() => mockZetaChainClientInstance),
}));

const mockSigner = {
  provider: {}, // Mock provider object
  getAddress: async () => 'mockSignerAddress',
} as unknown as Signer;

describe('ZetaChainService', () => {
  let service: ZetaChainService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ZetaChainService();
    // Default successful initialization for most tests
    (ZetaChainClient as any).mockImplementation(() => {
        mockZetaChainClientInstance.getForeignCoins.mockResolvedValue([]); // Default empty
        mockZetaChainClientInstance.getQuote.mockResolvedValue({ amountOut: '0' }); // Default minimal quote
        return mockZetaChainClientInstance;
    });
    service.initializeClient(mockSigner); // Initialize client for each test
  });

  it('should initialize ZetaChainClient successfully', async () => {
    expect(ZetaChainClient).toHaveBeenCalled();
    expect(service.isInitialized()).toBe(true);
  });

  it('should fail to initialize if signer has no provider', async () => {
    const signerNoProvider = { getAddress: async () => 'test' } as Signer;
    const localService = new ZetaChainService();
    const success = await localService.initializeClient(signerNoProvider);
    expect(success).toBe(false);
    expect(localService.isInitialized()).toBe(false);
  });

  describe('listSupportedForeignCoins', () => {
    it('should fetch and map foreign coins to AppSimpleAsset', async () => {
      const mockForeignCoins: ForeignCoin[] = [
        { foreign_chain_id: 5, symbol: 'gETH', name: 'Goerli Ether', contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', decimals: 18, zrc20_contract_address: '0xzrc20gETH' },
        { foreign_chain_id: 137, symbol: 'MATIC', name: 'Polygon Matic', contract: '0xPolygonNative', decimals: 18, zrc20_contract_address: '0xzrc20MATIC' },
        { foreign_chain_id: 999, symbol: 'UNKNOWN', name: 'Unknown Coin', contract: '0xUnknown', decimals: 8, zrc20_contract_address: '0xzrc20UNKNOWN' }, // Unmapped chain
      ];
      mockZetaChainClientInstance.getForeignCoins.mockResolvedValue(mockForeignCoins);

      const assets = await service.listSupportedForeignCoins();
      expect(assets).toHaveLength(2); // Filters out unmapped chain
      expect(assets[0]).toEqual(expect.objectContaining({
        chain: 'ZetaChain' as Chain, // Due to current mapping
        ticker: 'gETH',
        symbol: 'ZetaChain.gETH',
        contractAddress: '0xzrc20gETH',
        decimals: 18,
        source: 'zetachain',
      }));
      expect(assets[1].ticker).toBe('MATIC');
    });
  });

  describe('depositAssetToZetaChain', () => {
    it('should call client.evmDeposit with correct parameters', async () => {
      mockZetaChainClientInstance.evmDeposit.mockResolvedValue({ hash: 'mockDepositTxHash' });
      const txHash = await service.depositAssetToZetaChain('1.0', '0xERC20Address', '0xZetaReceiver', 5);
      expect(mockZetaChainClientInstance.evmDeposit).toHaveBeenCalledWith(expect.objectContaining({
        amount: '1.0',
        erc20: '0xERC20Address',
        receiver: '0xZetaReceiver',
      }));
      expect(txHash).toBe('mockDepositTxHash');
    });
  });

  describe('getZRC20SwapQuote', () => {
    const fromAsset: AppSimpleAsset = { chain: 'ZetaChain' as Chain, ticker: 'zETH', symbol: 'ZetaChain.zETH', contractAddress: '0xFromZRC20', decimals: 18, source: 'zetachain' };
    const toAsset: AppSimpleAsset = { chain: 'ZetaChain' as Chain, ticker: 'zBTC', symbol: 'ZetaChain.zBTC', contractAddress: '0xToZRC20', decimals: 8, source: 'zetachain' };

    it('should get and map a ZRC20 swap quote', async () => {
      const mockRawQuote: GetQuoteResponse = {
        amountIn: parseUnits('1', 18).toString(), // 1 zETH
        amountOut: parseUnits('0.05', 8).toString(), // 0.05 zBTC
        routerAddress: '0xRouter',
        path: [fromAsset.contractAddress!, toAsset.contractAddress!],
        feeData: {
          totalFee: parseUnits('0.1', 18).toString(), // 0.1 ZETA fee
          gasFee: parseUnits('0.05', 18).toString(),
          protocolFee: parseUnits('0.05', 18).toString(),
          feeAsset: { chainId: 7000, address: '0xZetaNative', symbol: 'ZETA', decimals: 18 },
        }
      };
      mockZetaChainClientInstance.getQuote.mockResolvedValue(mockRawQuote);

      const quote = await service.getZRC20SwapQuote(fromAsset, toAsset, '1');
      expect(mockZetaChainClientInstance.getQuote).toHaveBeenCalledWith(parseUnits('1', 18).toString(), fromAsset.contractAddress, toAsset.contractAddress);
      expect(quote).not.toBeNull();
      if (!quote) throw new Error('Quote is null');

      expect(quote.inputAmount).toBe('1');
      expect(quote.outputAmount).toBe(formatUnits(mockRawQuote.amountOut, toAsset.decimals!));
      expect(quote.routerAddress).toBe('0xRouter');
      expect(quote.fees?.totalFeeHumanReadable).toBe(formatUnits(mockRawQuote.feeData!.totalFee, 18));
      expect(quote.fees?.feeAsset?.ticker).toBe('ZETA');
    });
  });

  describe('executeZRC20Swap', () => {
    const fromAsset: AppSimpleAsset = { chain: 'ZetaChain' as Chain, ticker: 'zETH', symbol: 'ZetaChain.zETH', contractAddress: '0xFromZRC20', decimals: 18, source: 'zetachain' };
    const toAsset: AppSimpleAsset = { chain: 'ZetaChain' as Chain, ticker: 'zBTC', symbol: 'ZetaChain.zBTC', contractAddress: '0xToZRC20', decimals: 8, source: 'zetachain' };
    const mockZetaQuote: ZetaQuote = {
      inputAsset: fromAsset,
      outputAsset: toAsset,
      inputAmount: '1',
      inputAmountCryptoPrecision: parseUnits('1', 18).toString(),
      outputAmount: '0.05',
      outputAmountCryptoPrecision: parseUnits('0.05', 8).toString(),
      routerAddress: '0xMockRouter',
      path: [fromAsset.contractAddress!, toAsset.contractAddress!],
    };

    beforeEach(() => {
        // Assume approveToken exists and is successful by default
        mockZetaChainClientInstance.approveToken.mockResolvedValue({ hash: 'mockApproveTxHash', wait: async () => ({ status: 1 }) } as any);
        mockZetaChainClientInstance.send.mockResolvedValue({ hash: 'mockSwapTxHash' } as any);
    });

    it('should approve and execute a ZRC20 swap using client.approveToken', async () => {
      const txHash = await service.executeZRC20Swap(mockZetaQuote, '1', '0.049'); // amountOutMin 0.049
      expect(mockZetaChainClientInstance.approveToken).toHaveBeenCalledWith(expect.objectContaining({
        tokenAddress: fromAsset.contractAddress,
        spenderAddress: mockZetaQuote.routerAddress,
        amount: mockZetaQuote.inputAmountCryptoPrecision,
      }));
      expect(mockZetaChainClientInstance.send).toHaveBeenCalledWith(expect.objectContaining({
        contract: mockZetaQuote.routerAddress,
        method: 'swapExactTokensForTokens',
        args: expect.arrayContaining([
          mockZetaQuote.inputAmountCryptoPrecision, // amountIn
          parseUnits('0.049', toAsset.decimals!).toString(), // amountOutMin
          mockZetaQuote.path, // path
          // recipientAddress, deadline
        ]),
      }));
      expect(txHash).toBe('mockSwapTxHash');
    });

    it('should use manual ethers approval if client.approveToken is not available', async () => {
        const originalApproveToken = mockZetaChainClientInstance.approveToken;
        (mockZetaChainClientInstance as any).approveToken = undefined; // Simulate function not existing

        // Mock ethers.Contract
        const mockContractInstance = { approve: vi.fn().mockResolvedValue({ hash: 'manualApproveTxHash', wait: async () => ({ status: 1 }) }) };
        const actualEthers = await vi.importActual<typeof import('ethers')>('ethers');
        vi.spyOn(actualEthers, 'Contract').mockImplementation(() => mockContractInstance as any);

        // Re-initialize service to ensure mocks are correctly applied if constructor does something with ethers
        // service = new ZetaChainService(); // Not strictly needed here as signer is passed to Contract constructor
        // await service.initializeClient(mockSigner);


        const txHash = await service.executeZRC20Swap(mockZetaQuote, '1', '0.049');

        expect(mockContractInstance.approve).toHaveBeenCalledWith(mockZetaQuote.routerAddress, BigNumber.from(mockZetaQuote.inputAmountCryptoPrecision));
        expect(mockZetaChainClientInstance.send).toHaveBeenCalled();
        expect(txHash).toBe('mockSwapTxHash');

        (mockZetaChainClientInstance as any).approveToken = originalApproveToken; // Restore
        vi.restoreAllMocks(); // Restore all mocks after this test to avoid interference
    });
  });

  describe('trackCCTX', () => {
    it('should call client.trackCCTX', async () => {
      mockZetaChainClientInstance.trackCCTX.mockResolvedValue({ status: 'confirmed' } as any);
      const status = await service.trackCCTX('someTxHash');
      expect(mockZetaChainClientInstance.trackCCTX).toHaveBeenCalledWith({ hash: 'someTxHash', json: true });
      expect(status).toEqual({ status: 'confirmed' });
    });
  });

  describe('getCrossChainFees', () => {
    it('should call client.getFees', async () => {
        const mockFeeResponse: GetFeesResponse = {
            totalFee: '100000', // Example value
            gasFee: '80000',
            protocolFee: '20000',
            // feeAsset might be undefined or populated
        };
      mockZetaChainClientInstance.getFees.mockResolvedValue(mockFeeResponse);
      const fees = await service.getCrossChainFees(5, 7000, '100', 'gETH');
      expect(mockZetaChainClientInstance.getFees).toHaveBeenCalledWith(5, 7000, '100', 'gETH', undefined);
      expect(fees).toEqual(mockFeeResponse);
    });
  });

  describe('callRemoteContractWithMessage', () => {
    it('should throw not implemented error', async () => {
      await expect(service.callRemoteContractWithMessage(137, '0xDestContract', '0xCalldata'))
        .rejects.toThrow(/callRemoteContractWithMessage not fully implemented/);
    });
  });

});
