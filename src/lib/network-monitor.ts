import Prometheus from 'prom-client';

interface NetworkStatus {
  bitcoin: boolean;
  ethereum: boolean;
  solana: boolean;
  polygon: boolean;
  rangoAPI: boolean;
}

export class NetworkMonitor {
  private interval: NodeJS.Timeout | null = null;
  private rangoApiGauge = new Prometheus.Gauge({
    name: 'rango_api_health',
    help: 'Rango API connectivity status',
    labelNames: ['chain'] as const
  });
  
  startMonitoring(updateCallback: (status: NetworkStatus) => void) {
    this.interval = setInterval(async () => {
      const status = {
        bitcoin: await this.pingServiceWorker(),
        ethereum: this.checkEVMProvider('ethereum'),
        solana: this.checkSolanaProvider(),
        polygon: this.checkEVMProvider('polygon'),
        rangoAPI: await this.checkRangoStatus()
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

  private async checkRangoStatus() {
    try {
      const response = await fetch(`${RangoConfig.baseURL}/ping`, {
        headers: { 'api-key': RangoConfig.apiKey }
      });
      
      const success = response.status === 200;
      this.rangoApiGauge.set({ chain: 'rango' }, success ? 1 : 0);
      
      return success;
    } catch (error) {
      this.rangoApiGauge.set({ chain: 'rango' }, 0);
      return false;
    }
  }
}
