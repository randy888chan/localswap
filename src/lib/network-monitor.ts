import Prometheus from 'prom-client';

interface NetworkStatus {
  bitcoin: boolean;
  ethereum: boolean;
  solana: boolean;
  polygon: boolean;
  // rangoAPI: boolean; // Removed Rango
  thorchainAPI: boolean;
  zetaAPI: boolean;
  particleAPI: boolean;
}

export class NetworkMonitor {
  private interval: NodeJS.Timeout | null = null;
  // private rangoApiGauge = new Prometheus.Gauge({ // Removed Rango
  //   name: 'rango_api_health',
  //   help: 'Rango API connectivity status',
  //   labelNames: ['chain'] as const
  // });
  private thorchainApiGauge = new Prometheus.Gauge({
    name: 'thorchain_api_health',
    help: 'Thorchain API connectivity status',
    labelNames: ['chain'] as const
  });
  private zetaApiGauge = new Prometheus.Gauge({
    name: 'zetachain_api_health',
    help: 'ZetaChain API connectivity status',
    labelNames: ['chain'] as const
  });
  private particleApiGauge = new Prometheus.Gauge({
    name: 'particle_api_health',
    help: 'Particle Network API connectivity status',
    labelNames: ['chain'] as const
  });
  
  startMonitoring(updateCallback: (status: NetworkStatus) => void) {
    this.interval = setInterval(async () => {
      const status = {
        bitcoin: await this.pingServiceWorker(), // Assuming this checks a local/proxied BTC connection
        ethereum: this.checkEVMProvider('ethereum'), // Assuming this checks wallet provider's network
        solana: this.checkSolanaProvider(), // Assuming this checks wallet provider
        polygon: this.checkEVMProvider('polygon'), // Assuming this checks wallet provider
        // rangoAPI: await this.checkRangoStatus(), // Removed Rango
        thorchainAPI: await this.checkThorchainAPI(),
        zetaAPI: await this.checkZetaAPI(),
        particleAPI: await this.checkParticleAPI(),
      };
      updateCallback(status);
    }, 10000);
  }

  private checkEVMProvider(chain: string) {
    // This check is client-side, indicates if user's wallet (e.g., MetaMask) is connected to the right network.
    // For actual backend service health, different checks are needed.
    // @ts-ignore
    return typeof window !== 'undefined' && !!window.ethereum?.providers?.find(p => p.chainId === chain);
  }

  private checkSolanaProvider() {
    // Similar to EVM, client-side check for Solana wallet provider.
    // @ts-ignore
    return typeof window !== 'undefined' && !!(window.solana || window.phantom?.solana);
  }

  private async pingServiceWorker() {
    // This seems to be for a local service worker, not directly a Bitcoin node health check.
    // Keeping as is, but noting its current functionality.
    if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
      try {
        await navigator.serviceWorker.controller.postMessage('ping');
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  stopMonitoring() {
    this.interval && clearInterval(this.interval);
  }

  // private async checkRangoStatus() { // Removed Rango
  //   try {
  //     const response = await fetch(`${RangoConfig.baseURL}/ping`, {
  //       headers: { 'api-key': RangoConfig.apiKey }
  //     });
      
  //     const success = response.status === 200;
  //     this.rangoApiGauge.set({ chain: 'rango' }, success ? 1 : 0);
      
  //     return success;
  //   } catch (error) {
  //     this.rangoApiGauge.set({ chain: 'rango' }, 0);
  //     return false;
  //   }
  // }

  // Placeholder health checks for the new services
  private async checkThorchainAPI(): Promise<boolean> {
    // TODO: Implement actual Thorchain API health check (e.g., ping Midgard or a THORNode)
    // For example: try { const res = await fetch('https://midgard.thorchain.info/v2/health'); return res.ok; } catch { return false; }
    const success = true; // Placeholder
    this.thorchainApiGauge.set({ chain: 'thorchain' }, success ? 1 : 0);
    return success;
  }

  private async checkZetaAPI(): Promise<boolean> {
    // TODO: Implement actual ZetaChain API health check (e.g., ping a ZetaChain RPC endpoint or API)
    // For example: try { const res = await fetch('https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/observer/node_account'); return res.ok; } catch { return false; }
    const success = true; // Placeholder
    this.zetaApiGauge.set({ chain: 'zetachain' }, success ? 1 : 0);
    return success;
  }

  private async checkParticleAPI(): Promise<boolean> {
    // TODO: Implement actual Particle Network API health check (e.g., a simple, unauthenticated endpoint if available)
    // Particle's health is often more about client-side SDK initialization.
    // A backend check might involve trying to validate a token or similar if applicable.
    const success = true; // Placeholder
    this.particleApiGauge.set({ chain: 'particle' }, success ? 1 : 0);
    return success;
  }
}
