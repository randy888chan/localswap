# LocalCoinSwap Exchange API

# Introduction

This API provides complete functionality for the LocalCoinSwap exchange. You can use this API to search for offers, manage your offers, and automate the trading process.

This API supports non-custodial trading in Bitcoin, Ethereum, Kusama, and all ERC20's.

This API supports custodial trading in Bitcoin & Dash.

We have a dedicated [examples repository](https://github.com/LocalCoinSwap/api-examples) for this API, which we will update whenever you ask us to. If you want to use our API to do something and you don't know how, just raise a [Github issue](https://github.com/LocalCoinSwap/api-examples/issues/new) and we will update the repository with an example of how to use the API to achieve your use-case. We will create your example in either Python or Javascript, or maybe even both.

We are a fast-moving company and updates may be made to this API on short notice for various reasons. However, we will endevour to remain backwards compatible where possible.

Don't hesistate to get in touch with us if you need more help using the API, or if you have a specific use-case the API does not cover. We are always interested in making our products easier for you to use, and are happy to update or modify the API itself to assist you in your programming goals.

The API uses JWT Token Authentication scheme. Use the following steps to generate a token:

1. How to generate API Token:
   
   - Register on [LocalCoinSwap](https://localcoinswap.com/register/)
   - Login to your account and go to [Preferences](https://localcoinswap.com/preferences/)
   - Click on the **API** tab and then click on the **Generate Token** button
   - Note down the token

2. Include the returned token in the `Authorization` HTTP header as follows:
   
   ```HTTP
   Authorization: Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9
   ```

3. Unauthenticated responses that are denied permission will result in an HTTP 401 Unauthorized response, with an appropriate WWW-Authenticate header. For example:
   
   ```HTTP
   WWW-Authenticate: Token
   ```
   
   ```json
   {
   "message": "Authentication credentials were not provided.",
   "code": "not_authenticated",
   "error": true
   }
   ```

Simple example of accessing a secured endpoint using Javascript (ES6):

```javascript
import axios from "axios";

async function examplePost() {
  const url = "https://api.localcoinswap.com/api/v2/notifs-seen/";
  const result = await axios.get(
    url, {headers: {"Authorization": "Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9"}}
  )
}

examplePost()
```

# Currencies

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

- 200

{
  "active_page": 1,
  "count": 9,
  "next": "https://api.localcoinswap.com/api/v2/currencies/active-cryptos/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 2,
  "results": [
    {
      "id": 1,
      "title": "Bitcoin",
      "symbol": "BTC",
      "symbol_filename": "btc.svg",
      "is_crypto": true,
      "withdraw_fee": "0.000070000000000000",
      "minimum_withdrawal": "0.001000000000000000",
      "slug": "bitcoin-BTC",
      "active_status": "currency_active"
    },
    {
      "id": 2,
      "title": "Ethereum",
      "symbol": "ETH",
      "symbol_filename": "eth.svg",
      "is_crypto": true,
      "withdraw_fee": "0.002000000000000000",
      "minimum_withdrawal": "0.007830853563000000",
      "slug": "ethereum-ETH",
      "active_status": "currency_active"
    },
    {
      "id": 15,
      "title": "Dash",
      "symbol": "DASH",
      "symbol_filename": "dash.svg",
      "is_crypto": true,
      "withdraw_fee": "0.000500000000000000",
      "minimum_withdrawal": "0.001000000000000000",
      "slug": "dash-DASH",
      "active_status": "currency_active"
    },
    {
      "id": 19,
      "title": "Tether",
      "symbol": "USDT",
      "symbol_filename": "usdt.svg",
      "is_crypto": true,
      "withdraw_fee": "1.000000000000000000",
      "minimum_withdrawal": "3.000000000000000000",
      "slug": "tether-USDT",
      "active_status": "currency_active"
    },
    {
      "id": 23,
      "title": "Dai Stablecoin",
      "symbol": "DAI",
      "symbol_filename": "dai.svg",
      "is_crypto": true,
      "withdraw_fee": "1.000000000000000000",
      "minimum_withdrawal": "3.000000000000000000",
      "slug": "dai-stablecoin-DAI",
      "active_status": "currency_active"
    }
  ]
}

application/json

## Cryptocurrencies.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 28,
  "next": "https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 6,
  "results": [
    {
      "title": "Bitcoin",
      "symbol": "BTC",
      "symbol_filename": "btc.svg",
      "is_crypto": true
    },
    {
      "title": "Ethereum",
      "symbol": "ETH",
      "symbol_filename": "eth.svg",
      "is_crypto": true
    },
    {
      "title": "Dash",
      "symbol": "DASH",
      "symbol_filename": "dash.svg",
      "is_crypto": true
    },
    {
      "title": "Monero",
      "symbol": "XMR",
      "symbol_filename": "None",
      "is_crypto": true
    },
    {
      "title": "Tether",
      "symbol": "USDT",
      "symbol_filename": "usdt.svg",
      "is_crypto": true
    }
  ]
}

## Local currencies.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 168,
  "next": "https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 34,
  "results": [
    {
      "title": "Afghan Afghani",
      "symbol": "AFN",
      "symbol_filename": "None",
      "is_crypto": false
    },
    {
      "title": "Albanian Lek",
      "symbol": "ALL",
      "symbol_filename": "None",
      "is_crypto": false
    },
    {
      "title": "Algerian Dinar",
      "symbol": "DZD",
      "symbol_filename": "None",
      "is_crypto": false
    },
    {
      "title": "Angolan Kwanza",
      "symbol": "AOA",
      "symbol_filename": "None",
      "is_crypto": false
    },
    {
      "title": "Argentine Peso",
      "symbol": "ARS",
      "symbol_filename": "None",
      "is_crypto": false
    }
  ]
}

## Cryptocurrency details.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/currencies/LCS/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "id": 3,
  "title": "LCS Cryptoshares",
  "symbol": "LCS",
  "symbol_filename": "lcs.svg",
  "is_crypto": true,
  "withdraw_fee": "38.000000000000000000",
  "minimum_withdrawal": "99.000000000000000000",
  "metadata": {
    "banner_image": "/media/currency/start_trading_lcs.png",
    "about": "Cryptoshares (LCS) are the native currency of the LocalCoinSwap platform",
    "official_website": "https://localcoinswap.com/",
    "initial_release": 1523750400,
    "min_unit_name": "None",
    "total_supply": 72732420,
    "circulating_supply": 40211430,
    "cmc_analytics": {
      "id": 3,
      "symbol": "LCS",
      "usd_price": "0.0093986938",
      "usd_market_cap": "492841.1945892310",
      "usd_volume_24h": "8037.5140275405",
      "percent_change_1h": "0.9349020000",
      "percent_change_24h": "2.4310200000",
      "percent_change_7d": "26.4646000000",
      "usd_last_updated": 1597384689,
      "last_updated": 1597384789
    }
  },
  "slug": "lcs-cryptoshares-LCS"
}

# Wallets

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"currency": 19, "from_address": "0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/wallets/allowance-reset/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "currency": "string",
  "from_address": "string"
}

## wallets_allowance_read

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| crypto_slug<br><br>required | string |
| --------------------------- | ------ |

### Responses

**200**

GET/wallets/allowance/{crypto_slug}/

https://api.localcoinswap.com/api/v2/wallets/allowance/{crypto_slug}/

## wallets_approve-allowance_create

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| crypto_slug<br><br>required | string |
| --------------------------- | ------ |

