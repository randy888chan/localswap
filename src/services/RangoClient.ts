interface ExecuteSwapParams {
  requestId: string;
  from: {
    blockchain: string;
    symbol: string; 
    address: string;
  };
  to: {
    blockchain: string;
    symbol: string;
    address: string;
  };
  amount: string;
}

export class RangoClient {
  constructor(
    private apiKey: string,
    private wallet: WalletService = WalletService.getInstance()
  ) {}

  // Critical security/validation additions
  async executeSwap(params: ExecuteSwapParams) {
    const balance = await this.wallet.getBalance(
      params.from.blockchain, 
      params.from.symbol,
      params.from.address
    );
    
    return this.callAPI('/swap', {
      ...params,
      availableBalance: balance.toString(),
      validationConfig: {
        balance: this.shouldValidateBalance(params),
        fee: Number(params.amount) > 0.1, // Only validate fees for larger swaps
        destinationTag: params.to.symbol === 'XRP' && !!params.to.address
      }
    });
  }

  private shouldValidateBalance(params: ExecuteSwapParams): boolean {
    const threshold = RangoConfig.balanceThresholds[params.from.blockchain] || 0.01;
    return Number(params.amount) >= threshold * 0.9; // Allow 10% slippage
  }

  async safeCancelSwap(requestId: string) {
    try {
      await this.callAPI(`/swap/${requestId}/cancel`, { method: 'DELETE' });
      
      // Verify cancellation on-chain
      const success = await this.wallet.validateCancel(
        requestId, 
        'swap-cancel'
      );
      
      if (!success) throw new Error('Not confirmed on-chain');
      
    } catch (error) {
      console.error('Cancel failed, reverting state');
      await this.wallet.revertSwapState(requestId);
    }
  }

  private async callAPI(endpoint: string, params: object) {
    const url = new URL(`/api/v2${endpoint}`, "https://api.rango.exchange");
    
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`Rango API error ${response.status}`);
    }

    return response.json();
  }
}
