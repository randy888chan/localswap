import requests

def check_transaction_status(api_key, request_id):
    url = f"https://api.rango.exchange/api/v2/transaction-status?requestId={request_id}"
    headers = {
        "api-key": api_key
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Status check failed with status code: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Status check error: {str(e)}")
        return None

if __name__ == "__main__":
    API_KEY = "YOUR_API_KEY_HERE"
    REQUEST_ID = "YOUR_REQUEST_ID_HERE"  # Replace with actual request ID from swap
    
    status = check_transaction_status(API_KEY, REQUEST_ID)
    if status:
        print("Transaction status:")
        print(f"Status: {status['status']}")
        print(f"Details: {status.get('description', 'No additional details')}")