### Responses

**201**

POST/wallets/approve-allowance/{crypto_slug}/

https://api.localcoinswap.com/api/v2/wallets/approve-allowance/{crypto_slug}/

## wallets_balance_read

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| currency_slug<br><br>required | string |
| ----------------------------- | ------ |

### Responses

**200**

GET/wallets/balance/{currency_slug}/

https://api.localcoinswap.com/api/v2/wallets/balance/{currency_slug}/

## wallets_broadcast-trx-tx_create

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### REQUEST BODY SCHEMA: application/json

| signed_tx<br><br>required | object (Signed tx) |
| ------------------------- | ------------------ |

### Responses

**201**

##### RESPONSE SCHEMA: application/json

## Create a custodial wallet withdrawal.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"currency": 2, "to_address": "0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e", "amount": "0.001"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/wallets/custodial-withdrawal/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "id": 0,
  "otp": "string",
  "currency": 0,
  "to_chip": "string",
  "to_address": "string",
  "amount": "string",
  "fee": 0,
  "is_confirmed": true,
  "is_validated": true,
  "is_reverted": true,
  "payment_id": "string",
  "withdrawal_tx_hash": "string"
}

## wallets_non-custodial_read

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| currency_slug<br><br>required | string |
| ----------------------------- | ------ |

### Responses

**200**

## Publish transaction to blockchain.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"currency": 1, "signed_tx": "0200000001a4af9f3fc589ba79017ac1beeedc9798fb712891a89a92db03c62de9ae871af5010000006b483045022100bda30f6e23d11da838fb6f42f5ec798e6f48010488cc884f2d4dba36a0739f0702201ced67c70c12ef6ac007d611292585330e619cbd9508c8a37194a7b7d5bb14b201210294508ab61f9d3759b7de2b43e287eda9e0afc3c2b5dcbc15b25ddcf7b812ba58fdffffff02204e0000000000001976a914bcc3f41e0d9b523fece5004531b783e85ed9855288ac99299c0e000000001976a91413b18b29c4c4681a950b5c30fa9f507937a686a988ac40d20900"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/wallets/publish/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "status": "successful",
  "data": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed",
  "error": false,
  "tx": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed"
}

## wallets_request-withdrawal-otp_create

https://api.localcoinswap.com/api/v2/wallets/request-withdrawal-otp/

### Request samples

Payload

{}

### Response samples

{
  "user_id": "string"
}

## wallets_resolve-ns_create

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

**201**

## Prepare unsigned transaction.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"currency": 2, "to_address": "0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e", "from_address": "0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0", "gas_price": 122000000000, "gas_limit": 21000, "amount": "0.001"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/wallets/unsigned/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "tx": {
    "to": "0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e",
    "value": 1000000000000000,
    "gas": 21000,
    "gasPrice": 122000000000,
    "nonce": 27
  },
  "fromAddress": "0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0"
}

## Watch btc withdrawal txn trigger.

Used by the watcher to trigger tx confirmation.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

**201**

# Offers

Offers are listed on LocalCoinSwap listings for other traders to respond to.

#### Following operations are possible using Offers:

```
- Create
- Edit
- Delete
- Read
- Search
```

## Get your offers.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 9112,
  "next": "https://api.localcoinswap.com/api/v2/offers/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 1823,
  "results": [
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
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
        "name": "Bitcoin (BTC)",
        "slug": "bitcoin-btc"
      },
      "location_name": "Mountain View",
      "country_code": "US",
      "coordinates": {
        "latitude": 37.3860517,
        "longitude": -122.0838511
      },
      "min_trade_size": "100.0000000000",
      "max_trade_size": "1000.0000000000",
      "trading_conditions": "Send me your bitcoin",
      "headline": "Bitcoin trading",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": "240",
      "sms_required": false,
      "minimum_feedback": "0"
    },
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
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
        "name": "Payoneer",
        "slug": "payoneer"
      },
      "location_name": "",
      "country_code": "US",
      "coordinates": {
        "latitude": 37.09024,
        "longitude": -95.712891
      },
      "min_trade_size": "50.0000000000",
      "max_trade_size": "400.0000000000",
      "trading_conditions": "Trade with us with Payoneer, fast transfer under 10 minuts",
      "headline": "",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": "240",
      "sms_required": false,
      "minimum_feedback": "0"
    },
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
      "coin_currency": {
        "title": "Bitcoin",
        "symbol": "BTC",
        "symbol_filename": "btc.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "Australian Dollar",
        "symbol": "AUD",
        "symbol_filename": "None",
        "is_crypto": false
      },
      "payment_method": {
        "name": "PayID",
        "slug": "payid"
      },
      "location_name": "Sydney",
      "country_code": "AU",
      "coordinates": {
        "latitude": -33.8688197,
        "longitude": 151.2092955
      },
      "min_trade_size": "100.0000000000",
      "max_trade_size": "100.0000000000",
      "trading_conditions": "BTC AUD Buy Now Cash Deposit CBA Australia\n\nPay via PAYID (Australia)\nAustralian Cash Deposit via CBA ATM. \nAfter deposit is made BTC will be released to you instantly. \nAustralian Buyers Only. Scammers will be prosecuted.",
      "headline": "",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": "240",
      "sms_required": false,
      "minimum_feedback": "0"
    },
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
      "coin_currency": {
        "title": "Bitcoin",
        "symbol": "BTC",
        "symbol_filename": "btc.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "Australian Dollar",
        "symbol": "AUD",
        "symbol_filename": "None",
        "is_crypto": false
      },
      "payment_method": {
        "name": "Cash Deposit",
        "slug": "cash-deposit"
      },
      "location_name": "Sydney",
      "country_code": "AU",
      "coordinates": {
        "latitude": -33.8688197,
        "longitude": 151.2092955
      },
      "min_trade_size": "100.0000000000",
      "max_trade_size": "100.0000000000",
      "trading_conditions": "Australian Cash Deposit via CBA ATM.\nAfter deposit is made BTC will be released to you instantly.\nAustralian Buyers Only.\nScammers will be prosecuted.",
      "headline": "Instant Release BTC AUD Buy Now Cash Deposit CBA Australia",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": "240",
      "sms_required": false,
      "minimum_feedback": "0"
    },
    {
      "trading_type": {
        "slug": "sell",
        "name": "sell",
        "opposite_name": "buy"
      },
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
        "name": "Cash App (Square Cash)",
        "slug": "cash-app-square-cash"
      },
      "location_name": "Clearwater",
      "country_code": "US",
      "coordinates": {
        "latitude": 27.9658533,
        "longitude": -82.8001026
      },
      "min_trade_size": "5.0000000000",
      "max_trade_size": "200.0000000000",
      "trading_conditions": "Flordia Kid",
      "headline": "",
      "hidden": false,
      "enforced_sizes": "",
      "automatic_cancel_time": "240",
      "sms_required": false,
      "minimum_feedback": "0"
    }
  ]
}

## Create offer.

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"trading_type": "buy", "coin_currency": "BTC", "fiat_currency": "USD", "payment_method": "PayPal", "country_code": "AW", "min_trade_size": 10, "max_trade_size": 2000, "pricing_type": "MARGIN", "pricing_market": "cmc", "pricing_expression": "2", "trading_conditions": "Please be polite.", "trading_hours_type": "daily", "trading_hours_json": {"anyday": {"from": "08:30", "to": "21:00"}}});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

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
}

