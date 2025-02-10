import { RangoConfig } from '../config/rango';
import { walletService } from '../services/wallet.service';
import { swapMonitor } from './swapMonitor';

interface RangoSwapParams {
  from: {
    blockchain: string;
    address: string;
    amount: string;
  };
  to: {
    blockchain: string;
    address: string;
  };
}

export class SwapValidator {
  static async validateSwap(params: RangoSwapParams) {
    // 1. Chain availability check
    const chains = await fetch(`${RangoConfig.baseURL}/metadata/chains`)
      .then(res => res.json());
    
    if (!chains.includes(params.from.blockchain)) {
      throw new Error(`Chain ${params.from.blockchain} not supported`);
    }

    // 2. Balance validation
    const balance = await walletService.getBalance(
      params.from.blockchain,
      params.from.address
    );
    
    if (Number(balance) < Number(params.amount)) {
      throw new Error('Insufficient balance'); 
    }

    // 3. Swap size limits
    const swapLimit = Number(RangoConfig.limits.dailySwapLimit);
    const dailyUsage = await swapMonitor.getDailySwapUsage();
    
    if ((dailyUsage + Number(params.amount)) > swapLimit) {
      throw new Error('Daily swap limit exceeded');
    }
  }
}
