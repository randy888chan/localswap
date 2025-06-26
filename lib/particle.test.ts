import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as ParticleModule from './particle'; // Import all exports
import { Chain } from '@xchainjs/xchain-util';
import { Ethereum, BNBChain, Polygon, Avalanche, ArbitrumOne, EthereumGoerli } from '@particle-network/chains';

// Mock Particle SDKs
const mockParticleAuthInstance = {
  login: vi.fn(),
  logout: vi.fn(),
  getUserInfo: vi.fn(),
};
const mockParticleConnectInstance = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  provider: null as any, // Will be set in tests
  particle: null as any, // For walletType
  currAccounts: [] as string[],
  request: vi.fn(),
  openWallet: vi.fn(),
  openChainSwitchModal: vi.fn(),
  openAccountSwitchModal: vi.fn(),
};

vi.mock('@particle-network/auth', () => ({
  ParticleAuth: vi.fn(() => mockParticleAuthInstance),
}));
vi.mock('@particle-network/connect', () => ({
  ParticleConnect: vi.fn(() => mockParticleConnectInstance),
}));

// Mock ethers
const mockEthersSigner = {
  getAddress: vi.fn().mockResolvedValue('mockEthAddress'),
};
const mockEthersProvider = {
  getSigner: vi.fn(() => mockEthersSigner),
};
vi.mock('ethers', async (importOriginal) => {
    const originalEthers = await importOriginal<typeof import('ethers')>();
    return {
        ...originalEthers, // Keep original stuff like utils, constants
        ethers: {
            ...originalEthers.ethers,
            providers: {
                ...originalEthers.ethers.providers,
                Web3Provider: vi.fn(() => mockEthersProvider),
            },
            Signer: vi.fn(() => mockEthersSigner), // If Signer class is instantiated directly
        }
    };
});