## Calculate advanced price.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"expression": "market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1)"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/dryrun-expression/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "price": "12863.983"
}

## Get price for market.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"pricing_market": "cmc", "coin_currency": "ETH", "fiat_currency": "USD", "margin_percent": "10"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/dryrun-formula/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

## offers_featured_list

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 912,
  "next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 183,
  "results": [
    {
      "uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24",
      "created_by": {
        "username": "Taylor",
        "activity_status": "recently-active",
        "activity_tooltip": "Seen 53\\xa0minutes ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 27,
        "last_seen": 1597396837,
        "is_legacy": false,
        "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
        "completed_trades": 32
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "",
      "country_code": "AW",
      "min_trade_size": "10.0000000000",
      "max_trade_size": "2000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-aruba"
    },
    {
      "uuid": "eb0151b1-827b-475f-9e0e-a4765a4fcac8",
      "created_by": {
        "username": "Benbands",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 4\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 3219,
        "last_seen": 1597384804,
        "is_legacy": false,
        "user_uuid": "01f9ac81-c46b-4bf6-b4f9-e310cfe4ab7e",
        "completed_trades": 0
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "",
      "country_code": "SG",
      "min_trade_size": "500.0000000000",
      "max_trade_size": "5000.0000000000",
      "headline": "Many other payment option available",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-singapore"
    },
    {
      "uuid": "92215a31-fc4e-4c4e-87aa-828ed5bfbe72",
      "created_by": {
        "username": "Shiee",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 8\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 0,
        "last_seen": 1597369701,
        "is_legacy": false,
        "user_uuid": "f5b1d2d4-f1cd-45fa-947d-b7b821c0db10",
        "completed_trades": 0
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "Mountain View",
      "country_code": "US",
      "min_trade_size": "200.0000000000",
      "max_trade_size": "3000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "14648.300236625",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    },
    {
      "uuid": "c5bb94cd-9807-4a84-9fc1-c6840e0477a6",
      "created_by": {
        "username": "sgornick",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 1\\xa0day, 13\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 518,
        "last_seen": 1597265143,
        "is_legacy": false,
        "user_uuid": "149a48c6-4a21-4366-af18-06efb6eb25f6",
        "completed_trades": 6
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
        "name": "Cash in person",
        "slug": "cash-in-person"
      },
      "location_name": "San Diego",
      "country_code": "US",
      "min_trade_size": "20.0000000000",
      "max_trade_size": "1000.0000000000",
      "headline": "San Diego, CA | Sell BTC for cash (USD), in-person",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11601.008100000001",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    },
    {
      "uuid": "b9c1cb3b-7542-43c2-89c6-a1a6bf09afbb",
      "created_by": {
        "username": "Soas14",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 1\\xa0day, 19\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 0,
        "last_seen": 1597243312,
        "is_legacy": false,
        "user_uuid": "f5c7370d-4f5e-4fc7-8ea5-b990db506029",
        "completed_trades": 1
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
        "name": "Cash App (Square Cash)",
        "slug": "cash-app-square-cash"
      },
      "location_name": "Islip",
      "country_code": "US",
      "min_trade_size": "1000.0000000000",
      "max_trade_size": "3000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    }
  ]
}

## offers_new-offer_list

Get data for rendering the new offer page.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### QUERY PARAMETERS

| limit  | integer<br><br>Number of results to return per page.               |
| ------ | ------------------------------------------------------------------ |
| offset | integer<br><br>The initial index from which to return the results. |

### Responses

**200**

## Payment methods.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/payment-methods/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 262,
  "next": "https://api.localcoinswap.com/api/v2/offers/payment-methods/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 53,
  "results": [
    {
      "name": "Abra",
      "slug": "abra"
    },
    {
      "name": "AccountNow Card2Card Transfer",
      "slug": "accountnow-card2card-transfer"
    },
    {
      "name": "Adidas Gift Card",
      "slug": "adidas-gift-card"
    },
    {
      "name": "AdvCash",
      "slug": "advcash"
    },
    {
      "name": "Airbnb Gift Card",
      "slug": "airbnb-gift-card"
    }
  ]
}

## offers_search-data_list

Get data for rendering the search form.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### QUERY PARAMETERS

| limit  | integer<br><br>Number of results to return per page.               |
| ------ | ------------------------------------------------------------------ |
| offset | integer<br><br>The initial index from which to return the results. |

### Responses

**200**

## Search all offers.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 912,
  "next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 183,
  "results": [
    {
      "uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24",
      "created_by": {
        "username": "Taylor",
        "activity_status": "recently-active",
        "activity_tooltip": "Seen 53\\xa0minutes ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 27,
        "last_seen": 1597396837,
        "is_legacy": false,
        "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
        "completed_trades": 32
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "",
      "country_code": "AW",
      "min_trade_size": "10.0000000000",
      "max_trade_size": "2000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-aruba"
    },
    {
      "uuid": "eb0151b1-827b-475f-9e0e-a4765a4fcac8",
      "created_by": {
        "username": "Benbands",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 4\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 3219,
        "last_seen": 1597384804,
        "is_legacy": false,
        "user_uuid": "01f9ac81-c46b-4bf6-b4f9-e310cfe4ab7e",
        "completed_trades": 0
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "",
      "country_code": "SG",
      "min_trade_size": "500.0000000000",
      "max_trade_size": "5000.0000000000",
      "headline": "Many other payment option available",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-singapore"
    },
    {
      "uuid": "92215a31-fc4e-4c4e-87aa-828ed5bfbe72",
      "created_by": {
        "username": "Shiee",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 8\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 0,
        "last_seen": 1597369701,
        "is_legacy": false,
        "user_uuid": "f5b1d2d4-f1cd-45fa-947d-b7b821c0db10",
        "completed_trades": 0
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
      "location_name": "Mountain View",
      "country_code": "US",
      "min_trade_size": "200.0000000000",
      "max_trade_size": "3000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "14648.300236625",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    },
    {
      "uuid": "c5bb94cd-9807-4a84-9fc1-c6840e0477a6",
      "created_by": {
        "username": "sgornick",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 1\\xa0day, 13\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 518,
        "last_seen": 1597265143,
        "is_legacy": false,
        "user_uuid": "149a48c6-4a21-4366-af18-06efb6eb25f6",
        "completed_trades": 6
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
        "name": "Cash in person",
        "slug": "cash-in-person"
      },
      "location_name": "San Diego",
      "country_code": "US",
      "min_trade_size": "20.0000000000",
      "max_trade_size": "1000.0000000000",
      "headline": "San Diego, CA | Sell BTC for cash (USD), in-person",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11601.008100000001",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    },
    {
      "uuid": "b9c1cb3b-7542-43c2-89c6-a1a6bf09afbb",
      "created_by": {
        "username": "Soas14",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 1\\xa0day, 19\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 0,
        "last_seen": 1597243312,
        "is_legacy": false,
        "user_uuid": "f5c7370d-4f5e-4fc7-8ea5-b990db506029",
        "completed_trades": 1
      },
      "trading_type": {
        "slug": "buy",
        "name": "buy",
        "opposite_name": "sell"
      },
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
        "name": "Cash App (Square Cash)",
        "slug": "cash-app-square-cash"
      },
      "location_name": "Islip",
      "country_code": "US",
      "min_trade_size": "1000.0000000000",
      "max_trade_size": "3000.0000000000",
      "headline": "",
      "sms_required": false,
      "minimum_feedback": "0",
      "price_formula_value": "11484.267385514",
      "slug": "sell-bitcoin-btc-for-usd-in-united-states"
    }
  ]
}

## Get all search index offer slugs.

We use this endpoint for sitemap generation.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

[
  {
    "uuid": "string",
    "slug": "string"
  }
]

## Trade types.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/trade-types/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 2,
  "next": "None",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 1,
  "results": [
    {
      "slug": "buy",
      "name": "buy",
      "opposite_name": "sell"
    },
    {
      "slug": "sell",
      "name": "sell",
      "opposite_name": "buy"
    }
  ]
}

## Get offer by UUID.

### Request samples

var myHeaders = new Headers();

myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/9fd021ae-2339-4285-aa67-d4937a6b0012/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "trading_type": {
    "slug": "sell",
    "name": "sell",
    "opposite_name": "buy"
  },
  "coin_currency": {
    "title": "Ethereum",
    "symbol": "ETH",
    "symbol_filename": "eth.svg",
    "is_crypto": true
  },
  "fiat_currency": {
    "title": "United States Dollar",
    "symbol": "USD",
    "symbol_filename": "None",
    "is_crypto": false
  },
  "payment_method": {
    "name": "Cash Deposit",
    "slug": "cash-deposit"
  },
  "location_name": "Ahmedabad",
  "country_code": "IN",
  "coordinates": {
    "latitude": 23.022505,
    "longitude": 72.5713621
  },
  "min_trade_size": "100.0000000000",
  "max_trade_size": "10000.0000000000",
  "trading_conditions": "",
  "headline": "",
  "hidden": true,
  "enforced_sizes": "",
  "automatic_cancel_time": "240",
  "sms_required": false,
  "minimum_feedback": "0"
}

## Update offer by UUID.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"trading_type": "buy", "coin_currency": "BTC", "fiat_currency": "AUD", "payment_method": "PayPal", "country_code": "AU", "min_trade_size": 10, "max_trade_size": 5000, "pricing_type": "MARGIN", "pricing_market": "cmc", "pricing_expression": "2", "trading_conditions": "Please be polite.", "trading_hours_type": "daily", "trading_hours_json": {"anyday": {"from": "08:30", "to": "21:00"}}});

var requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/{uuid}/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24",
  "created_by": {
    "username": "Taylor",
    "local_currency_symbol": "AUD",
    "activity_status": "active",
    "activity_tooltip": "Seen a second ago",
    "is_email_verified": true,
    "is_phone_verified": false,
    "avg_response_time": 27,
    "completed_trades": 32,
    "last_seen": 1597401286,
    "is_legacy": false,
    "bio": "",
    "is_superuser": true,
    "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
    "primary_language": "en",
    "on_holiday": false,
    "sound_notifications": true,
    "nc_pw_reset_done": true
  },
  "is_active": true,
  "is_available": true,
  "fiat_currency": {
    "id": 10001,
    "title": "United States Dollar",
    "symbol": "USD",
    "symbol_filename": "None",
    "is_crypto": false,
    "withdraw_fee": "None",
    "minimum_withdrawal": "None",
    "slug": "united-states-dollar",
    "active_status": "currency_active"
  },
  "coin_currency": {
    "id": 1,
    "title": "Bitcoin",
    "symbol": "BTC",
    "symbol_filename": "btc.svg",
    "is_crypto": true,
    "withdraw_fee": "0.000300000000000000",
    "minimum_withdrawal": "0.001000000000000000",
    "slug": "bitcoin-BTC",
    "active_status": "currency_active"
  },
  "payment_method": {
    "id": 9,
    "name": "PayPal",
    "priority": 460,
    "slug": "paypal",
    "icon_filename": "None",
    "high_risk": true,
    "type": 3
  },
  "trading_type": {
    "id": 1,
    "slug": "buy",
    "name": "buy",
    "action_name": "Buying",
    "opposite_name": "sell",
    "opposite_action_name": "Selling"
  },
  "trading_hours": "Mon - Sun: 12:00 am  - 11:00 am , 10:30 pm  - 12:00 am (next day)<br />\n",
  "min_trade_size": "10.0000000000",
  "max_trade_size": "2000.0000000000",
  "enforced_sizes": "",
  "trading_conditions": "Please be polite.",
  "location_name": "",
  "country_code": "AW",
  "price_formula_value": "11507.622373702",
  "price_formula": {
    "display_formula": "-2",
    "prefix_formula": "exchange.btcusd|v||exchange.usdusd|v||*|o||0.98|n||*|o",
    "pricing_type": "MARGIN",
    "market": "cmc"
  },
  "automatic_cancel_time": "240",
  "sms_required": false,
  "only_friends": false,
  "minimum_feedback": "0",
  "min_fiat_limit": 10,
  "max_fiat_limit": 2000,
  "current_price": "11507.6223737020",
  "current_price_usd": "11507.6223737020",
  "slug": "sell-bitcoin-btc-for-usd-in-aruba",
  "trading_hours_bits": "111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111",
  "trading_hours_localised": "Mon - Sun: 8:30 am  - 9:00 pm <br />\n",
  "trading_hours_bits_localised": "000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000",
  "hidden": false,
  "is_deleted": false,
  "coordinates": {
    "latitude": -70.0201,
    "longitude": 12.5391
  },
  "current_margin_percentage": "-2.0000000000",
  "headline": "",
  "custodial_type": 0
}

## Delete offer by UUID.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/offers/678ac0c8-07d1-4aba-9213-2f083059fc7f", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

# Profiles

## Encrypted blob.

### Request samples

var myHeaders = new Headers();

myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/profile/encrypted-blob/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "salt": "string",
  "iterations": 0,
  "initialization_vector": "string",
  "encrypted_account_key": "string",
  "public_identity_key": "string",
  "encrypted_mnemonic": "string",
  "encrypted_mnemonic_256": "string",
  "encrypted_mnemonic_iv": "string"
}

## Get all search index profile slugs.

We use this endpoint for sitemap generation.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

**200**

##### RESPONSE SCHEMA: application/json

Array 

| username<br><br>required | string (Username) [ 1 .. 150 ] characters ^[\w.@+-]+$<br><br>Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |

## profile_update-username_partial_update

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| user_uuid<br><br>required | string |
| ------------------------- | ------ |

##### REQUEST BODY SCHEMA: application/json

| username<br><br>required | string (Username) [ 3 .. 14 ] characters ^[A-Za-z0-9_]+$ |
| ------------------------ | -------------------------------------------------------- |

### Responses

**200**

##### RESPONSE SCHEMA: application/json

| username<br><br>required | string (Username) [ 3 .. 14 ] characters ^[A-Za-z0-9_]+$ |
| ------------------------ | -------------------------------------------------------- |

# Trades

## Submit feeback on trade.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"rating": "5", "feedback": "Great trade!", "trade": "d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/feedback/create/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "feedback_for": {
    "username": "review1",
    "local_currency_symbol": "USD",
    "bio": "",
    "is_staff": false,
    "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
    "date_joined": "2020-02-21T02:59:17.630488Z",
    "primary_language": "en",
    "non_custodial": true
  },
  "rating": "5.0",
  "feedback": "Great trade!",
  "feedback_by": {
    "username": "Taylor",
    "local_currency_symbol": "AUD",
    "bio": "",
    "is_staff": true,
    "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
    "date_joined": "2018-09-09T23:14:24.244501Z",
    "primary_language": "en",
    "non_custodial": true
  },
  "id": 7780,
  "rating_percentage": 100,
  "time_created": 1597403044,
  "trade": "0638cfd3-5e4b-49d9-8fb0-a2dc80f014ba"
}

## List trade feedbacks.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/feedback/list/?feedback_for=3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 0,
  "next": "None",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 0,
  "results": [
    [
      {
        "feedback_for": {
          "username": "Taylor",
          "local_currency_symbol": "AUD",
          "bio": "",
          "is_staff": true,
          "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
          "date_joined": "2018-09-09T23:14:24.244501Z",
          "primary_language": "en",
          "non_custodial": true
        },
        "rating": "5.0",
        "feedback": "Great trade",
        "feedback_by": {
          "username": "review1",
          "local_currency_symbol": "USD",
          "bio": "",
          "is_staff": false,
          "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
          "date_joined": "2020-02-21T02:59:17.630488Z",
          "primary_language": "en",
          "non_custodial": true
        },
        "id": 7781,
        "rating_percentage": 100,
        "time_created": 1597403339,
        "trade": "0638cfd3-5e4b-49d9-8fb0-a2dc80f014ba"
      },
      {
        "feedback_for": {
          "username": "Taylor",
          "local_currency_symbol": "AUD",
          "bio": "",
          "is_staff": true,
          "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
          "date_joined": "2018-09-09T23:14:24.244501Z",
          "primary_language": "en",
          "non_custodial": true
        },
        "rating": "5.0",
        "feedback": "review",
        "feedback_by": {
          "username": "review1",
          "local_currency_symbol": "USD",
          "bio": "",
          "is_staff": false,
          "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
          "date_joined": "2020-02-21T02:59:17.630488Z",
          "primary_language": "en",
          "non_custodial": true
        },
        "id": 7619,
        "rating_percentage": 100,
        "time_created": 1597115982,
        "trade": "82ca2908-4dfa-4e68-9bc7-2f1e548946bd"
      }
    ]
  ]
}

