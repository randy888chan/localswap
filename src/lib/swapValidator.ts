import { RangoConfig } from '../config/rango';
import { walletService } from '../services/wallet.service';
import { swapMonitor } from './swapMonitor';

export class SwapValidator {
  static async validateP2PTrade(params: {
    offerId: string;
    amount: number;
    userAddress: string;
    userIP: string;
  }) {
    // 1. Verify offer validity
    const offer = await lcsApiRequest(`offers/${params.offerId}/`).then(r => r.json());
    
    if (!offer.is_available) {
      throw new Error('Offer no longer available');
    }

    // 2. Check amount constraints
    if (params.amount < offer.min_trade_size || params.amount > offer.max_trade_size) {
      throw new Error(`Amount must be between ${offer.min_trade_size} and ${offer.max_trade_size}`);
    }

    // 3. Compliance checks
    const compliance = await checkTradeCompliance(params.userIP, params.userAddress);
    if (!compliance.allowed) {
      throw new Error('Trade restricted by compliance rules');
    }

    // 4. Payment method verification
    if (offer.sms_required) {
      const verified = await verifySmsVerification(params.userPhone);
      if (!verified) {
        throw new Error('SMS verification required');
      }
    }
  }

  static async verifySmsVerification(phone: string) {
    const response = await lcsApiRequest('verify/sms/', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
    
    return response.ok;
  }

  static async validateSwap(params: RangoSwapParams) {
    // Existing swap validation logic
    const chains = await fetch(`${RangoConfig.baseURL}/metadata/chains`)
      .then(res => res.json());
    
    if (!chains.includes(params.from.blockchain)) {
      throw new Error(`Chain ${params.from.blockchain} not supported`);
    }

    const balance = await walletService.getBalance(
      params.from.blockchain,
      params.from.address
    );
    
    if (Number(balance) < Number(params.amount)) {
      throw new Error('Insufficient balance'); 
    }

    const swapLimit = Number(RangoConfig.limits.dailySwapLimit);
    const dailyUsage = await swapMonitor.getDailySwapUsage();
    
    if ((dailyUsage + Number(params.amount)) > swapLimit) {
      throw new Error('Daily swap limit exceeded');
    }
  }
}
