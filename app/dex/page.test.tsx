import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DexPage from './page';
import { useParticleAuth } from '@/components/ParticleAuthContext';
import { ThorchainService, SimpleAsset, ThorchainQuote } from '@/services/ThorchainService';
import { ZetaChainService } from '@/services/ZetaChainService';
import * * as ParticleLib from '@/lib/particle'; // Import all as a module
import { Chain } from '@xchainjs/xchain-util';
import { Network as XChainNetwork } from '@xchainjs/xchain-client';


// --- Mocks ---
vi.mock('@/components/ParticleAuthContext');
vi.mock('@/services/ThorchainService');
vi.mock('@/services/ZetaChainService');
vi.mock('@/lib/particle', async (importOriginal) => {
    const original = await importOriginal<typeof ParticleLib>();
    return {
        ...original, // Keep other exports if any, though we mostly mock specific functions
        getEthersSigner: vi.fn(),
        getEthersProvider: vi.fn(),
        getNonEvmAddress: vi.fn(),
        signNonEvmTransaction: vi.fn(),
        broadcastNonEvmTransaction: vi.fn(),
    };
});


// Default mock implementations
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockConnectWallet = vi.fn();
const mockOpenWallet = vi.fn();

const mockGetAvailableAssets = vi.fn();
const mockGetSwapQuote = vi.fn();
const mockExecuteSwap = vi.fn();
const mockGetTransactionStatusAndDetails = vi.fn();
const mockSetEvmSigner = vi.fn();
const mockSetXChainClient = vi.fn();

const mockInitializeZetaClient = vi.fn();
const mockListSupportedForeignCoins = vi.fn();
const mockIsZetaInitialized = vi.fn(() => false); // Default to not initialized

const mockGetEthersSigner = ParticleLib.getEthersSigner as vi.Mock;
const mockGetEthersProvider = ParticleLib.getEthersProvider as vi.Mock;
const mockGetNonEvmAddress = ParticleLib.getNonEvmAddress as vi.Mock;
const mockSignNonEvmTransaction = ParticleLib.signNonEvmTransaction as vi.Mock;
const mockBroadcastNonEvmTransaction = ParticleLib.broadcastNonEvmTransaction as vi.Mock;