## trades_history-metrics_read

Get metrics for trade history with this user.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| username<br><br>required | string |
| ------------------------ | ------ |

### Responses

**200**

## Download trade history.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/history/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

csv file

## List trades.

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/list?coin_currency=2&amp;stage=live/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 75,
  "next": "https://api.localcoinswap.com/api/v2/trades/list/?limit=5&offset=5",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 15,
  "results": [
    {
      "status": "EXPIRED",
      "uuid": "14cc3377-6bd6-4ff1-97a7-5b8bcbe23079",
      "buyer": {
        "username": "nathan",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 2\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 362,
        "last_seen": 1597396895,
        "is_legacy": false,
        "user_uuid": "5982337e-14eb-47b7-a712-99cb7bc7e164"
      },
      "seller": {
        "username": "Taylor",
        "activity_status": "active",
        "activity_tooltip": "Seen 3\\xa0minutes ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 27,
        "last_seen": 1597404200,
        "is_legacy": false,
        "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba"
      },
      "fiat_amount": "10.000000000000000000",
      "coin_amount": "0.010000000000000000",
      "time_created": 1590047139,
      "coin_currency": {
        "title": "Ethereum",
        "symbol": "ETH",
        "symbol_filename": "eth.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "British Pound",
        "symbol": "GBP",
        "symbol_filename": "None",
        "is_crypto": false
      }
    },
    {
      "status": "REJECTED",
      "uuid": "c502cd3b-3246-40e5-a4ae-1e3931291ee2",
      "buyer": {
        "username": "nathan",
        "activity_status": "inactive",
        "activity_tooltip": "Seen 2\\xa0hours ago",
        "is_email_verified": true,
        "is_phone_verified": true,
        "avg_response_time": 362,
        "last_seen": 1597396895,
        "is_legacy": false,
        "user_uuid": "5982337e-14eb-47b7-a712-99cb7bc7e164"
      },
      "seller": {
        "username": "Taylor",
        "activity_status": "active",
        "activity_tooltip": "Seen 3\\xa0minutes ago",
        "is_email_verified": true,
        "is_phone_verified": false,
        "avg_response_time": 27,
        "last_seen": 1597404200,
        "is_legacy": false,
        "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba"
      },
      "fiat_amount": "10.000000000000000000",
      "coin_amount": "0.010000000000000000",
      "time_created": 1590055104,
      "coin_currency": {
        "title": "Ethereum",
        "symbol": "ETH",
        "symbol_filename": "eth.svg",
        "is_crypto": true
      },
      "fiat_currency": {
        "title": "British Pound",
        "symbol": "GBP",
        "symbol_filename": "None",
        "is_crypto": false
      }
    }
  ]
}

