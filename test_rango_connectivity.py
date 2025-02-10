import requests

def test_rango_connectivity(api_key):
    # Test basic ping endpoint
    ping_url = "https://api.rango.exchange/api/v2/ping"
    try:
        response = requests.get(ping_url)
        if response.status_code == 200:
            print("Ping successful!")
            print(response.json())
            return True
        else:
            print(f"Ping failed with status code: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"Connection error: {str(e)}")
        return False

def get_metadata(api_key):
    # Test metadata endpoint
    metadata_url = "https://api.rango.exchange/api/v2/metadata"
    headers = {
        "Content-Type": "application/json",
        "api-key": api_key
    }
    try:
        response = requests.get(metadata_url, headers=headers)
        if response.status_code == 200:
            print("Metadata retrieved successfully!")
            return response.json()
        else:
            print(f"Metadata request failed with status code: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Metadata request error: {str(e)}")
        return None

if __name__ == "__main__":
    API_KEY = "YOUR_API_KEY_HERE"  # Replace with your actual API key
    
    if test_rango_connectivity(API_KEY):
        metadata = get_metadata(API_KEY)
        if metadata:
            print("Available blockchains:", [chain['name'] for chain in metadata['blockchains']])
