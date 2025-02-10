import requests

def get_swap_quote(api_key, from_asset, to_asset, amount):
    url = "https://api.rango.exchange/api/v2/route"
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }
    
    payload = {
        "from": {
            "blockchain": from_asset['blockchain'],
            "symbol": from_asset['symbol'],
            "address": from_asset['address']
        },
        "to": {
            "blockchain": to_asset['blockchain'],
            "symbol": to_asset['symbol']
        },
        "amount": str(amount)
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Swap quote failed with status code: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Swap quote error: {str(e)}")
        return None

if __name__ == "__main__":
    API_KEY = "YOUR_API_KEY_HERE"
    
    from_asset = {
        "blockchain": "ETH",
        "symbol": "USDC",
        "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }
    
    to_asset = {
        "blockchain": "SOL",
        "symbol": "SOL"
    }
    
    amount = 1000000  # 1 USDC in smallest units
    
    quote = get_swap_quote(API_KEY, from_asset, to_asset, amount)
    if quote:
        print("Best route found:")
        print(f"From: {quote['request']['from']['symbol']}")
        print(f"To: {quote['request']['to']['symbol']}")
        print(f"Estimated output: {quote['result']['outputAmount']}")