## Get trade message object.

To get the trade message object by its id.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| message_id<br><br>required | string |
| -------------------------- | ------ |

### Response samples

{
  "id": 0,
  "content": "string",
  "attachment": "string",
  "time_created": 0,
  "created_by": {
    "username": "string",
    "timezone": "string",
    "local_currency_symbol": "string",
    "bio": "string",
    "is_staff": true,
    "is_superuser": true,
    "is_email_verified": "string",
    "last_seen": 0,
    "cached_last_seen": "string",
    "profile_image": "http://example.com",
    "activity_status": "string",
    "activity_tooltip": "string",
    "feedback_score": "string",
    "completed_trades": 0,
    "trades_30d": 0,
    "platform_volume": "string",
    "platform_volume_30d": "string",
    "avg_response_time": 0,
    "user_uuid": "string",
    "date_joined": "2025-02-10T19:10:49Z",
    "is_phone_verified": "string",
    "is_legacy": true,
    "primary_language": "en",
    "lang_list": "string",
    "times_blocked": 0,
    "times_followed": 0,
    "imported_total_trades": 0,
    "imported_volume": "string",
    "on_holiday": true,
    "non_custodial": true,
    "xp_level": "NEWBIE",
    "xp": 0,
    "stats": "string"
  },
  "recipient": {
    "username": "string",
    "timezone": "string",
    "local_currency_symbol": "string",
    "bio": "string",
    "is_staff": true,
    "is_superuser": true,
    "is_email_verified": "string",
    "last_seen": 0,
    "cached_last_seen": "string",
    "profile_image": "http://example.com",
    "activity_status": "string",
    "activity_tooltip": "string",
    "feedback_score": "string",
    "completed_trades": 0,
    "trades_30d": 0,
    "platform_volume": "string",
    "platform_volume_30d": "string",
    "avg_response_time": 0,
    "user_uuid": "string",
    "date_joined": "2025-02-10T19:10:49Z",
    "is_phone_verified": "string",
    "is_legacy": true,
    "primary_language": "en",
    "lang_list": "string",
    "times_blocked": 0,
    "times_followed": 0,
    "imported_total_trades": 0,
    "imported_volume": "string",
    "on_holiday": true,
    "non_custodial": true,
    "xp_level": "NEWBIE",
    "xp": 0,
    "stats": "string"
  }
}

