interface NetworkStatus {
  bitcoin: boolean;
  ethereum: boolean;
  solana: boolean;
  polygon: boolean;
}

export class NetworkMonitor {
  private interval: NodeJS.Timeout | null = null;
  
  startMonitoring(updateCallback: (status: NetworkStatus) => void) {
    this.interval = setInterval(async () => {
      const status = {
        bitcoin: await this.pingServiceWorker(),
        ethereum: this.checkEVMProvider('ethereum'),
        solana: this.checkSolanaProvider(),
        polygon: this.checkEVMProvider('polygon')
      };
      updateCallback(status);
    }, 10000);
  }

  private checkEVMProvider(chain: string) {
    return !!window.ethereum?.providers?.find(p => p.chainId === chain);
  }

  private checkSolanaProvider() {
    return !!(window.solana || window.phantom?.solana);
  }

  private pingServiceWorker() {
    return navigator.serviceWorker?.controller?.postMessage('ping')
      .then(() => true)
      .catch(() => false);
  }

  stopMonitoring() {
    this.interval && clearInterval(this.interval);
  }
}
