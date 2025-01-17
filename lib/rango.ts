const API_BASE_URL = 'https://api.rango.exchange';

export async function getSwapQuote(
  from: string,
  to: string,
  amount: string
): Promise<any> {
  // Mock data for now, based on the API documentation
  const mockQuote = {
    "requestId": "d10657ce-b13a-405c-825b-b47f8a5016ad",
    "requestAmount": amount,
    "from": {
      "blockchain": "BSC",
      "symbol": "BNB",
      "address": null
    },
    "to": {
      "blockchain": "AVAX_CCHAIN",
      "symbol": "USDT.E",
      "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"
    },
    "result": {
      "outputAmount": "28.5",
      "fee": "0.1",
      "route": [
        {
          "type": "DEX",
          "from": {
            "blockchain": "BSC",
            "symbol": "BNB",
            "address": null
          },
          "to": {
            "blockchain": "BSC",
            "symbol": "USDT",
            "address": "0x55d398326f99059ff775485246999027b3197955"
          },
          "amount": "1",
          "dex": "PancakeSwap",
          "path": []
        },
        {
          "type": "BRIDGE",
          "from": {
            "blockchain": "BSC",
            "symbol": "USDT",
            "address": "0x55d398326f99059ff775485246999027b3197955"
          },
          "to": {
            "blockchain": "AVAX_CCHAIN",
            "symbol": "USDT.E",
            "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"
          },
          "amount": "28.6",
          "bridge": "Celer",
          "path": []
        }
      ]
    },
    "validationStatus": null,
    "diagnosisMessages": [],
    "missingBlockchains": [],
    "blockchains": ["BSC", "AVAX_CCHAIN"],
    "processingLimitReached": false,
    "walletNotSupportingFromBlockchain": false,
    "error": null,
    "errorCode": null,
    "traceId": null
  };

  return mockQuote;

  // In the future, this will be replaced with actual API calls:
  // const response = await fetch(`${API_BASE_URL}/basic/route`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': process.env.RANGO_API_KEY,
  //   },
  //   body: JSON.stringify({
  //     from,
  //     to,
  //     amount,
  //   }),
  // });
  // const data = await response.json();
  // return data;
}