## List trade messages.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/message/list/8e35e145-44b6-48a6-903e-a340b5c61384/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "active_page": 1,
  "count": 3,
  "next": "None",
  "previous": "None",
  "offset": 0,
  "limit": 5,
  "total_pages": 1,
  "results": [
    {
      "content": "test 2, good idea dude",
      "attachment": "None",
      "time_created": 1597212069,
      "created_by": {
        "username": "review1",
        "timezone": "Europe/London",
        "local_currency_symbol": "USD",
        "bio": "",
        "is_staff": false,
        "is_superuser": false,
        "is_email_verified": true,
        "last_seen": 1597403340,
        "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
        "activity_status": "active",
        "activity_tooltip": "Seen 24\\xa0minutes ago",
        "feedback_score": 5,
        "completed_trades": 22,
        "avg_response_time": 13,
        "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
        "languages": [],
        "date_joined": "2020-02-21T02:59:17.630488Z",
        "is_phone_verified": false,
        "is_legacy": false,
        "primary_language": "en",
        "times_blocked": 0,
        "times_followed": 0,
        "imported_total_trades": "None",
        "imported_estimated_volume": "None",
        "on_holiday": false,
        "non_custodial": true
      },
      "recipient": "None"
    },
    {
      "content": "test",
      "attachment": "None",
      "time_created": 1597212026,
      "created_by": {
        "username": "Taylor",
        "timezone": "Australia/Sydney",
        "local_currency_symbol": "AUD",
        "bio": "",
        "is_staff": true,
        "is_superuser": true,
        "is_email_verified": true,
        "last_seen": 1597404437,
        "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
        "activity_status": "active",
        "activity_tooltip": "Seen 5\\xa0minutes ago",
        "feedback_score": 5,
        "completed_trades": 32,
        "avg_response_time": 27,
        "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
        "languages": [],
        "date_joined": "2018-09-09T23:14:24.244501Z",
        "is_phone_verified": false,
        "is_legacy": false,
        "primary_language": "en",
        "times_blocked": 0,
        "times_followed": 0,
        "imported_total_trades": "None",
        "imported_estimated_volume": "None",
        "on_holiday": false,
        "non_custodial": true
      },
      "recipient": "None"
    },
    {
      "content": "CONTRACT_WAS_ACCEPTED_AND_WAITING",
      "attachment": "None",
      "time_created": 1594114457,
      "created_by": {
        "username": "trade_support",
        "timezone": "Europe/London",
        "local_currency_symbol": "USD",
        "bio": "",
        "is_staff": false,
        "is_superuser": false,
        "is_email_verified": false,
        "last_seen": "None",
        "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
        "activity_status": "none",
        "activity_tooltip": "None",
        "feedback_score": 5,
        "completed_trades": 0,
        "avg_response_time": 0,
        "user_uuid": "dc5d88cf-55c4-4068-9506-3826d9d0b366",
        "languages": [],
        "date_joined": "2019-05-16T14:08:31.227597Z",
        "is_phone_verified": false,
        "is_legacy": false,
        "primary_language": "en",
        "times_blocked": 0,
        "times_followed": 0,
        "imported_total_trades": "None",
        "imported_estimated_volume": "None",
        "on_holiday": false,
        "non_custodial": false
      },
      "recipient": "None"
    }
  ]
}

## Send message on trade.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"content": "Hello, let's trade crypto!"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/message/f1825235-dec0-4151-bf2b-4b7335125b2f/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "attachment": "https://localcoinswap.com/media/contract_messages/boat.png",
  "content": "Hello, lets trade"
}

## Create non-custodial trade.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"offer": "6ab3a6f8-5a70-41d2-80c9-8f91b27f85bd", "coin_amount": "Great trade!", "fiat_amount": "d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7", "wallet_address": "0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0", "wallet_type": "metamask"});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/non-custodial/create/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "status": "CREATED",
  "uuid": "02789d73-caca-4b42-8362-0abeb0669d92"
}

## Update non-custodial trade.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"status": "REJECTED"});

var requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/custodial/update/49721d63-1a9b-4b39-a749-78d6f2dc1b2b/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "id": 0,
  "ad": {},
  "status": "CREATED",
  "status_meta": {},
  "uuid": "string",
  "contract_responder": {
    "username": "string",
    "activity_status": "string",
    "activity_tooltip": "string",
    "is_email_verified": "string",
    "is_phone_verified": "string",
    "avg_response_time": 0,
    "completed_trades": 0,
    "platform_volume": "string",
    "feedback_score": "string",
    "last_seen": 0,
    "is_legacy": true,
    "user_uuid": "string",
    "hide_from_google": true,
    "date_joined": "2025-02-10T19:10:50Z"
  },
  "buyer": {
    "username": "string",
    "activity_status": "string",
    "activity_tooltip": "string",
    "is_email_verified": "string",
    "is_phone_verified": "string",
    "avg_response_time": 0,
    "completed_trades": 0,
    "platform_volume": "string",
    "feedback_score": "string",
    "last_seen": 0,
    "is_legacy": true,
    "user_uuid": "string",
    "hide_from_google": true,
    "date_joined": "2025-02-10T19:10:50Z"
  },
  "seller": {
    "username": "string",
    "activity_status": "string",
    "activity_tooltip": "string",
    "is_email_verified": "string",
    "is_phone_verified": "string",
    "avg_response_time": 0,
    "completed_trades": 0,
    "platform_volume": "string",
    "feedback_score": "string",
    "last_seen": 0,
    "is_legacy": true,
    "user_uuid": "string",
    "hide_from_google": true,
    "date_joined": "2025-02-10T19:10:50Z"
  },
  "disputed_by": {
    "username": "string"
  },
  "fiat_amount": "string",
  "coin_amount": "string",
  "time_of_expiry": 0,
  "time_created": 0,
  "coin_currency": {
    "id": 0,
    "title": "string",
    "slug": "string",
    "symbol": "string",
    "symbol_filename": "string",
    "is_crypto": true,
    "withdraw_fee": "string",
    "minimum_withdrawal": "string",
    "multiplier": "string",
    "gas_limit": -9223372036854776000,
    "priority": -32768,
    "chain": "string",
    "token_standard": "string",
    "country_code": "strin",
    "active_status": "currency_active",
    "metadata": 0
  },
  "fiat_currency": {
    "id": 0,
    "title": "string",
    "slug": "string",
    "symbol": "string",
    "symbol_filename": "string",
    "is_crypto": true,
    "withdraw_fee": "string",
    "minimum_withdrawal": "string",
    "multiplier": "string",
    "gas_limit": -9223372036854776000,
    "priority": -32768,
    "chain": "string",
    "token_standard": "string",
    "country_code": "strin",
    "active_status": "currency_active",
    "metadata": 0
  },
  "crypto_in_usd": "string",
  "responder_geo": {},
  "tx_meta": {},
  "buyer_meta": {},
  "seller_meta": {},
  "non_custodial": true,
  "amount_to_escrow": "string",
  "fees": "string",
  "btc_escrow_data": {
    "escrow_address": "string",
    "fee_address": "string",
    "escrow_tx": "string"
  },
  "eth_escrow_data": {
    "approve_tx": "string",
    "escrow_tx": "string",
    "release_tx": "string",
    "dispute_tx": "string",
    "cancel_tx": "string"
  },
  "multisig_escrow_data": {
    "escrow_address": "string",
    "fee_address": "string",
    "escrow_tx": "string",
    "release_tx": "string",
    "dispute_tx": "string",
    "cancel_tx": "string"
  }
}

## Watch escrow txn trigger.

This is created so that we don't have to keep polling btc node. We call this API when tx confirms on the node.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| uuid<br><br>required | string |
| -------------------- | ------ |

### Responses

**201**

## trades_to-uuid_read

Get trade uuid from first 8 chars.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| trade_id<br><br>required | string |
| ------------------------ | ------ |

### Responses

**200**

## trades_withdraw-dispute_create

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| uuid<br><br>required | string |
| -------------------- | ------ |