// Sample Assets
const ethAsset: SimpleAsset = { chain: Chain.Ethereum, symbol: 'ETH.ETH', ticker: 'ETH', decimals: 18, name: 'Ethereum', source: 'thorchain' };
const btcAsset: SimpleAsset = { chain: Chain.Bitcoin, symbol: 'BTC.BTC', ticker: 'BTC', decimals: 8, name: 'Bitcoin', source: 'thorchain' };
const usdtAssetEth: SimpleAsset = { chain: Chain.Ethereum, symbol: 'ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7', ticker: 'USDT', decimals: 6, contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD (ETH)', source: 'thorchain' };
const zetaEthAsset: SimpleAsset = { chain: 'ZetaChain' as Chain, symbol: 'ZetaChain.gETH', ticker: 'gETH', decimals: 18, contractAddress: '0xzrc20gETH', name: 'Goerli Ether (ZRC20)', source: 'zetachain' };

const mockAllAssetsList = [ethAsset, btcAsset, usdtAssetEth, zetaEthAsset];

const mockThorchainQuote: ThorchainQuote = {
  inputAsset: ethAsset,
  outputAsset: btcAsset,
  inputAmount: '1',
  inputAmountCryptoPrecision: '1000000000000000000',
  outputAmount: '0.02',
  expectedOutputAmountCryptoPrecision: '2000000',
  fees: { asset: { chain: Chain.THORChain, symbol: 'THOR.RUNE', ticker: 'RUNE', decimals: 8 }, totalFeeCryptoPrecision: '100000', totalFeeHumanReadable: '0.001' },
  slippageBps: 300,
  memo: 'SWAP:BTC.BTC:mockdestination',
  inboundAddress: 'thorchainInboundAddress',
  notes: 'Mock notes',
};


describe('DexPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default Particle Auth Context
        (useParticleAuth as vi.Mock).mockReturnValue({
            userInfo: { uuid: 'test-user' },
            walletAccounts: ['0xMockEvmAddress'],
            isLoadingAuth: false,
            login: mockLogin,
            logout: mockLogout,
            connectWallet: mockConnectWallet,
            openWallet: mockOpenWallet,
        });

        // Default ThorchainService Mocks
        (ThorchainService as vi.Mock).mockImplementation(() => ({
            network: XChainNetwork.Mainnet,
            getAvailableAssets: mockGetAvailableAssets.mockResolvedValue(mockAllAssetsList.filter(a => a.source === 'thorchain')),
            getSwapQuote: mockGetSwapQuote.mockResolvedValue(mockThorchainQuote),
            executeSwap: mockExecuteSwap.mockResolvedValue('mockEvmTxHash'),
            getTransactionStatusAndDetails: mockGetTransactionStatusAndDetails.mockResolvedValue({ status: 'success' }),
            setEvmSigner: mockSetEvmSigner,
            setXChainClient: mockSetXChainClient,
            // getAssetDecimals: vi.fn(asset => asset.decimals || 8) // Simplified mock
        }));

        // Default ZetaChainService Mocks
        (ZetaChainService as vi.Mock).mockImplementation(() => ({
            initializeClient: mockInitializeZetaClient.mockResolvedValue(true),
            listSupportedForeignCoins: mockListSupportedForeignCoins.mockResolvedValue(mockAllAssetsList.filter(a => a.source === 'zetachain')),
            isInitialized: mockIsZetaInitialized.mockReturnValue(true), // Assume initialized after setup
        }));

        // Default ParticleLib Mocks
        mockGetEthersSigner.mockResolvedValue({ getAddress: async () => '0xMockEvmAddress' } as any);
        mockGetEthersProvider.mockReturnValue({} as any);
        mockGetNonEvmAddress.mockResolvedValue('mockNonEvmAddress');
        mockSignNonEvmTransaction.mockResolvedValue('signedNonEvmTxData');
        mockBroadcastNonEvmTransaction.mockResolvedValue('nonEvmTxHash');

        // Mock console.error and console.warn
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {}); // Suppress logs during tests
    });

    it('renders initial state and loads assets', async () => {
        render(<DexPage />);
        expect(screen.getByText('Decentralized Exchange')).toBeInTheDocument();
        await waitFor(() => expect(mockGetAvailableAssets).toHaveBeenCalled());
        await waitFor(() => expect(mockListSupportedForeignCoins).toHaveBeenCalled());

        // Check if default assets are selected (first one in each list)
        // This depends on the exact default selection logic if assets load
        await waitFor(() => {
            expect(screen.getByLabelText('From Asset')).toHaveValue(ethAsset.symbol);
            expect(screen.getByLabelText('To Asset')).toHaveValue(btcAsset.symbol); // Or other default
        });
    });

    it('fetches and displays a quote', async () => {
        render(<DexPage />);
        await waitFor(() => { // Ensure assets are loaded and selects are populated
            expect(screen.getByLabelText('From Asset')).not.toBeDisabled();
        });

        fireEvent.change(screen.getByLabelText('From Asset'), { target: { value: ethAsset.symbol } });
        fireEvent.change(screen.getByLabelText('To Asset'), { target: { value: btcAsset.symbol } });
        fireEvent.change(screen.getByLabelText('Amount to Swap'), { target: { value: '1' } });

        fireEvent.click(screen.getByText('Get Quote'));

        await waitFor(() => expect(mockGetSwapQuote).toHaveBeenCalledWith(
            ethAsset, btcAsset, '1', expect.any(String) // destinationAddress for quote
        ));
        await waitFor(() => {
            expect(screen.getByText('Quote Details:')).toBeInTheDocument();
            expect(screen.getByText(`Output: ${mockThorchainQuote.outputAmount} ${mockThorchainQuote.outputAsset.ticker}`)).toBeInTheDocument();
        });
    });

    it('executes an EVM swap successfully', async () => {
        render(<DexPage />);
        // Populate selects and amount
        await waitFor(() => {
            fireEvent.change(screen.getByLabelText('From Asset'), { target: { value: ethAsset.symbol } });
            fireEvent.change(screen.getByLabelText('To Asset'), { target: { value: btcAsset.symbol } });
            fireEvent.change(screen.getByLabelText('Amount to Swap'), { target: { value: '1' } });
        });
        fireEvent.click(screen.getByText('Get Quote'));
        await waitFor(() => screen.getByText('Execute Swap')); // Wait for quote to enable button

        fireEvent.click(screen.getByText('Execute Swap'));

        await waitFor(() => expect(mockExecuteSwap).toHaveBeenCalledWith(
            mockThorchainQuote, '0xMockEvmAddress', '0xMockEvmAddress' // Defaulting to EVM addr
        ));
        await waitFor(() => expect(screen.getByText(/Swap Initiated! Tx Hash: mockEvmTxHash/i)).toBeInTheDocument());
        await waitFor(() => expect(mockGetTransactionStatusAndDetails).toHaveBeenCalledWith('mockEvmTxHash', ethAsset.chain));
    });

    it('handles non-EVM address fetching and client setup', async () => {
        render(<DexPage />);

        // Select BTC as 'from' asset
        await act(async () => {
            fireEvent.change(screen.getByLabelText('From Asset'), { target: { value: btcAsset.symbol } });
        });

        await waitFor(() => expect(mockGetNonEvmAddress).toHaveBeenCalledWith(Chain.Bitcoin));
        await waitFor(() => expect(screen.getByText(`Connected ${Chain.Bitcoin} Wallet: mockNonEvmAddress`)).toBeInTheDocument());
        await waitFor(() => expect(mockSetXChainClient).toHaveBeenCalledWith(Chain.Bitcoin, expect.any(Object)));
    });


    it('executes a non-EVM (Bitcoin) swap successfully', async () => {
        // Setup for non-EVM
        mockGetNonEvmAddress.mockResolvedValue('mockBtcAddress');
        mockExecuteSwap.mockResolvedValue({ // Simulate non-EVM response from service
            unsignedTxData: { type: 'psbt', psbtHex: 'mockPsbtHexForBtc' },
            chain: Chain.Bitcoin,
        });
        mockSignNonEvmTransaction.mockResolvedValue('signedBtcPsbtHex');
        mockBroadcastNonEvmTransaction.mockResolvedValue('nonEvmBtcTxHash');

        render(<DexPage />);

        // Select BTC asset
        await act(async () => {
            fireEvent.change(screen.getByLabelText('From Asset'), { target: { value: btcAsset.symbol } });
            fireEvent.change(screen.getByLabelText('To Asset'), { target: { value: ethAsset.symbol } }); // BTC to ETH
            fireEvent.change(screen.getByLabelText('Amount to Swap'), { target: { value: '0.1' } });
        });

        // Wait for non-EVM address to be fetched and displayed
        await waitFor(() => screen.getByText(`Connected ${Chain.Bitcoin} Wallet: mockBtcAddress`));

        // Get Quote
        const mockBtcToEthQuote = { ...mockThorchainQuote, inputAsset: btcAsset, outputAsset: ethAsset, inputAmount: '0.1', memo: 'SWAP:ETH.ETH:0xMockEvmAddress' };
        mockGetSwapQuote.mockResolvedValue(mockBtcToEthQuote);
        fireEvent.click(screen.getByText('Get Quote'));
        await waitFor(() => screen.getByText('Execute Swap'));

        // Execute Swap
        fireEvent.click(screen.getByText('Execute Swap'));

        await waitFor(() => expect(mockExecuteSwap).toHaveBeenCalledWith(
            mockBtcToEthQuote, 'mockBtcAddress', '0xMockEvmAddress' // Source is BTC, dest is EVM
        ));
        await waitFor(() => expect(screen.getByText(/Please sign the Bitcoin transaction/i)).toBeInTheDocument());

        await waitFor(() => expect(mockSignNonEvmTransaction).toHaveBeenCalledWith(
            Chain.Bitcoin, 'mockPsbtHexForBtc', 'mockBtcAddress'
        ));
        await waitFor(() => expect(screen.getByText(/Broadcasting Bitcoin transaction/i)).toBeInTheDocument());

        await waitFor(() => expect(mockBroadcastNonEvmTransaction).toHaveBeenCalledWith(
            Chain.Bitcoin, 'signedBtcPsbtHex', undefined // No originalSignDoc for BTC
        ));
        await waitFor(() => expect(screen.getByText(/Swap Initiated! Tx Hash: nonEvmBtcTxHash/i)).toBeInTheDocument());
        await waitFor(() => expect(mockGetTransactionStatusAndDetails).toHaveBeenCalledWith('nonEvmBtcTxHash', Chain.Bitcoin));
    });

    it('shows error message if getQuote fails', async () => {
        mockGetSwapQuote.mockResolvedValue(null);
        render(<DexPage />);
        await waitFor(() => { /* assets loaded */ });
        fireEvent.change(screen.getByLabelText('From Asset'), { target: { value: ethAsset.symbol } });
        fireEvent.change(screen.getByLabelText('To Asset'), { target: { value: btcAsset.symbol } });
        fireEvent.change(screen.getByLabelText('Amount to Swap'), { target: { value: '1' } });
        fireEvent.click(screen.getByText('Get Quote'));

        await waitFor(() => expect(screen.getByText('Error: Failed to fetch quote from THORChain.')).toBeInTheDocument());
    });

    // TODO: Add more tests:
    // - ZetaChain interactions (e.g., fetching ZRC20s, if UI elements are added)
    // - Error handling for executeSwap (EVM and non-EVM)
    // - Error handling for signNonEvmTransaction and broadcastNonEvmTransaction
    // - UI state changes during loading/swapping
    // - User not logged in / wallet not connected states and their effects on UI interactions
});

// Minimal fetch mock for CTA generation part - can be expanded if needed
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ text: 'Mock CTA' }),
  })
) as vi.Mock;