describe('Particle Service (lib/particle.ts)', () => {
  const ENV_BACKUP = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ENV_BACKUP }; // Restore env

    // Reset mocks that might hold state
    mockParticleAuthInstance.getUserInfo.mockReturnValue(null); // Default to not logged in
    mockParticleConnectInstance.provider = null;
    mockParticleConnectInstance.particle = null;
    mockParticleConnectInstance.currAccounts = [];

    // Mock console.error to spy on it without polluting test output too much
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = ENV_BACKUP; // Restore original env vars
    vi.restoreAllMocks(); // Restore console spies
  });

  describe('Initialization', () => {
    it('should initialize ParticleAuth and ParticleConnect with env variables', () => {
      process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID = 'testProjectId';
      process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY = 'testClientKey';
      process.env.NEXT_PUBLIC_PARTICLE_APP_ID = 'testAppId';

      // Re-import or re-evaluate module if instantiation happens at module load time
      // For this structure, instantiation is at module level, so need to reset modules
      vi.resetModules();
      const Particle = require('./particle'); // Re-require

      expect(Particle.particleAuth).toBeDefined();
      expect(Particle.particleConnect).toBeDefined();
      expect(require('@particle-network/auth').ParticleAuth).toHaveBeenCalledWith({
        projectId: 'testProjectId',
        clientKey: 'testClientKey',
        appId: 'testAppId',
      });
      expect(require('@particle-network/connect').ParticleConnect).toHaveBeenCalledWith(expect.objectContaining({
        projectId: 'testProjectId',
        clientKey: 'testClientKey',
        appId: 'testAppId',
      }));
    });

    it('should log an error if Particle env variables are missing', () => {
      delete process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
      vi.resetModules();
      require('./particle'); // Re-require to trigger console error
      expect(console.error).toHaveBeenCalledWith("Particle Network environment variables are not set!");
    });
  });

  describe('Auth Functions', () => {
    const mockUserInfo = { uuid: 'test-uuid', token: 'test-token' };

    it('handleLogin should call particleAuth.login and return userInfo', async () => {
      mockParticleAuthInstance.login.mockResolvedValue(mockUserInfo);
      const userInfo = await ParticleModule.handleLogin('google');
      expect(mockParticleAuthInstance.login).toHaveBeenCalledWith({ preferredAuthType: 'google' });
      expect(userInfo).toEqual(mockUserInfo);
    });

    it('handleLogin should throw if particleAuth.login fails', async () => {
      mockParticleAuthInstance.login.mockRejectedValue(new Error('Login failed'));
      await expect(ParticleModule.handleLogin('email')).rejects.toThrow('Login failed');
    });

    it('handleLogout should call particleAuth.logout', async () => {
      await ParticleModule.handleLogout();
      expect(mockParticleAuthInstance.logout).toHaveBeenCalled();
    });

    it('getUserInfo should call particleAuth.getUserInfo', () => {
      mockParticleAuthInstance.getUserInfo.mockReturnValue(mockUserInfo);
      const userInfo = ParticleModule.getUserInfo();
      expect(mockParticleAuthInstance.getUserInfo).toHaveBeenCalled();
      expect(userInfo).toEqual(mockUserInfo);
    });
  });

  describe('Particle Connect UI & Connection', () => {
    const mockAccounts = ['0x123'];

    it('connectWallet should call particleConnect.connect', async () => {
      mockParticleConnectInstance.connect.mockResolvedValue(mockAccounts);
      const accounts = await ParticleModule.connectWallet('metaMask');
      expect(mockParticleConnectInstance.connect).toHaveBeenCalledWith({ preferredAuthType: 'metaMask' });
      expect(accounts).toEqual(mockAccounts);
    });

    it('disconnectWallet should call particleConnect.disconnect', async () => {
      await ParticleModule.disconnectWallet();
      expect(mockParticleConnectInstance.disconnect).toHaveBeenCalled();
    });

    it('openWallet should call particleConnect.openWallet', () => {
      ParticleModule.openWallet();
      expect(mockParticleConnectInstance.openWallet).toHaveBeenCalled();
    });
    // Similar tests for openChainSwitchModal, openAccountSwitchModal
  });

  describe('EVM Functions', () => {
    it('getEthersSigner should return a signer if provider exists', async () => {
      mockParticleConnectInstance.provider = { isParticle: true /* mock provider */ };
      const signer = await ParticleModule.getEthersSigner();
      expect(signer).toBe(mockEthersSigner);
      expect(mockEthersProvider.getSigner).toHaveBeenCalled();
      expect(mockEthersSigner.getAddress).toHaveBeenCalled();
    });

    it('getEthersSigner should return null if provider does not exist', async () => {
      mockParticleConnectInstance.provider = null;
      const signer = await ParticleModule.getEthersSigner();
      expect(signer).toBeNull();
    });

    it('getEthersSigner should return null if signer.getAddress fails', async () => {
        mockParticleConnectInstance.provider = { isParticle: true };
        mockEthersSigner.getAddress.mockRejectedValueOnce(new Error("No account"));
        const signer = await ParticleModule.getEthersSigner();
        expect(signer).toBeNull();
      });

    it('getEthersProvider should return a provider if particle provider exists', () => {
        mockParticleConnectInstance.provider = { isParticle: true };
        const provider = ParticleModule.getEthersProvider();
        expect(provider).toBe(mockEthersProvider);
      });
  });

  describe('getNonEvmAddress', () => {
    it('should return null if provider is not available', async () => {
      mockParticleConnectInstance.provider = null;
      const address = await ParticleModule.getNonEvmAddress(Chain.Bitcoin);
      expect(address).toBeNull();
      expect(console.warn).toHaveBeenCalledWith("Particle connect provider not available for getNonEvmAddress.");
    });

    it('Bitcoin: should use currAccounts if available', async () => {
      mockParticleConnectInstance.provider = { isParticle: true };
      mockParticleConnectInstance.currAccounts = ['0xEvmAddr', '1BtcAddressValidLooking'];
      const address = await ParticleModule.getNonEvmAddress(Chain.Bitcoin);
      expect(address).toBe('1BtcAddressValidLooking');
    });

    it('Bitcoin: should log error and return null if currAccounts not suitable', async () => {
      mockParticleConnectInstance.provider = { isParticle: true };
      mockParticleConnectInstance.currAccounts = ['0xEvmAddr'];
      const address = await ParticleModule.getNonEvmAddress(Chain.Bitcoin);
      expect(address).toBeNull();
      expect(console.error).toHaveBeenCalledWith(`Particle SDK method for getting external ${Chain.Bitcoin} address is not confirmed. Returning null.`);
    });

    it('Cosmos: should use currAccounts if available', async () => {
        mockParticleConnectInstance.provider = { isParticle: true };
        mockParticleConnectInstance.currAccounts = ['0xEvmAddr', 'cosmos1validaddresslooking'];
        const address = await ParticleModule.getNonEvmAddress(Chain.Cosmos);
        expect(address).toBe('cosmos1validaddresslooking');
      });

    it('Unsupported chain: should return null', async () => {
      mockParticleConnectInstance.provider = { isParticle: true };
      // @ts-ignore - Testing unsupported chain
      const address = await ParticleModule.getNonEvmAddress('UnsupportedChain');
      expect(address).toBeNull();
      expect(console.warn).toHaveBeenCalledWith("getNonEvmAddress: Chain UnsupportedChain not explicitly supported or method unknown.");
    });
  });

  describe('signNonEvmTransaction', () => {
    const mockTxDataBtc = 'psbtHexData';
    const mockSignDocCosmos = JSON.stringify({ chain_id: 'cosmoshub-4', account_number: '1' });
    const fromAddress = 'testFromAddress';

    it('should return null if provider is not available', async () => {
      mockParticleConnectInstance.provider = null;
      const sig = await ParticleModule.signNonEvmTransaction(Chain.Bitcoin, mockTxDataBtc, fromAddress);
      expect(sig).toBeNull();
    });

    it('Bitcoin: should call particleConnect.request with bitcoin_signPsbt', async () => {
      mockParticleConnectInstance.provider = { isParticle: true };
      mockParticleConnectInstance.request.mockResolvedValue('signedPsbtHex');
      const result = await ParticleModule.signNonEvmTransaction(Chain.Bitcoin, mockTxDataBtc, fromAddress);
      expect(mockParticleConnectInstance.request).toHaveBeenCalledWith({
        method: 'bitcoin_signPsbt',
        params: [{ psbt: mockTxDataBtc, address: fromAddress }],
      });
      expect(result).toBe('signedPsbtHex');
    });

    it('Cosmos: should call particleConnect.request with cosmos_signAmino', async () => {
        mockParticleConnectInstance.provider = { isParticle: true };
        const mockSignature = { signature: 'base64sig' };
        mockParticleConnectInstance.request.mockResolvedValue(mockSignature);
        const result = await ParticleModule.signNonEvmTransaction(Chain.Cosmos, mockSignDocCosmos, fromAddress);
        expect(mockParticleConnectInstance.request).toHaveBeenCalledWith({
          method: 'cosmos_signAmino',
          params: [fromAddress, JSON.parse(mockSignDocCosmos)],
        });
        expect(result).toEqual(mockSignature);
      });

    it('should throw error from particleConnect.request', async () => {
      mockParticleConnectInstance.provider = { isParticle: true };
      mockParticleConnectInstance.request.mockRejectedValue(new Error('User rejected signing'));
      await expect(ParticleModule.signNonEvmTransaction(Chain.Bitcoin, mockTxDataBtc, fromAddress))
        .rejects.toThrow('User rejected signing');
    });
  });

  describe('broadcastNonEvmTransaction', () => {
    const mockSignedBtcTx = 'signedRawBitcoinTxHex';
    const mockSignedCosmosData = { signature: 'base64sig' };
    const mockOriginalCosmosSignDoc = { chain_id: 'cosmoshub-4' };

    let fetchSpy: any;

    beforeEach(() => {
        fetchSpy = vi.spyOn(global, 'fetch');
    });

    it('Bitcoin: should POST to Blockstream and return txHash on success', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: true,
            text: async () => 'btcTxHash123',
        } as Response);
        const txHash = await ParticleModule.broadcastNonEvmTransaction(Chain.Bitcoin, mockSignedBtcTx);
        expect(fetchSpy).toHaveBeenCalledWith('https://blockstream.info/api/tx', expect.objectContaining({
            method: 'POST',
            body: mockSignedBtcTx,
        }));
        expect(txHash).toBe('btcTxHash123');
    });

    it('Bitcoin: should throw if Blockstream broadcast fails', async () => {
        fetchSpy.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'broadcast error',
        } as Response);
        await expect(ParticleModule.broadcastNonEvmTransaction(Chain.Bitcoin, mockSignedBtcTx))
            .rejects.toThrow('Bitcoin broadcast failed (500): broadcast error');
    });

    it('Cosmos: should log error and return mock txid (placeholder behavior)', async () => {
        const txHash = await ParticleModule.broadcastNonEvmTransaction(Chain.Cosmos, mockSignedCosmosData, mockOriginalCosmosSignDoc);
        expect(console.error).toHaveBeenCalledWith("Cosmos broadcast: Full implementation needed using CosmJS or similar. Returning mock.");
        expect(txHash).stringContaining('mock-cosmos-txid-');
    });

    it('Cosmos: should throw if signedData is invalid', async () => {
        await expect(ParticleModule.broadcastNonEvmTransaction(Chain.Cosmos, 'invalidSignedData' as any, mockOriginalCosmosSignDoc))
            .rejects.toThrow("Invalid signed data format for Cosmos broadcast.");
    });

    it('Cosmos: should throw if originalSignDoc is missing', async () => {
        await expect(ParticleModule.broadcastNonEvmTransaction(Chain.Cosmos, mockSignedCosmosData, undefined))
            .rejects.toThrow("Original SignDoc required for Cosmos broadcast.");
    });

    it('Unsupported chain: should return null for broadcast', async () => {
        // @ts-ignore
        const result = await ParticleModule.broadcastNonEvmTransaction('UnsupportedChain', 'data');
        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalledWith("broadcastNonEvmTransaction: Chain UnsupportedChain not explicitly supported.");
    });
  });
});