### Responses

**201**

## Get trade by UUID.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "id": 22949,
  "ad": {
    "uuid": "a73b2a38-2f4a-4de6-a7f1-f0d2739e0759",
    "created_by": {
      "username": "Taylor",
      "local_currency_symbol": "AUD",
      "activity_status": "active",
      "activity_tooltip": "Seen 12 seconds ago",
      "is_email_verified": true,
      "is_phone_verified": false,
      "avg_response_time": 33,
      "completed_trades": 24,
      "last_seen": 1596445063,
      "is_legacy": false,
      "bio": "",
      "is_superuser": true,
      "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
      "primary_language": "en",
      "on_holiday": false,
      "sound_notifications": true,
      "nc_pw_reset_done": true
    },
    "is_active": true,
    "is_available": true,
    "fiat_currency": {
      "id": 10002,
      "title": "Australian Dollar",
      "symbol": "AUD",
      "symbol_filename": null,
      "is_crypto": false,
      "withdraw_fee": null,
      "minimum_withdrawal": null,
      "slug": "australian-dollar",
      "active_status": "currency_active"
    },
    "coin_currency": {
      "id": 1,
      "title": "Bitcoin",
      "symbol": "BTC",
      "symbol_filename": "btc.svg",
      "is_crypto": true,
      "withdraw_fee": "0.000300000000000000",
      "minimum_withdrawal": "0.001000000000000000",
      "slug": "bitcoin-BTC",
      "active_status": "currency_active"
    },
    "payment_method": {
      "id": 109,
      "name": "Gamestop Gift Card",
      "priority": 192,
      "slug": "gamestop-gift-card",
      "icon_filename": null,
      "high_risk": true,
      "type": 5
    },
    "trading_type": {
      "id": 2,
      "name": "sell",
      "action_name": "Selling",
      "opposite_name": "buy",
      "opposite_action_name": "Buying"
    },
    "trading_hours": "Mon - Sun: Trading all day<br />\n",
    "min_trade_size": "1.0000000000",
    "max_trade_size": "1.0000000000",
    "enforced_sizes": "",
    "trading_conditions": "",
    "location_name": "Little Mountain",
    "country_code": "AU",
    "price_formula_value": "23451.271183213503",
    "price_formula": {
      "display_formula": "50",
      "prefix_formula": "exchange.btcusd|v||exchange.usdaud|v||*|o||1.5|n||*|o",
      "pricing_type": "MARGIN",
      "market": "cmc"
    },
    "automatic_cancel_time": "240",
    "sms_required": false,
    "only_friends": false,
    "minimum_feedback": "0",
    "min_fiat_limit": 1,
    "max_fiat_limit": 1,
    "current_price": "23142.1629808268",
    "current_price_usd": "16511.6469583500",
    "slug": "buy-bitcoin-btc-for-aud-in-australia",
    "trading_hours_bits": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    "trading_hours_localised": "Mon - Sun: Trading all day<br />\n",
    "trading_hours_bits_localised": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    "hidden": true,
    "is_deleted": false,
    "coordinates": {
      "latitude": -26.781,
      "longitude": 153.094
    },
    "current_margin_percentage": "50.0000000000",
    "headline": "",
    "custodial_type": 2
  },
  "status": "WAITING_FOR_MIN_ESCROW_CONFIRMS",
  "status_meta": {
    "CRYPTO_ESC": {
      "expected_confirmations": 2,
      "confirmations_received": 0
    }
  },
  "uuid": "02789d73-caca-4b42-8362-0abeb0669d92",
  "contract_responder": {
    "username": "review1",
    "timezone": "Europe/London",
    "local_currency_symbol": "USD",
    "bio": "",
    "is_staff": false,
    "is_superuser": false,
    "is_email_verified": true,
    "last_seen": 1597405793,
    "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
    "activity_status": "active",
    "activity_tooltip": "Seen 12 minutes ago",
    "feedback_score": 5,
    "completed_trades": 22,
    "avg_response_time": 13,
    "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
    "languages": [],
    "date_joined": "2020-02-21T02:59:17.630488Z",
    "is_phone_verified": false,
    "is_legacy": false,
    "primary_language": "en",
    "times_blocked": 0,
    "times_followed": 0,
    "imported_total_trades": null,
    "imported_estimated_volume": null,
    "on_holiday": false,
    "non_custodial": true
  },
  "buyer": {
    "username": "review1",
    "timezone": "Europe/London",
    "local_currency_symbol": "USD",
    "bio": "",
    "is_staff": false,
    "is_superuser": false,
    "is_email_verified": true,
    "last_seen": 1597405793,
    "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
    "activity_status": "active",
    "activity_tooltip": "Seen 12 minutes ago",
    "feedback_score": 5,
    "completed_trades": 22,
    "avg_response_time": 13,
    "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
    "languages": [],
    "date_joined": "2020-02-21T02:59:17.630488Z",
    "is_phone_verified": false,
    "is_legacy": false,
    "primary_language": "en",
    "times_blocked": 0,
    "times_followed": 0,
    "imported_total_trades": null,
    "imported_estimated_volume": null,
    "on_holiday": false,
    "non_custodial": true
  },
  "seller": {
    "username": "Taylor",
    "timezone": "Australia/Sydney",
    "local_currency_symbol": "AUD",
    "bio": "",
    "is_staff": true,
    "is_superuser": true,
    "is_email_verified": true,
    "last_seen": 1597406249,
    "profile_image": "https://api.localcoinswap.com/media/default_user.jpg",
    "activity_status": "active",
    "activity_tooltip": "Seen 4 minutes ago",
    "feedback_score": 5,
    "completed_trades": 32,
    "avg_response_time": 27,
    "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
    "languages": [],
    "date_joined": "2018-09-09T23:14:24.244501Z",
    "is_phone_verified": false,
    "is_legacy": false,
    "primary_language": "en",
    "times_blocked": 0,
    "times_followed": 0,
    "imported_total_trades": null,
    "imported_estimated_volume": null,
    "on_holiday": false,
    "non_custodial": true
  },
  "fiat_amount": "1.000000000000000000",
  "coin_amount": "0.000042640000000000",
  "time_of_expiry": 1596459474,
  "time_created": 1596445075,
  "coin_currency": {
    "id": 1,
    "title": "Bitcoin",
    "slug": "bitcoin-BTC",
    "symbol": "BTC",
    "symbol_filename": "btc.svg",
    "icon": "https://api.localcoinswap.com/media/currency/btc.svg",
    "is_crypto": true,
    "withdraw_fee": "0.000300000000000000",
    "minimum_withdrawal": "0.001000000000000000",
    "multiplier": "100000000.0000000000",
    "gas_limit": null,
    "priority": 1,
    "country_code": null,
    "active_status": "currency_active",
    "is_active": true,
    "metadata": 1
  },
  "fiat_currency": {
    "id": 10002,
    "title": "Australian Dollar",
    "slug": "australian-dollar",
    "symbol": "AUD",
    "symbol_filename": null,
    "icon": "https://api.localcoinswap.com/media/currency/usd.svg",
    "is_crypto": false,
    "withdraw_fee": null,
    "minimum_withdrawal": null,
    "multiplier": null,
    "gas_limit": null,
    "priority": 99,
    "country_code": null,
    "active_status": "currency_active",
    "is_active": true,
    "metadata": null
  },
  "responder_geo": {
    "location": {
      "country": "AU",
      "region": "Queensland",
      "city": "Little Mountain",
      "lat": -26.7896,
      "lng": 153.104,
      "postalCode": "4551",
      "timezone": "+10:00",
      "geonameId": 8348536
    }
  },
  "buyer_meta": {
    "address": "3GrNNCqyoW4wJEQr81sfZPK3b5UTifd4WA",
    "wallet_type": "webwallet",
    "public_key": "3cc255aea0bc7ced2df46116d339860da83415c00b0af48fc1ee643db2e40a0e56df45c3c1ac67ef140581ce78f601b55b6d3caf4828ac4ff3b965943cb5bbd2",
    "buyer_hashed_secret": "a0539399de4588f097ca4b0b7517fae496352fd7",
    "buyer_hashed_public_key": "8f9d3f4a0858dda7e3399370a207e70fafe68af0",
    "buyer_hashed_secret_signed": "H6wPzzYJF2JhWrsTAETTTWVe6d7mNCbt9WNYK0W0w/jWPO+d4Y9j7rXHryQwFYzeavU0cNij/kHZj7U778hVuDM=",
    "buyer_address_signed": "H5nG2ih3RKJM3uA9ccPKKiStXNr4wyQrbhxayYE+YAI7TqS0Ri8wTw+nm87wKFht55HGXLBbiv3yU6lcZ9yyGb0=",
    "buyer_encrypted_secret": "7ab9d3cc33efbbb178955b91e9b89fcf833be98bd76e1068b568a574affa32863a14676bbcbed4704024f2447ca37b610690467f763abe0bb20bae10a0dadac0797f8fcae25b5a4c7649c9d0a8f41532"
  },
  "seller_meta": {
    "public_key": "f1048e6936ac33726c9f5d60ff2079482d9d8e79bae35587bfc6ad7252e24dacdb9bcbfa33bb7f4ff7cce7e1baaee8b1869eeb35906664198f335f2d07139e25",
    "address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS",
    "wallet_type": "webwallet",
    "seller_hashed_secret": "74eb626d6893455ccfae38737a847044747eddaf",
    "seller_hashed_public_key": "405722a7b2f48c07095f94aed3d7b9010080ac9a",
    "seller_encrypted_secret": "cf16c82112b99c4c2e0371b42e7dc48354c8bfcc0118661f3a080328e2c7d981fe42c5d5e0b56a57159fc3e215a84bfbed0a3f6e4ac7918fe7aa8ef824af4c3fe4f503511ebdbcd75ef119280abd564b"
  },
  "tx_meta": {
    "hashed_release_secret": "c500d8804e43dc9814420aae1e9cf76e134a39bf",
    "hashed_return_secret": "15f283ff885bfa684303d065ff28ebf72295e557",
    "escrow_address": "3CqHBgwTWMVRzWXNBuy1eVLDjCPixja7M9",
    "fee_address": "35YsVDSRHTpPdzZUWMe1Rw9DEkofis5Adb",
    "escrow_witness": "7651876375148f9d3f4a0858dda7e3399370a207e70fafe68af01474eb626d6893455ccfae38737a847044747eddaf677652876375148f9d3f4a0858dda7e3399370a207e70fafe68af014c500d8804e43dc9814420aae1e9cf76e134a39bf67765387637514405722a7b2f48c07095f94aed3d7b9010080ac9a14a0539399de4588f097ca4b0b7517fae496352fd767548814405722a7b2f48c07095f94aed3d7b9010080ac9a1415f283ff885bfa684303d065ff28ebf72295e5576868687ba98878a988ac",
    "fee_witness": "7653876375a914a0539399de4588f097ca4b0b7517fae496352fd78876a914405722a7b2f48c07095f94aed3d7b9010080ac9a88ac677654876375a91415f283ff885bfa684303d065ff28ebf72295e5578876a914405722a7b2f48c07095f94aed3d7b9010080ac9a88ac6776a9144d85a6c909524300a3141da25a031a82165b6cb088ac6868",
    "escrow_signed_tx": "02000000000101931089e2a0640f48f1c84ddaba1ae94829310ee31249bdad1c88f8eb5ad0a0fe0200000017160014405722a7b2f48c07095f94aed3d7b9010080ac9afeffffff03a81000000000000017a9147a39735ef0f98df2bfb2eeb06aa8099efb5ff55887220200000000000017a9142a562201ccbb3b9148ea96abfd5107c39d4fce76871ed602000000000017a914c663356bf85b5241aec63092ac0a85eed3d0d7b5870247304402204c8c679e85ba7a33698c8264e8d9710da1c7f15f8ff0f84a3422270ee4076cbb022073fe02fedaa70affa04b3863fdcb9ffedcbbc5afd393b560c04d6f3ce466936c01210284911b8aaccd8c18572f15b5d0727f3443b25493eb73d7620e77959a28f63e7600000000",
    "escrow_broadcast_tx": "d6381aaa668d0b3ec11bda6de0425d408fef3598b6989c919c785c3ddd7f4829"
  },
  "non_custodial": true
}

