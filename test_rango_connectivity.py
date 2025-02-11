import requests
import os
from datetime import datetime

LOCALCOINSWAP_API_KEY = os.getenv('LCS_API_KEY')

def test_full_p2p_flow():
    # 1. Create test offer
    offer = requests.post(
        'https://api.localcoinswap.com/api/v2/offers/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'},
        json={
            "trading_type": "sell",
            "coin_currency": "BTC",
            "fiat_currency": "USD",
            "payment_method": "bank_transfer",
            "country_code": "US",
            "min_trade_size": 100,
            "max_trade_size": 1000,
            "pricing_type": "margin",
            "pricing_expression": "1.05",
            "trading_conditions": "Test offer - please ignore",
            "automatic_cancel_time": 60
        }
    ).json()
    
    # 2. Initiate trade
    trade = requests.post(
        'https://api.localcoinswap.com/api/v2/trades/non-custodial/create/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'},
        json={
            "offer": offer['uuid'],
            "fiat_amount": 150,
            "wallet_address": "tb1qtestaddress",
            "wallet_type": "web"
        }
    ).json()
    
    # 3. Verify escrow
    verify_res = requests.get(
        f'https://api.localcoinswap.com/api/v2/trades/{trade["uuid"]}/verify/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'}
    )
    
    # 4. Simulate payment completion
    payment_res = requests.post(
        f'https://api.localcoinswap.com/api/v2/trades/{trade["uuid"]}/payment/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'},
        json={"proof": "bank_transfer_12345"}
    )
    
    # 5. Release escrow
    release_res = requests.post(
        f'https://api.localcoinswap.com/api/v2/trades/{trade["uuid"]}/release/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'}
    )
    
    # 6. Submit feedback
    feedback_res = requests.post(
        'https://api.localcoinswap.com/api/v2/trades/feedback/create/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'},
        json={
            "trade": trade['uuid'],
            "rating": 5,
            "feedback": "Automated test feedback"
        }
    )

    # Cleanup
    requests.delete(
        f'https://api.localcoinswap.com/api/v2/offers/{offer["uuid"]}/',
        headers={'Authorization': f'Token {LOCALCOINSWAP_API_KEY}'}
    )

    return {
        "offer": offer['uuid'],
        "trade": trade['uuid'],
        "status": release_res.status_code == 200,
        "feedback": feedback_res.status_code == 201
    }

if __name__ == "__main__":
    result = test_full_p2p_flow()
    print("Test results:", result)
