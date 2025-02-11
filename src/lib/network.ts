export class ResilientConnection {
  private static instance: ResilientConnection;
  private circuitBreakers = new Map<string, boolean>();
  private connectionAttempts = new Map<string, number>();
  
  constructor() {
    setInterval(() => this.resetCircuitBreakers(), 30000);
  }

  async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    backoff = 300
  ): Promise<Response> {
    const breakerKey = `${new URL(url).hostname}_${options.method}`;
    
    if (this.circuitBreakers.get(breakerKey)) {
      throw new Error(`Circuit breaker tripped for ${breakerKey}`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      
      this.connectionAttempts.delete(breakerKey);
      return response;

    } catch (error) {
      const attempts = (this.connectionAttempts.get(breakerKey) || 0) + 1;
      this.connectionAttempts.set(breakerKey, attempts);

      if(attempts >= retries) {
        this.circuitBreakers.set(breakerKey, true);
        console.error(`Circuit breaker tripped for ${breakerKey}`);
      }

      await new Promise(resolve => setTimeout(resolve, backoff * attempts));
      return this.fetchWithRetry(url, options, retries, backoff);
    }
  }

  private resetCircuitBreakers() {
    Array.from(this.circuitBreakers.keys()).forEach(key => {
      const attempts = this.connectionAttempts.get(key) || 0;
      if(attempts < 3) this.circuitBreakers.set(key, false);
    });
  }
}