## Get trade feedback.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/feedback/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "feedback_for": {
    "username": "review1",
    "local_currency_symbol": "USD",
    "bio": "",
    "is_staff": false,
    "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b",
    "date_joined": "2020-02-21T02:59:17.630488Z",
    "primary_language": "en",
    "non_custodial": true
  },
  "rating": "5.0",
  "feedback": "Great trade!",
  "feedback_by": {
    "username": "Taylor",
    "local_currency_symbol": "AUD",
    "bio": "",
    "is_staff": true,
    "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba",
    "date_joined": "2018-09-09T23:14:24.244501Z",
    "primary_language": "en",
    "non_custodial": true
  },
  "id": 7721,
  "rating_percentage": 100,
  "time_created": 1597280511,
  "trade": "f3c6120b-d63a-4a1f-9d18-f181c4be29c2"
}

## trades_invoice_create

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| uuid<br><br>required | string |
| -------------------- | ------ |

### Responses

**201**

## Get trade status.

### Request samples

var myHeaders = new Headers();
myHeaders.append("Authorization", "Token YOUR_TOKEN_HERE");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/status/", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log("error", error));

### Response samples

{
  "uuid": "f3c6120b-d63a-4a1f-9d18-f181c4be29c2",
  "status": "COMPLETED"
}

# Notifications

## Get notifs as list.

Paginated notifs API for authenticated users.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### QUERY PARAMETERS

| limit  | integer<br><br>Number of results to return per page.               |
| ------ | ------------------------------------------------------------------ |
| offset | integer<br><br>The initial index from which to return the results. |

### Responses

{
  "count": 0,
  "next": "http://example.com",
  "previous": "http://example.com",
  "results": [
    {
      "id": 0,
      "unread": true,
      "title": "string",
      "description": "string",
      "event": "TRADE_STATUS",
      "metadata": {},
      "since": "string"
    }
  ]
}

## Mark all notifications as read.

This removes the red dot from the notifs in UI. The highlighting in the notifs dropdown still stays intact.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

**201**

## Mark notification as read.

This removes the highlighting for notifs

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

##### PATH PARAMETERS

| notif_id<br><br>required | string |
| ------------------------ | ------ |

### Responses

**201**

## Mark all notifications as seen.

This removes the red dot from the notifs in UI. The highlighting in the notifs dropdown still stays intact.

##### AUTHORIZATIONS:

[Token](https://api.localcoinswap.com/api-docs/#section/Authentication/Token)

### Responses

**201**
