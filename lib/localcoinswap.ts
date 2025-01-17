import { Offer } from '../types/localcoinswap'; // Assuming you create a types file for type safety

const API_BASE_URL = 'https://api.localcoinswap.com/api/v2';

export async function getOffers(): Promise<Offer[]> {
  // Mock data for now, based on the API documentation
  const mockOffers: Offer[] = [
    {
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
      "uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24",
      "coin_currency": {
        "title": "Bitcoin",
        "symbol": "BTC",
        "symbol_filename": "btc.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "United States Dollar",
        "symbol": "USD",
        "symbol_filename": "None",
        "is_crypto": false
      },
      "payment_method": {
        "name": "PayPal",
        "slug": "paypal"
      },
      "country_code": "AW",
      "min_trade_size": 10,
      "max_trade_size": 2000,
      "trading_conditions": "Please be polite.",
      "headline": "",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": 240,
      "sms_required": false,
      "minimum_feedback": 0,
      "custodial_type": 0
    },
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
      "uuid": "eb0151b1-827b-475f-9e0e-a4765a4fcac8",
      "coin_currency": {
        "title": "Bitcoin",
        "symbol": "BTC",
        "symbol_filename": "btc.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "United States Dollar",
        "symbol": "USD",
        "symbol_filename": "None",
        "is_crypto": false
      },
      "payment_method": {
        "name": "Bank Transfer",
        "slug": "bank-transfers"
      },
      "country_code": "SG",
      "min_trade_size": 500,
      "max_trade_size": 5000,
      "trading_conditions": "Many other payment option available",
      "headline": "",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": 240,
      "sms_required": false,
      "minimum_feedback": 0,
      "custodial_type": 0
    },
    // ... more mock offers
  ];

  return mockOffers;

  // In the future, this will be replaced with actual API calls:
  // const response = await fetch(`${API_BASE_URL}/offers/`, {
  //   headers: {
  //     Authorization: `Token ${process.env.LOCALCOINSWAP_API_KEY}`,
  //   },
  // });
  // const data = await response.json();
  // return data.results;
}
