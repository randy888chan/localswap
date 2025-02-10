interface GetBestRouteParams {
  from: {
    blockchain: string;
    symbol: string;
    address?: string;
  };
  to: {
    blockchain: string;
    symbol: string;
    address?: string;
  };
  amount: string;
}

export class RangoClient {
  private static API_VERSION = "v2";
  
  constructor(
    private apiKey: string,
    private baseUrl = "https://api.rango.exchange"
  ) {}

  async getBestRoute(params: GetBestRouteParams) {
    return this.callAPI("/route", params);
  }

  private async callAPI(endpoint: string, params: object) {
    const url = new URL(`/api/${RangoClient.API_VERSION}${endpoint}`, this.baseUrl);
    
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
