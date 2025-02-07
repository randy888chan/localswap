import { WalletClient } from '@rango-dao/wallets';
import { RangoConfig } from '../config/rango';

export class WalletService {
  private static instance: WalletService;
  private wallets: WalletClient[] = [];

  private constructor() {
    this.init();
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private init(): void {
    try {
      const chains = Object.entries(RangoConfig.wallets).map(([network, config]) => ({
        network,
        provider: config.provider,
        ...(config),
      }));

      this.wallets = chains.map((chain) => new WalletClient(chain));
    } catch (error) {
      console.error('Wallet initialization failed:', error);
    }
  }

  public getWallet(network: string): WalletClient {
    const wallet = this.wallets.find((w) => w.getNetwork() === network);
    if (!wallet) {
      throw new Error(`Wallet for network ${network} not found`);
    }
    return wallet;
  }
}
