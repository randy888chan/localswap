Introduction
This API provides complete functionality for the LocalCoinSwap exchange. You can use this API to search for offers, manage your offers, and automate the trading process.

This API supports non-custodial trading in Bitcoin, Ethereum, Kusama, and all ERC20's.

This API supports custodial trading in Bitcoin & Dash.

We have a dedicated examples repository for this API, which we will update whenever you ask us to. If you want to use our API to do something and you don't know how, just raise a Github issue and we will update the repository with an example of how to use the API to achieve your use-case. We will create your example in either Python or Javascript, or maybe even both.

We are a fast-moving company and updates may be made to this API on short notice for various reasons. However, we will endevour to remain backwards compatible where possible.

Don't hesistate to get in touch with us if you need more help using the API, or if you have a specific use-case the API does not cover. We are always interested in making our products easier for you to use, and are happy to update or modify the API itself to assist you in your programming goals.

Authentication
The API uses JWT Token Authentication scheme. Use the following steps to generate a token:

How to generate API Token:
Register on LocalCoinSwap
Login to your account and go to Preferences
Click on the API tab and then click on the Generate Token button
Note down the token
Include the returned token in the Authorization HTTP header as follows:
Authorization: Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9
Unauthenticated responses that are denied permission will result in an HTTP 401 Unauthorized response, with an appropriate WWW-Authenticate header. For example:
WWW-Authenticate: Token
{
 "message": "Authentication credentials were not provided.",
 "code": "not_authenticated",
 "error": true
}
Simple example of accessing a secured endpoint using Python:

from requests import Session

s = Session()
s.headers.update({'Authorization': 'Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9'})

response = s.post('https://api.localcoinswap.com/api/v2/notifs-seen/')
Simple example of accessing a secured endpoint using Javascript (ES6):

import axios from "axios";

async function examplePost() {
  const url = "https://api.localcoinswap.com/api/v2/notifs-seen/";
  const result = await axios.get(
    url, {headers: {"Authorization": "Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9"}}
  )
}

examplePost()
Token
Security scheme type:	API Key
Header parameter name:	Authorization
Currencies
Active cryptos on exchange.
Get a list of all the cryptos currently active on the exchange and their associated information.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Currency)
GET
/currencies/active-cryptos/
https://api.localcoinswap.com/api/v2/currencies/active-cryptos/
Request samples
bashpythonjavascript
Copy
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
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 9,
"next": "https://api.localcoinswap.com/api/v2/currencies/active-cryptos/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 2,
"results": [
{},
{},
{},
{},
{}
]
}
Cryptocurrencies.
List of cryptocurrencies supported on the platform.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (MinimalCurrency)
GET
/currencies/crypto-currencies/
https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 28,
"next": "https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 6,
"results": [
{},
{},
{},
{},
{}
]
}
Local currencies.
List of local (fiat) currencies supported on the platform.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (MinimalCurrency)
GET
/currencies/fiat-currencies/
https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 168,
"next": "https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 34,
"results": [
{},
{},
{},
{},
{}
]
}
Cryptocurrency details.
Returns full detail of a currency by symbol i.e. BTC, USD etc.

AUTHORIZATIONS:
Token
PATH PARAMETERS
symbol
required
string
Responses
200 Success response
RESPONSE SCHEMA: application/json
id	
integer (ID)
title
required
string (Title) [ 1 .. 64 ] characters
symbol
required
string (Symbol) [ 1 .. 16 ] characters
chain	
string (Chain) <= 16 characters Nullable
token_standard	
string (Token standard) <= 16 characters Nullable
symbol_filename	
string (Symbol filename) <= 16 characters Nullable
is_crypto	
boolean (Is crypto)
withdraw_fee	
string <decimal> (Withdraw fee) Nullable
minimum_withdrawal	
string <decimal> (Minimum withdrawal) Nullable
metadata
required
object (Metadata)
slug	
string <slug> (Slug) <= 50 characters ^[-a-zA-Z0-9_]+$
GET
/currencies/{symbol}/
https://api.localcoinswap.com/api/v2/currencies/{symbol}/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/currencies/LCS/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
"cmc_analytics": {}
},
"slug": "lcs-cryptoshares-LCS"
}
Wallets
Reset USDT allowance.
Reset the allowance to 0of an address with our USDT escrow contract. currency is the currency id, found at /currencies/{symbol}/.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
currency
required
string <slug> (Currency) ^[-a-zA-Z0-9_]+$
from_address
required
string (From address) [ 1 .. 256 ] characters
Responses
201
RESPONSE SCHEMA: application/json
currency
required
string <slug> (Currency) ^[-a-zA-Z0-9_]+$
from_address
required
string (From address) [ 1 .. 256 ] characters
POST
/wallets/allowance-reset/
https://api.localcoinswap.com/api/v2/wallets/allowance-reset/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"currency": "string",
"from_address": "string"
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"currency": "string",
"from_address": "string"
}
wallets_allowance_read
AUTHORIZATIONS:
Token
PATH PARAMETERS
crypto_slug
required
string
Responses
200
GET
/wallets/allowance/{crypto_slug}/
https://api.localcoinswap.com/api/v2/wallets/allowance/{crypto_slug}/
wallets_approve-allowance_create
AUTHORIZATIONS:
Token
PATH PARAMETERS
crypto_slug
required
string
Responses
201
POST
/wallets/approve-allowance/{crypto_slug}/
https://api.localcoinswap.com/api/v2/wallets/approve-allowance/{crypto_slug}/
wallets_balance_read
AUTHORIZATIONS:
Token
PATH PARAMETERS
currency_slug
required
string
Responses
200
GET
/wallets/balance/{currency_slug}/
https://api.localcoinswap.com/api/v2/wallets/balance/{currency_slug}/
wallets_broadcast-trx-tx_create
AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
signed_tx
required
object (Signed tx)
Responses
201
RESPONSE SCHEMA: application/json
signed_tx
required
object (Signed tx)
POST
/wallets/broadcast-trx-tx/
https://api.localcoinswap.com/api/v2/wallets/broadcast-trx-tx/
Request samples
Payload
Content type
application/json
Copy
Expand allCollapse all
{
"signed_tx": { }
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"signed_tx": { }
}
Create a custodial wallet withdrawal.
Initiate a withdrawal for custodial Bitcoin or Dash.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
otp
required
string (Otp) 6 characters
currency
required
integer (Currency)
Currency id

to_chip	
string (To chip) <= 256 characters Nullable
to_chip is payment_id in case of Monero and in case of Ripple

to_address	
string (To address) <= 256 characters Nullable
amount
required
string <decimal> (Amount)
payment_id	
string (Payment id) <= 100 characters Nullable
Payment id of withdrawal of ripple and monero

withdrawal_tx_hash	
string (Withdrawal transaciton hash) <= 300 characters Nullable
Responses
201
RESPONSE SCHEMA: application/json
id	
integer (ID)
otp
required
string (Otp) 6 characters
currency
required
integer (Currency)
Currency id

to_chip	
string (To chip) <= 256 characters Nullable
to_chip is payment_id in case of Monero and in case of Ripple

to_address	
string (To address) <= 256 characters Nullable
amount
required
string <decimal> (Amount)
fee	
integer (Fee)
is_confirmed	
boolean (Is confirmed)
is_validated	
boolean (Is validated)
is_reverted	
boolean (Is reverted)
payment_id	
string (Payment id) <= 100 characters Nullable
Payment id of withdrawal of ripple and monero

withdrawal_tx_hash	
string (Withdrawal transaciton hash) <= 300 characters Nullable
POST
/wallets/custodial-withdrawal/
https://api.localcoinswap.com/api/v2/wallets/custodial-withdrawal/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"otp": "string",
"currency": 0,
"to_chip": "string",
"to_address": "string",
"amount": "string",
"payment_id": "string",
"withdrawal_tx_hash": "string"
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
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
wallets_non-custodial_read
AUTHORIZATIONS:
Token
PATH PARAMETERS
currency_slug
required
string
Responses
200
GET
/wallets/non-custodial/{currency_slug}/
https://api.localcoinswap.com/api/v2/wallets/non-custodial/{currency_slug}/
Publish transaction to blockchain.
Endpoint to publish a signed transactions to the blockchain. May be used in conjunction with the unsigned transaction endpoint.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
currency
required
string <slug> (Currency) ^[-a-zA-Z0-9_]+$
signature	
string (Signature) non-empty
Signed blockchain transaction

from_address	
string (From address) non-empty
to_address	
string (To address) non-empty
amount	
string (Amount) non-empty
nonce	
integer (Nonce)
signed_tx	
string (Signed tx) non-empty
Responses
201 Success response
POST
/wallets/publish/
https://api.localcoinswap.com/api/v2/wallets/publish/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"currency": "string",
"signature": "string",
"from_address": "string",
"to_address": "string",
"amount": "string",
"nonce": 0,
"signed_tx": "string"
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"status": "successful",
"data": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed",
"error": false,
"tx": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed"
}
wallets_request-withdrawal-otp_create
Request OTP to creat wallet withdrawal.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
Responses
201
RESPONSE SCHEMA: application/json
user_id	
string (User id)
POST
/wallets/request-withdrawal-otp/
https://api.localcoinswap.com/api/v2/wallets/request-withdrawal-otp/
Request samples
Payload
Content type
application/json
Copy
Expand allCollapse all
{ }
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"user_id": "string"
}
wallets_resolve-ns_create
AUTHORIZATIONS:
Token
Responses
201
POST
/wallets/resolve-ns/
https://api.localcoinswap.com/api/v2/wallets/resolve-ns/
Prepare unsigned transaction.
Endpoint to prepare an unsigned transaction for signing by the user. Required parameters vary by cryptocurrency.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
currency
required
string <slug> (Currency) ^[-a-zA-Z0-9_]+$
amount
required
string <decimal> (Amount)
from_address
required
string (From address) [ 1 .. 256 ] characters
to_address
required
string (To address) [ 1 .. 256 ] characters
swap_uuid	
string <uuid> (Swap uuid)
gas_price	
string <decimal> (Gas price)
Gas price in wei. Only for transactions on the ethereum blockchain

gas_limit	
string <decimal> (Gas limit)
Only for transactions on the ethereum blockchain

Responses
201 Success response
POST
/wallets/unsigned/
https://api.localcoinswap.com/api/v2/wallets/unsigned/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"currency": "string",
"amount": "string",
"from_address": "string",
"to_address": "string",
"swap_uuid": "string",
"gas_price": "string",
"gas_limit": "string"
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
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
Watch btc withdrawal txn trigger.
Used by the watcher to trigger tx confirmation.

AUTHORIZATIONS:
Token
Responses
201
POST
/wallets/watch-tx/
https://api.localcoinswap.com/api/v2/wallets/watch-tx/
Offers
Offers are listed on LocalCoinSwap listings for other traders to respond to.

Following operations are possible using Offers:
- Create
- Edit
- Delete
- Read
- Search
Get your offers.
Returns list of offers created by the current user.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (OfferRead)
GET
/offers/
https://api.localcoinswap.com/api/v2/offers/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 9112,
"next": "https://api.localcoinswap.com/api/v2/offers/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 1823,
"results": [
{},
{},
{},
{},
{}
]
}
Create offer.
Create a trade offer for others to respond to. This can be done only by authenticated users.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
trading_type
required
string (Trading type)
Trade type. It can either be buy or sell.

coin_currency
required
string (Coin currency)
Crypto currency slug. Examples: BTC, ETH, USDT-ERC20.

Full list of available cryptocurrencies can be found at /currencies/crypto-currencies/

fiat_currency
required
string (Fiat currency)
Fiat currency symbol. Examples: USD, GBP, AUD.

Full list of available fiat-currencies can be found at /currencies/fiat-currencies/

payment_method
required
string (Payment method)
Name of the payment method. Examples: PayPal, Cash Deposit.

Full list of available payment-methods can be found at /offers/payment-methods/

country_code
required
string (Country code)
Enum: "EU" "AW" "AF" "AO" "AI" "AX" "AL" "AD" "AE" "AR" "AM" "AS" "AQ" "TF" "AG" "AU" "AT" "AZ" "BI" "BE" "BJ" "BQ" "BF" "BD" "BG" "BH" "BS" "BA" "BL" "BY" "BZ" "BM" "BO" "BR" "BB" "BN" "BT" "BV" "BW" "CF" "CA" "CC" "CH" "CL" "CN" "CI" "CM" "CD" "CG" "CK" "CO" "KM" "CV" "CR" "CU" "CW" "CX" "KY" "CY" "CZ" "DE" "DJ" "DM" "DK" "DO" "DZ" "EC" "EG" "ER" "EH" "ES" "EE" "ET" "FI" "FJ" "FK" "FR" "FO" "FM" "GA" "GB" "GE" "GG" "GH" "GI" "GN" "GP" "GM" "GW" "GQ" "GR" "GD" "GL" "GT" "GF" "GU" "GY" "HK" "HM" "HN" "HR" "HT" "HU" "ID" "IM" "IN" "IO" "IE" "IR" "IQ" "IS" "IL" "IT" "JM" "JE" "JO" "JP" "KZ" "KE" "KG" "KH" "KI" "KN" "KR" "KW" "LA" "LB" "LR" "LY" "LC" "LI" "LK" "LS" "LT" "LU" "LV" "MO" "MF" "MA" "MC" "MD" "MG" "MV" "MX" "MH" "MK" "ML" "MT" "MM" "ME" "MN" "MP" "MZ" "MR" "MS" "MQ" "MU" "MW" "MY" "YT" "NA" "NC" "NE" "NF" "NG" "NI" "NU" "NL" "NO" "NP" "NR" "NZ" "OM" "PK" "PA" "PN" "PE" "PH" "PW" "PG" "PL" "PR" "KP" "PT" "PY" "PS" "PF" "QA" "RE" "RO" "RU" "RW" "SA" "SD" "SN" "SG" "GS" "SH" "SJ" "SB" "SL" "SV" "SM" "SO" "PM" "RS" "SS" "ST" "SR" "SK" "SI" "SE" "SZ" "SX" "SC" "SY" "TC" "TD" "TG" "TH" "TJ" "TK" "TM" "TL" "TO" "TT" "TN" "TR" "TV" "TW" "TZ" "UG" "UA" "UM" "UY" "US" "UZ" "VA" "VC" "VE" "VG" "VI" "VN" "VU" "WF" "WS" "YE" "ZA" "ZM" "ZW"
Country code in alpha-2 format (two characters only). See the list of available choices above.

location_name	
string (Location name) <= 64 characters
Default: ""
City or place name, consider using a discoverable location name. Eg: Mountain View, California or Sydney.

Please make sure this name is within the country_code chosen above. Behind the scenes we perform a reverse lookup under that country code to find geo-coordinates which further help in search APIs.

min_trade_size	
integer (Min trade size) >= 1
Default: 1
Expressed in terms of the fiat currency. Should be >= 1.

max_trade_size
required
integer (Max trade size) >= 1
Expressed in terms of the fiat currency. Should be >= min_trade_size.

pricing_type	
string (Pricing type)
Default: "MARGIN"
Enum: "MARGIN" "ADVANCED" "FIXED"
pricing_market	
string (Pricing market)
Default: "cmc"
Enum: "cmc" "bitfinex" "kraken" "bitstamp" "binance" "bittrex" "coinbase" "poloniex" "hitbtc" "cexio" "coinone" "independent_reserve" "kucoin"
pricing_expression	
string (Pricing expression) [ 1 .. 128 ] characters
Default: "2"
trading_conditions	
string (Trading conditions)
Default: ""
The conditions under which you trade with others.

headline	
string (Headline) <= 60 characters Nullable
Default: ""
Headline for the offer, highlighted on the listings page.

trading_hours_type	
string (Trading hours type)
Default: "daily"
Enum: "daily" "specific"
Choose whether you want to specify common availability hours for every day or specify individual hours for each day

trading_hours_json
required
object (Trading hours json)
If trading_hours_type is daily then the format should be:

{
    "anyday": {
        "from": "08:30",
        "to": "21:00"
    }
}```




Else the format should be: 

{ "monday": { "from": "06:30", "to": "21:00" }, "tuesday": { "from": "06:30", "to": "21:00" }, "wednesday": { "from": "06:30", "to": "21:00" }, "thursday": { "from": "09:30", "to": "21:00" }, "friday": { "from": "00:30", "to": "21:00" }, "saturday": { "from": "18:30", "to": "19:00" }, "sunday": { "from": "08:30", "to": "21:00" } }```

hidden	
boolean (Hidden offer)
Default: false
If true, offer is hidden and only accessible directly through the URL

enforced_sizes	
string (Trade sizes) <= 500 characters Nullable
Default: ""
These are the accepted sizes, comma separated. Eg: if you are exchanging for gift cards of values $50 and $100, enter 50,100

blocked_countries	
string (Blocked country codes) <= 510 characters Nullable
Default: ""
Comma separated list of iso2 country codes like NG,KE

automatic_cancel_time	
integer (Automatic cancel time) [ 10 .. 2000 ]
Default: 240
Time (in minutes) until the trade will automatically cancel/expire if you don't respond

sms_required	
boolean (Phone verification required)
Default: false
Require potential traders to have verified their phone number.

minimum_feedback	
integer (Minimum feedback) [ 0 .. 100 ]
Minimum feedback percentage required for traders to initiate a trade on this offer.

Responses
201 Success response
RESPONSE SCHEMA: application/json
trading_type
required
string (Trading type)
Trade type. It can either be buy or sell.

coin_currency
required
string (Coin currency)
Crypto currency slug. Examples: BTC, ETH, USDT-ERC20.

Full list of available cryptocurrencies can be found at /currencies/crypto-currencies/

fiat_currency
required
string (Fiat currency)
Fiat currency symbol. Examples: USD, GBP, AUD.

Full list of available fiat-currencies can be found at /currencies/fiat-currencies/

payment_method
required
string (Payment method)
Name of the payment method. Examples: PayPal, Cash Deposit.

Full list of available payment-methods can be found at /offers/payment-methods/

uuid	
string <uuid> (Offer uuid)
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
country_code
required
string (Country code)
Enum: "EU" "AW" "AF" "AO" "AI" "AX" "AL" "AD" "AE" "AR" "AM" "AS" "AQ" "TF" "AG" "AU" "AT" "AZ" "BI" "BE" "BJ" "BQ" "BF" "BD" "BG" "BH" "BS" "BA" "BL" "BY" "BZ" "BM" "BO" "BR" "BB" "BN" "BT" "BV" "BW" "CF" "CA" "CC" "CH" "CL" "CN" "CI" "CM" "CD" "CG" "CK" "CO" "KM" "CV" "CR" "CU" "CW" "CX" "KY" "CY" "CZ" "DE" "DJ" "DM" "DK" "DO" "DZ" "EC" "EG" "ER" "EH" "ES" "EE" "ET" "FI" "FJ" "FK" "FR" "FO" "FM" "GA" "GB" "GE" "GG" "GH" "GI" "GN" "GP" "GM" "GW" "GQ" "GR" "GD" "GL" "GT" "GF" "GU" "GY" "HK" "HM" "HN" "HR" "HT" "HU" "ID" "IM" "IN" "IO" "IE" "IR" "IQ" "IS" "IL" "IT" "JM" "JE" "JO" "JP" "KZ" "KE" "KG" "KH" "KI" "KN" "KR" "KW" "LA" "LB" "LR" "LY" "LC" "LI" "LK" "LS" "LT" "LU" "LV" "MO" "MF" "MA" "MC" "MD" "MG" "MV" "MX" "MH" "MK" "ML" "MT" "MM" "ME" "MN" "MP" "MZ" "MR" "MS" "MQ" "MU" "MW" "MY" "YT" "NA" "NC" "NE" "NF" "NG" "NI" "NU" "NL" "NO" "NP" "NR" "NZ" "OM" "PK" "PA" "PN" "PE" "PH" "PW" "PG" "PL" "PR" "KP" "PT" "PY" "PS" "PF" "QA" "RE" "RO" "RU" "RW" "SA" "SD" "SN" "SG" "GS" "SH" "SJ" "SB" "SL" "SV" "SM" "SO" "PM" "RS" "SS" "ST" "SR" "SK" "SI" "SE" "SZ" "SX" "SC" "SY" "TC" "TD" "TG" "TH" "TJ" "TK" "TM" "TL" "TO" "TT" "TN" "TR" "TV" "TW" "TZ" "UG" "UA" "UM" "UY" "US" "UZ" "VA" "VC" "VE" "VG" "VI" "VN" "VU" "WF" "WS" "YE" "ZA" "ZM" "ZW"
Country code in alpha-2 format (two characters only). See the list of available choices above.

location_name	
string (Location name) <= 64 characters
Default: ""
City or place name, consider using a discoverable location name. Eg: Mountain View, California or Sydney.

Please make sure this name is within the country_code chosen above. Behind the scenes we perform a reverse lookup under that country code to find geo-coordinates which further help in search APIs.

min_trade_size	
integer (Min trade size) >= 1
Default: 1
Expressed in terms of the fiat currency. Should be >= 1.

max_trade_size
required
integer (Max trade size) >= 1
Expressed in terms of the fiat currency. Should be >= min_trade_size.

pricing_type	
string (Pricing type)
Default: "MARGIN"
Enum: "MARGIN" "ADVANCED" "FIXED"
pricing_market	
string (Pricing market)
Default: "cmc"
Enum: "cmc" "bitfinex" "kraken" "bitstamp" "binance" "bittrex" "coinbase" "poloniex" "hitbtc" "cexio" "coinone" "independent_reserve" "kucoin"
pricing_expression	
string (Pricing expression) [ 1 .. 128 ] characters
Default: "2"
trading_conditions	
string (Trading conditions)
Default: ""
The conditions under which you trade with others.

headline	
string (Headline) <= 60 characters Nullable
Default: ""
Headline for the offer, highlighted on the listings page.

trading_hours_type	
string (Trading hours type)
Default: "daily"
Enum: "daily" "specific"
Choose whether you want to specify common availability hours for every day or specify individual hours for each day

trading_hours_json
required
object (Trading hours json)
If trading_hours_type is daily then the format should be:

{
    "anyday": {
        "from": "08:30",
        "to": "21:00"
    }
}```




Else the format should be: 

{ "monday": { "from": "06:30", "to": "21:00" }, "tuesday": { "from": "06:30", "to": "21:00" }, "wednesday": { "from": "06:30", "to": "21:00" }, "thursday": { "from": "09:30", "to": "21:00" }, "friday": { "from": "00:30", "to": "21:00" }, "saturday": { "from": "18:30", "to": "19:00" }, "sunday": { "from": "08:30", "to": "21:00" } }```

hidden	
boolean (Hidden offer)
Default: false
If true, offer is hidden and only accessible directly through the URL

enforced_sizes	
string (Trade sizes) <= 500 characters Nullable
Default: ""
These are the accepted sizes, comma separated. Eg: if you are exchanging for gift cards of values $50 and $100, enter 50,100

blocked_countries	
string (Blocked country codes) <= 510 characters Nullable
Default: ""
Comma separated list of iso2 country codes like NG,KE

automatic_cancel_time	
integer (Automatic cancel time) [ 10 .. 2000 ]
Default: 240
Time (in minutes) until the trade will automatically cancel/expire if you don't respond

sms_required	
boolean (Phone verification required)
Default: false
Require potential traders to have verified their phone number.

minimum_feedback	
integer (Minimum feedback) [ 0 .. 100 ]
Minimum feedback percentage required for traders to initiate a trade on this offer.

POST
/offers/
https://api.localcoinswap.com/api/v2/offers/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"trading_type": "string",
"coin_currency": "string",
"fiat_currency": "string",
"payment_method": "string",
"country_code": "EU",
"location_name": "",
"min_trade_size": 1,
"max_trade_size": 1,
"pricing_type": "MARGIN",
"pricing_market": "cmc",
"pricing_expression": "2",
"trading_conditions": "",
"headline": "",
"trading_hours_type": "daily",
"trading_hours_json": { },
"hidden": false,
"enforced_sizes": "",
"blocked_countries": "",
"automatic_cancel_time": 240,
"sms_required": false,
"minimum_feedback": 0
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
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
Calculate advanced price.
The formula expression is directly passed into this endpoint to compute the result. This can be done only by authenticated users.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
expression	
string (Expression) [ 1 .. 128 ] characters
Default: ""
An expression is a mathematical formula which uses variables supported by LocalCoinSwap.

Eg: market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1) is a valid expression to get 10% higher value for the current ask for BTC on Binance market.

Responses
200 Success response
RESPONSE SCHEMA: application/json
price	
string (Price) [ 1 .. 64 ] characters
Default: ""
POST
/offers/dryrun-expression/
https://api.localcoinswap.com/api/v2/offers/dryrun-expression/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"expression": ""
}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"price": "12863.983"
}
Get price for market.
We create a formula expression from the parameters passed and then compute the result. This can be done only by authenticated users.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
pricing_market	
string (Pricing market)
Default: "cmc"
Enum: "cmc" "bitfinex" "kraken" "bitstamp" "binance" "bittrex" "coinbase" "poloniex" "hitbtc" "cexio" "coinone" "independent_reserve" "kucoin"
coin_currency
required
string (Coin currency)
Crypto currency symbol. Examples: BTC, ETH.

Full list of available cryptocurrencies can be found at /currencies/crypto-currencies/

fiat_currency
required
string (Fiat currency)
Fiat currency symbol. Examples: USD, GBP, AUD.

Full list of available fiat-currencies can be found at /currencies/fiat-currencies/

margin_percent
required
string <decimal> (Margin percent)
Responses
200 Success response
RESPONSE SCHEMA: application/json
price	
string (Price) [ 1 .. 64 ] characters
Default: ""
POST
/offers/dryrun-formula/
https://api.localcoinswap.com/api/v2/offers/dryrun-formula/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"pricing_market": "cmc",
"coin_currency": "string",
"fiat_currency": "string",
"margin_percent": "string"
}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"price": "472.31389170020003"
}
offers_featured_list
AUTHORIZATIONS:
Token
QUERY PARAMETERS
coin_currency	
string
List of cryptocurrencies to filter by. Takes slug of the currency.

trading_type	
string
Filter by either buy/sell trades.

fiat_currency	
string
List of fiat currencies to filter by. Takes symbol of the currency.

payment_method	
string
List of payment-methods to filter by. Takes slug of payment method.

country_code	
string
To prioritize given country in the list. If no offers found in the given country then other relevant offers may still show up.

username	
string
Search by username of traders.

last_seen	
string
Filter by last seen time of the trader. Supported input: "30mins", "24hours", "1week", "2weeks", "1month"

hide_new	
string
Whether to hide offers from new users or not.

created_by	
string
ordering	
string
country_code_exact	
string
To filter by given country, returns empty if no offers in given country.

limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (OfferList)
GET
/offers/featured/
https://api.localcoinswap.com/api/v2/offers/featured/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 912,
"next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 183,
"results": [
{},
{},
{},
{},
{}
]
}
offers_new-offer_list
Get data for rendering the new offer page.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200
GET
/offers/new-offer/
https://api.localcoinswap.com/api/v2/offers/new-offer/
Payment methods.
List of payment methods supported for offer listing.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Payment method)
GET
/offers/payment-methods/
https://api.localcoinswap.com/api/v2/offers/payment-methods/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/payment-methods/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 262,
"next": "https://api.localcoinswap.com/api/v2/offers/payment-methods/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 53,
"results": [
{},
{},
{},
{},
{}
]
}
offers_search-data_list
Get data for rendering the search form.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200
GET
/offers/search-data/
https://api.localcoinswap.com/api/v2/offers/search-data/
Search all offers.
Search through publicly listed trade offers. Supports sorting and filtering based on with multiple parameter combinations.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
coin_currency	
string
List of cryptocurrencies to filter by. Takes slug of the currency.

trading_type	
string
Filter by either buy/sell trades.

fiat_currency	
string
List of fiat currencies to filter by. Takes symbol of the currency.

payment_method	
string
List of payment-methods to filter by. Takes slug of payment method.

country_code	
string
To prioritize given country in the list. If no offers found in the given country then other relevant offers may still show up.

username	
string
Search by username of traders.

last_seen	
string
Filter by last seen time of the trader. Supported input: "30mins", "24hours", "1week", "2weeks", "1month"

hide_new	
string
Whether to hide offers from new users or not.

created_by	
string
ordering	
string
country_code_exact	
string
To filter by given country, returns empty if no offers in given country.

limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (OfferList)
GET
/offers/search/
https://api.localcoinswap.com/api/v2/offers/search/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 912,
"next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 183,
"results": [
{},
{},
{},
{},
{}
]
}
Get all search index offer slugs.
We use this endpoint for sitemap generation.

AUTHORIZATIONS:
Token
Responses
200
RESPONSE SCHEMA: application/json
Array 
uuid	
string <uuid> (Offer uuid)
slug	
string <slug> (Slug) <= 128 characters ^[-a-zA-Z0-9_]+$
GET
/offers/slugs/
https://api.localcoinswap.com/api/v2/offers/slugs/
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
[
{
"uuid": "string",
"slug": "string"
}
]
Trade types.
List of trade types supported for creating offer.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Trading type)
GET
/offers/trade-types/
https://api.localcoinswap.com/api/v2/offers/trade-types/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/trade-types/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 2,
"next": "None",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 1,
"results": [
{},
{}
]
}
Get offer by UUID.
This can be done by anonymous users.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
Responses
200 Success response
RESPONSE SCHEMA: application/json
uuid	
string <uuid> (Offer uuid)
slug	
string <slug> (Slug) <= 128 characters ^[-a-zA-Z0-9_]+$
is_active	
boolean (Is active)
created_by
required
object (Created by)
trading_type
required
object (Trading type)
coin_currency
required
object (MinimalCurrency)
fiat_currency
required
object (MinimalCurrency)
payment_method
required
object (Payment method)
location_name	
string (Location) <= 100 characters Nullable
City or region where you wish to trade

country_code	
string (Country Code) <= 2 characters Nullable
Country code in which you wish to trade

custodial_type	
integer (Trade types allowed) [ 0 .. 2147483647 ]
min_trade_size	
string <decimal> (Minimum trade volume)
max_trade_size	
string <decimal> (Maximum trade volume) Nullable
trading_conditions	
string (Trading conditions)
The conditions under which you trade with others.

headline	
string (Headline) <= 100 characters Nullable
Headline for the offer, highlighted on the listings page.

hidden	
boolean (Hidden offer)
If true, offer is hidden and only accessible directly through the URL

enforced_sizes	
string (Trade sizes) <= 1024 characters Nullable
These are the accepted sizes, comma separated. Eg: if you are exchanging for gift cards of values $50 and $100, enter 50,100

blocked_countries	
string (Blocked country codes) <= 512 characters Nullable
Comma separated list of iso2 country codes like NG,KE

automatic_cancel_time	
string <decimal> (Automatic cancellation time in minutes) Nullable
Time until the trade will automatically cancel if you don't respond

sms_required	
boolean (Phone verification required)
Require potential traders to have verified their phone number.

minimum_feedback	
string <decimal> (Minimum feedback percentage)
The minimum feedback percentage for users you want to trade with (e.g. 100)

price_formula	
object (Price formula)
price_formula_value	
string (Price formula value)
trading_hours_localised	
string (Trading hours localised)
trading_hours_type	
string (Trading hours type)
trading_hours_json	
string (Trading hours json)
current_margin_percentage	
string <decimal> (Margin %) Nullable
GET
/offers/{uuid}/
https://api.localcoinswap.com/api/v2/offers/{uuid}/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/offers/9fd021ae-2339-4285-aa67-d4937a6b0012/' \
--header 'Content-Type: application/json' \


Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
Update offer by UUID.
Update a trade offer for others to respond to. This can be done only by the original offer creator.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
REQUEST BODY SCHEMA: application/json
country_code
required
string (Country code)
Enum: "EU" "AW" "AF" "AO" "AI" "AX" "AL" "AD" "AE" "AR" "AM" "AS" "AQ" "TF" "AG" "AU" "AT" "AZ" "BI" "BE" "BJ" "BQ" "BF" "BD" "BG" "BH" "BS" "BA" "BL" "BY" "BZ" "BM" "BO" "BR" "BB" "BN" "BT" "BV" "BW" "CF" "CA" "CC" "CH" "CL" "CN" "CI" "CM" "CD" "CG" "CK" "CO" "KM" "CV" "CR" "CU" "CW" "CX" "KY" "CY" "CZ" "DE" "DJ" "DM" "DK" "DO" "DZ" "EC" "EG" "ER" "EH" "ES" "EE" "ET" "FI" "FJ" "FK" "FR" "FO" "FM" "GA" "GB" "GE" "GG" "GH" "GI" "GN" "GP" "GM" "GW" "GQ" "GR" "GD" "GL" "GT" "GF" "GU" "GY" "HK" "HM" "HN" "HR" "HT" "HU" "ID" "IM" "IN" "IO" "IE" "IR" "IQ" "IS" "IL" "IT" "JM" "JE" "JO" "JP" "KZ" "KE" "KG" "KH" "KI" "KN" "KR" "KW" "LA" "LB" "LR" "LY" "LC" "LI" "LK" "LS" "LT" "LU" "LV" "MO" "MF" "MA" "MC" "MD" "MG" "MV" "MX" "MH" "MK" "ML" "MT" "MM" "ME" "MN" "MP" "MZ" "MR" "MS" "MQ" "MU" "MW" "MY" "YT" "NA" "NC" "NE" "NF" "NG" "NI" "NU" "NL" "NO" "NP" "NR" "NZ" "OM" "PK" "PA" "PN" "PE" "PH" "PW" "PG" "PL" "PR" "KP" "PT" "PY" "PS" "PF" "QA" "RE" "RO" "RU" "RW" "SA" "SD" "SN" "SG" "GS" "SH" "SJ" "SB" "SL" "SV" "SM" "SO" "PM" "RS" "SS" "ST" "SR" "SK" "SI" "SE" "SZ" "SX" "SC" "SY" "TC" "TD" "TG" "TH" "TJ" "TK" "TM" "TL" "TO" "TT" "TN" "TR" "TV" "TW" "TZ" "UG" "UA" "UM" "UY" "US" "UZ" "VA" "VC" "VE" "VG" "VI" "VN" "VU" "WF" "WS" "YE" "ZA" "ZM" "ZW"
Country code in alpha-2 format (two characters only). See the list of available choices above.

location_name	
string (Location name) <= 64 characters
Default: ""
City or place name, consider using a discoverable location name. Eg: Mountain View, California or Sydney.

Please make sure this name is within the country_code chosen above. Behind the scenes we perform a reverse lookup under that country code to find geo-coordinates which further help in search APIs.

min_trade_size	
integer (Min trade size) >= 1
Default: 1
Expressed in terms of the fiat currency. Should be >= 1.

max_trade_size
required
integer (Max trade size) >= 1
Expressed in terms of the fiat currency. Should be >= min_trade_size.

pricing_type	
string (Pricing type)
Default: "MARGIN"
Enum: "MARGIN" "ADVANCED" "FIXED"
pricing_market	
string (Pricing market)
Default: "cmc"
Enum: "cmc" "bitfinex" "kraken" "bitstamp" "binance" "bittrex" "coinbase" "poloniex" "hitbtc" "cexio" "coinone" "independent_reserve" "kucoin"
pricing_expression	
string (Pricing expression) [ 1 .. 128 ] characters
Default: "2"
trading_conditions	
string (Trading conditions)
Default: ""
The conditions under which you trade with others.

headline	
string (Headline) <= 60 characters Nullable
Default: ""
Headline for the offer, highlighted on the listings page.

trading_hours_type	
string (Trading hours type)
Default: "daily"
Enum: "daily" "specific"
Choose whether you want to specify common availability hours for every day or specify individual hours for each day

trading_hours_json
required
object (Trading hours json)
If trading_hours_type is daily then the format should be:

{
    "anyday": {
        "from": "08:30",
        "to": "21:00"
    }
}```




Else the format should be: 

{ "monday": { "from": "06:30", "to": "21:00" }, "tuesday": { "from": "06:30", "to": "21:00" }, "wednesday": { "from": "06:30", "to": "21:00" }, "thursday": { "from": "09:30", "to": "21:00" }, "friday": { "from": "00:30", "to": "21:00" }, "saturday": { "from": "18:30", "to": "19:00" }, "sunday": { "from": "08:30", "to": "21:00" } }```

hidden	
boolean (Hidden offer)
Default: false
If true, offer is hidden and only accessible directly through the URL

enforced_sizes	
string (Trade sizes) <= 500 characters Nullable
Default: ""
These are the accepted sizes, comma separated. Eg: if you are exchanging for gift cards of values $50 and $100, enter 50,100

blocked_countries	
string (Blocked country codes) <= 510 characters Nullable
Default: ""
Comma separated list of iso2 country codes like NG,KE

automatic_cancel_time	
integer (Automatic cancel time) [ 10 .. 2000 ]
Default: 240
Time (in minutes) until the trade will automatically cancel/expire if you don't respond

sms_required	
boolean (Phone verification required)
Default: false
Require potential traders to have verified their phone number.

minimum_feedback	
integer (Minimum feedback) [ 0 .. 100 ]
Minimum feedback percentage required for traders to initiate a trade on this offer.

is_active	
boolean (Is active)
Responses
200 Success response
RESPONSE SCHEMA: application/json
uuid	
string <uuid> (Offer uuid)
slug	
string <slug> (Slug) non-empty ^[-a-zA-Z0-9_]+$
country_code
required
string (Country code)
Enum: "EU" "AW" "AF" "AO" "AI" "AX" "AL" "AD" "AE" "AR" "AM" "AS" "AQ" "TF" "AG" "AU" "AT" "AZ" "BI" "BE" "BJ" "BQ" "BF" "BD" "BG" "BH" "BS" "BA" "BL" "BY" "BZ" "BM" "BO" "BR" "BB" "BN" "BT" "BV" "BW" "CF" "CA" "CC" "CH" "CL" "CN" "CI" "CM" "CD" "CG" "CK" "CO" "KM" "CV" "CR" "CU" "CW" "CX" "KY" "CY" "CZ" "DE" "DJ" "DM" "DK" "DO" "DZ" "EC" "EG" "ER" "EH" "ES" "EE" "ET" "FI" "FJ" "FK" "FR" "FO" "FM" "GA" "GB" "GE" "GG" "GH" "GI" "GN" "GP" "GM" "GW" "GQ" "GR" "GD" "GL" "GT" "GF" "GU" "GY" "HK" "HM" "HN" "HR" "HT" "HU" "ID" "IM" "IN" "IO" "IE" "IR" "IQ" "IS" "IL" "IT" "JM" "JE" "JO" "JP" "KZ" "KE" "KG" "KH" "KI" "KN" "KR" "KW" "LA" "LB" "LR" "LY" "LC" "LI" "LK" "LS" "LT" "LU" "LV" "MO" "MF" "MA" "MC" "MD" "MG" "MV" "MX" "MH" "MK" "ML" "MT" "MM" "ME" "MN" "MP" "MZ" "MR" "MS" "MQ" "MU" "MW" "MY" "YT" "NA" "NC" "NE" "NF" "NG" "NI" "NU" "NL" "NO" "NP" "NR" "NZ" "OM" "PK" "PA" "PN" "PE" "PH" "PW" "PG" "PL" "PR" "KP" "PT" "PY" "PS" "PF" "QA" "RE" "RO" "RU" "RW" "SA" "SD" "SN" "SG" "GS" "SH" "SJ" "SB" "SL" "SV" "SM" "SO" "PM" "RS" "SS" "ST" "SR" "SK" "SI" "SE" "SZ" "SX" "SC" "SY" "TC" "TD" "TG" "TH" "TJ" "TK" "TM" "TL" "TO" "TT" "TN" "TR" "TV" "TW" "TZ" "UG" "UA" "UM" "UY" "US" "UZ" "VA" "VC" "VE" "VG" "VI" "VN" "VU" "WF" "WS" "YE" "ZA" "ZM" "ZW"
Country code in alpha-2 format (two characters only). See the list of available choices above.

location_name	
string (Location name) <= 64 characters
Default: ""
City or place name, consider using a discoverable location name. Eg: Mountain View, California or Sydney.

Please make sure this name is within the country_code chosen above. Behind the scenes we perform a reverse lookup under that country code to find geo-coordinates which further help in search APIs.

min_trade_size	
integer (Min trade size) >= 1
Default: 1
Expressed in terms of the fiat currency. Should be >= 1.

max_trade_size
required
integer (Max trade size) >= 1
Expressed in terms of the fiat currency. Should be >= min_trade_size.

pricing_type	
string (Pricing type)
Default: "MARGIN"
Enum: "MARGIN" "ADVANCED" "FIXED"
pricing_market	
string (Pricing market)
Default: "cmc"
Enum: "cmc" "bitfinex" "kraken" "bitstamp" "binance" "bittrex" "coinbase" "poloniex" "hitbtc" "cexio" "coinone" "independent_reserve" "kucoin"
pricing_expression	
string (Pricing expression) [ 1 .. 128 ] characters
Default: "2"
trading_conditions	
string (Trading conditions)
Default: ""
The conditions under which you trade with others.

headline	
string (Headline) <= 60 characters Nullable
Default: ""
Headline for the offer, highlighted on the listings page.

trading_hours_type	
string (Trading hours type)
Default: "daily"
Enum: "daily" "specific"
Choose whether you want to specify common availability hours for every day or specify individual hours for each day

trading_hours_json
required
object (Trading hours json)
If trading_hours_type is daily then the format should be:

{
    "anyday": {
        "from": "08:30",
        "to": "21:00"
    }
}```




Else the format should be: 

{ "monday": { "from": "06:30", "to": "21:00" }, "tuesday": { "from": "06:30", "to": "21:00" }, "wednesday": { "from": "06:30", "to": "21:00" }, "thursday": { "from": "09:30", "to": "21:00" }, "friday": { "from": "00:30", "to": "21:00" }, "saturday": { "from": "18:30", "to": "19:00" }, "sunday": { "from": "08:30", "to": "21:00" } }```

hidden	
boolean (Hidden offer)
Default: false
If true, offer is hidden and only accessible directly through the URL

enforced_sizes	
string (Trade sizes) <= 500 characters Nullable
Default: ""
These are the accepted sizes, comma separated. Eg: if you are exchanging for gift cards of values $50 and $100, enter 50,100

blocked_countries	
string (Blocked country codes) <= 510 characters Nullable
Default: ""
Comma separated list of iso2 country codes like NG,KE

automatic_cancel_time	
integer (Automatic cancel time) [ 10 .. 2000 ]
Default: 240
Time (in minutes) until the trade will automatically cancel/expire if you don't respond

sms_required	
boolean (Phone verification required)
Default: false
Require potential traders to have verified their phone number.

minimum_feedback	
integer (Minimum feedback) [ 0 .. 100 ]
Minimum feedback percentage required for traders to initiate a trade on this offer.

is_active	
boolean (Is active)
PATCH
/offers/{uuid}/
https://api.localcoinswap.com/api/v2/offers/{uuid}/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"country_code": "EU",
"location_name": "",
"min_trade_size": 1,
"max_trade_size": 1,
"pricing_type": "MARGIN",
"pricing_market": "cmc",
"pricing_expression": "2",
"trading_conditions": "",
"headline": "",
"trading_hours_type": "daily",
"trading_hours_json": { },
"hidden": false,
"enforced_sizes": "",
"blocked_countries": "",
"automatic_cancel_time": 240,
"sms_required": false,
"minimum_feedback": 0,
"is_active": true
}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
Delete offer by UUID.
This can be done only by the original offer creator.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
Responses
204
DELETE
/offers/{uuid}/
https://api.localcoinswap.com/api/v2/offers/{uuid}/
Request samples
bashpythonjavascript
Copy
curl \
--request DELETE 'https://api.localcoinswap.com/api/v2/offers/678ac0c8-07d1-4aba-9213-2f083059fc7f' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Profiles
Encrypted blob.
Encrypted container for a users account, normally provided after login when 2FA is complete. This contains the users secret mnemonic and account key. Requires the users password to decrypt.

Warning: This blob protects your private keys and all the funds contained in your account. Be very careful if you decide to decrypt it!

To see how to decrypt this information you can check out some examples

AUTHORIZATIONS:
Token
Responses
200
RESPONSE SCHEMA: application/json
salt
required
string (Secret Key Salt) [ 1 .. 32 ] characters
Random salt generated user-side, used to create Secret Key

iterations
required
integer (Number of iterations) [ 0 .. 2147483647 ]
Random number between 20,000 and 30,000

initialization_vector
required
string (Initialization vector) [ 1 .. 32 ] characters
Random 16-byte IV generated user-side, used to encrypt/decrypt Account Key

encrypted_account_key
required
string (Encrypted Account Key) [ 1 .. 96 ] characters
User-generated Account Key encrypted with AES-256

public_identity_key
required
string (Public Identity Key) [ 1 .. 128 ] characters
ECDSA public key that corresponds to user's Private Key

encrypted_mnemonic	
string (Encrypted Mnemonic 512) [ 1 .. 512 ] characters Nullable
encrypted_mnemonic_256	
string (Encrypted Mnemonic 256) [ 1 .. 512 ] characters Nullable
encrypted_mnemonic_iv	
string (Encrypted Mnemonic IV) [ 1 .. 32 ] characters Nullable
GET
/profile/encrypted-blob/
https://api.localcoinswap.com/api/v2/profile/encrypted-blob/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/profile/encrypted-blob/' \
--header 'Content-Type: application/json' \


Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
Get all search index profile slugs.
We use this endpoint for sitemap generation.

AUTHORIZATIONS:
Token
Responses
200
RESPONSE SCHEMA: application/json
Array 
username
required
string (Username) [ 1 .. 150 ] characters ^[\w.@+-]+$
Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.

GET
/profile/slugs/
https://api.localcoinswap.com/api/v2/profile/slugs/
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
[
{
"username": "string"
}
]
profile_update-username_partial_update
AUTHORIZATIONS:
Token
PATH PARAMETERS
user_uuid
required
string
REQUEST BODY SCHEMA: application/json
username
required
string (Username) [ 3 .. 14 ] characters ^[A-Za-z0-9_]+$
Responses
200
RESPONSE SCHEMA: application/json
username
required
string (Username) [ 3 .. 14 ] characters ^[A-Za-z0-9_]+$
PATCH
/profile/update-username/{user_uuid}/
https://api.localcoinswap.com/api/v2/profile/update-username/{user_uuid}/
Request samples
Payload
Content type
application/json
Copy
Expand allCollapse all
{
"username": "string"
}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"username": "string"
}
Trades
Submit feeback on trade.
This can be done only by seller/buyer of the trade. They both can submit feedback for each other. Feedback can only be submitted for completed trades.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
rating
required
string (Rating)
Enum: "1" "2" "3" "4" "5"
feedback
required
string (Feedback)
trade
required
string (Trade)
UUID of the trade you want to provide the feedback on.

Responses
201 Success response
RESPONSE SCHEMA: application/json
feedback_for	
object (Feedback for)
Username

rating	
string <decimal> (Rating) Nullable
feedback	
string (Feedback) Nullable
feedback_by	
object (Feedback for)
Username

id	
integer (ID)
rating_percentage	
string (Rating percentage)
time_created	
integer (Created time) [ 0 .. 2147483647 ] Nullable
trade
required
string <uuid> (Trade)
POST
/trades/feedback/create/
https://api.localcoinswap.com/api/v2/trades/feedback/create/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"rating": "1",
"feedback": "string",
"trade": "string"
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
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
List trade feedbacks.
Filter from list of trade feedbacks.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
rating	
number
feedback_by	
string
feedback_for	
string
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
GET
/trades/feedback/list/
https://api.localcoinswap.com/api/v2/trades/feedback/list/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/feedback/list/?feedback_for=3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 0,
"next": "None",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 0,
"results": [
[]
]
}
trades_history-metrics_read
Get metrics for trade history with this user.

AUTHORIZATIONS:
Token
PATH PARAMETERS
username
required
string
Responses
200
GET
/trades/history-metrics/{username}/
https://api.localcoinswap.com/api/v2/trades/history-metrics/{username}/
Download trade history.
Endpoint which returns the user's historical trade history.

AUTHORIZATIONS:
Token
Responses
200 Success response
GET
/trades/history/
https://api.localcoinswap.com/api/v2/trades/history/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/history/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
"csv file"
List trades.
Retrives a list where the authenticated user is either a buyer/seller.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
status	
string
coin_currency	
string
List of cryptocurrencies to filter by. Takes slug of the currency.

stage	
string
Enum: "live", "past".

Useful when you only want to view all live/ongoing trades for example.

trade_format	
string
Enum: "standard", "non-custodial".

trade_type	
string
Enum: "buy", "sell".

trade_status	
string
payment_method	
string
List of payment-methods to filter by. Takes slug of payment method.

fiat_currency	
string
List of fiat currencies to filter by. Takes symbol of the currency.

text	
string
Search by username of traders.

user	
string
Filter by exact username.

ordering	
string
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
GET
/trades/list/
https://api.localcoinswap.com/api/v2/trades/list/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/list?coin_currency=2&amp;stage=live/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 75,
"next": "https://api.localcoinswap.com/api/v2/trades/list/?limit=5&offset=5",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 15,
"results": [
{},
{}
]
}
Get trade message object.
To get the trade message object by its id.

AUTHORIZATIONS:
Token
PATH PARAMETERS
message_id
required
string
Responses
200
RESPONSE SCHEMA: application/json
id	
integer (ID)
content	
string (Content) Nullable
attachment	
string (Attachment)
time_created	
integer (Created at) [ 0 .. 2147483647 ]
created_by	
object (Ref user)
recipient	
object (Ref user)
GET
/trades/message/get/{message_id}/
https://api.localcoinswap.com/api/v2/trades/message/get/{message_id}/
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
"date_joined": "2025-01-15T11:44:10Z",
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
"date_joined": "2025-01-15T11:44:10Z",
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
List trade messages.
Retrives a list of messages for a trade where the authenticated user is either a buyer/seller.

AUTHORIZATIONS:
Token
PATH PARAMETERS
contract_uuid
required
string
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200 Success response
GET
/trades/message/list/{contract_uuid}/
https://api.localcoinswap.com/api/v2/trades/message/list/{contract_uuid}/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/message/list/8e35e145-44b6-48a6-903e-a340b5c61384/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"active_page": 1,
"count": 3,
"next": "None",
"previous": "None",
"offset": 0,
"limit": 5,
"total_pages": 1,
"results": [
{},
{},
{}
]
}
Send message on trade.
Sends a chat message for the provided trade uuid.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
REQUEST BODY SCHEMA: application/json
content	
string (Content) Nullable
message	
string (Message) <= 2000 characters Nullable
created_by	
object (Ref user)
Responses
201 Success response
POST
/trades/message/{uuid}/
https://api.localcoinswap.com/api/v2/trades/message/{uuid}/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"content": "string",
"message": "string",
"created_by": {
"username": "string",
"timezone": "string",
"local_currency_symbol": "string",
"bio": "string",
"is_staff": true,
"is_superuser": true,
"last_seen": 0,
"feedback_score": "string",
"completed_trades": 0,
"trades_30d": 0,
"avg_response_time": 0,
"user_uuid": "string",
"date_joined": "2025-01-15T11:44:10Z",
"is_legacy": true,
"primary_language": "en",
"lang_list": "string",
"times_blocked": 0,
"times_followed": 0,
"imported_total_trades": 0,
"on_holiday": true,
"non_custodial": true,
"xp_level": "NEWBIE",
"xp": 0
}
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"attachment": "https://localcoinswap.com/media/contract_messages/boat.png",
"content": "Hello, lets trade"
}
Create non-custodial trade.
Create a custodial trade from the provided offer uuid. Offer creator can then choose to accept or reject trade. This can be done only by authenticated users.

AUTHORIZATIONS:
Token
REQUEST BODY SCHEMA: application/json
offer
required
string (Offer)
UUID of the Offer you want to initiate the trade with.

fiat_amount
required
string <decimal> (Fiat amount)
Amount in fiat (local) currency corresponding to the crypto value to buy/sell.

coin_amount
required
string <decimal> (Coin amount)
Crypto value for the trade.

wallet_address
required
string (Wallet address) [ 1 .. 256 ] characters
Wallet address you want to use to start the trade.

wallet_pubkey	
string (Wallet pubkey) <= 256 characters
Public key hex corresponding to wallet_address.

wallet_type	
string (Wallet type)
Default: "webwallet"
Value: "webwallet"
Web wallet is the non-custodial LocalCoinSwap Wallet. You can also connect Metamask wallet and use that to start a trade. This requires authorization from Metamask when funding/releasing escrow.

btc_trade_secrets	
object (Btc trade secrets)
This is only required for non-custodial BTC trades.

Responses
201 Success response
RESPONSE SCHEMA: application/json
status	
string (Status)
Enum: "CREATED" "ACCEPTED" "REJECTED" "WAITING_FOR_ESCROW" "BROADCASTING_ESCROW" "BROADCASTING_ESCROW_FAILED" "WAITING_FOR_MIN_ESCROW_CONFIRMS" "CRYPTO_ESC" "CRYPTO_ESC_FAILED" "FUND_PAID" "FUND_RECEIVED" "COMPLETED" "EXPIRED" "DISPUTED" "DISPUTE_RESOLVE_BUYER" "DISPUTE_RESOLVE_SELLER" "CANCELLATION_REQUESTED" "CANCELLED" "CANCELLATION_REJECTED" "BROADCASTING_RELEASE" "BROADCASTING_RELEASE_FAILED" "WAITING_FOR_CRYPTO_RELEASE_CONFIRMS" "CRYPTO_REL" "CRYPTO_REL_FAILED" "PUBLISHING_SELLER_ESCROW" "ARB_PUBLISHING_RELEASE_TX" "ARB_RELEASE_FAILED" "WAITING_SELLER_RELEASE" "PUBLISHING_SELLER_RELEASE" "SELLER_RELEASE_FAILED" "ARB_PUBLISHING_CANCEL_TXS" "ARB_CANCEL_FAILED" "WAITING_SELLER_CANCEL" "PUBLISHING_SELLER_CANCEL" "SELLER_CANCEL_FAILED" "ARB_PUBLISHING_DISPUTE_TXS" "ARB_DISPUTE_FAILED" "WAITING_DISPUTE_BUYER" "WAITING_DISPUTE_SELLER" "PUBLISHING_BUYER_DISPUTE" "PUBLISHING_SELLER_DISPUTE" "SELLER_DISPUTE_FAILED" "BUYER_DISPUTE_FAILED" "WAITING_FOR_MIN_APPROVE_CONFIRMS" "TRANSFER_APPROVED" "TRANSFER_APPROVAL_FAILED" "WAITING_FOR_TRANSFER_APPROVE"
uuid	
string <uuid> (Uuid)
POST
/trades/non-custodial/create/
https://api.localcoinswap.com/api/v2/trades/non-custodial/create/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"offer": "string",
"fiat_amount": "string",
"coin_amount": "string",
"wallet_address": "string",
"wallet_pubkey": "string",
"wallet_type": "webwallet",
"btc_trade_secrets": {
"encrypted_secret": "string",
"hashed_secret": "string",
"hashed_public_key": "string",
"hashed_secret_signed": "string",
"address_signed": "string"
}
}
Response samples
201
Content type
application/json
Copy
Expand allCollapse all
{
"status": "CREATED",
"uuid": "02789d73-caca-4b42-8362-0abeb0669d92"
}
Update non-custodial trade.
Used for changing the status of a trade. This can be done only by authenticated users.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
REQUEST BODY SCHEMA: application/json
status	
string (Status)
Default: "ACCEPTED"
Enum: "ACCEPTED" "WAITING_FOR_MIN_APPROVE_CONFIRMS" "TRANSFER_APPROVED" "WAITING_FOR_MIN_ESCROW_CONFIRMS" "CRYPTO_ESC" "FUND_PAID" "FUND_RECEIVED" "PUBLISHING_SELLER_RELEASE" "DISPUTED" "PUBLISHING_BUYER_DISPUTE" "PUBLISHING_SELLER_DISPUTE" "CANCELLED" "CANCELLATION_REJECTED" "PUBLISHING_SELLER_CANCEL"
The status in which you want to move the trade into.
ACCEPTED - When you want to accept a trade initiated on your offer.
Only offer creator can accept a trade.
When seller accepts the trade and if they have enough funds in their LocalCoinSwap Wallet, transition to CRYPTO_ESC happens automatically.
WAITING_FOR_MIN_APPROVE_CONFIRMS
When you are waiting for the minimum number of blockchain confirmations for an ERC20 approval transaction.
This step is required only for ERC20 token (excluding ETH)
TRANSFER_APPROVED - When you want to approve ERC20 non-custodial escrow.
Only seller can perform this action.
This step is required only for ERC20 token (excluding ETH)
WAITING_FOR_MIN_ESCROW_CONFIRMS
When you are waiting for the minimum number of blockchain confirmations for an escrow transaction.
CRYPTO_ESC - When you want to fund the Escrow.
Only seller can perform this action.
Requires enough funds in the selected non-custodial Wallet.
FUND_PAID - When you want to indicate that you have transferred fiat/local currency payment via the payment method agreed upon based on offer terms.
Only buyer can perform this action.
FUND_RECEIVED - When you want to indicate that you have received fiat/local currency payment from the buyer.
PUBLISHING_SELLER_RELEASE
When you sign the payload to release.
Only seller can perform this action.
CANCELLED - When you want to canel a trade.
If the current status of the trade allows cancellation right away, the trade will be marked cancelled.
Else, the trade will follow double-confirmation flow where both seller and buyer have to mutually agree to cancel the trade.
CANCELLATION_REJECTED - When you want to reject the cancellation request.
PUBLISHING_SELLER_CANCEL - When you want to revert the escrowed crypto.
wallet_address	
string (Wallet address) [ 1 .. 256 ] characters
Wallet address you want to use to accept the trade. Required only at the time of accepting a non-custodial trade.

wallet_pubkey	
string (Wallet pubkey) <= 256 characters
Public key hex corresponding to wallet_address.

wallet_type	
string (Wallet type)
Default: "webwallet"
Value: "webwallet"
Required only at the time of accepting a non-custodial trade. Web wallet is the non-custodial LocalCoinSwap Wallet. You can also connect Metamask wallet and use that to start a trade. This requires authorization from Metamask when funding/releasing escrow.

signed_txn	
string (Signed txn) non-empty
fee_signed_txn	
string (Fee signed txn) non-empty
This is only required to mark non-custodial substrate trades as WAITING_FOR_MIN_ESCROW_CONFIRMS by the seller.

trx_signed_txn	
object (Trx signed txn)
broadcasted_txn_hash	
string (Broadcasted txn hash) non-empty
This is used only when you connect a hardware wallet like Metamask with LocalCoinSwap. You have to broadcast the signed transaction yourself and pass the broadcasted transaction hash to the API.

signed_relay_signature	
object (Signed relay signature)
This is only required to mark non-custodial ERC20 trades as FUND_RECEIVED by the seller.

release_signature	
string (Release signature)
This is only required to release escrow for LTC trades.

release_psbt_base64	
string (Release psbt base64)
This is only required to release escrow for LTC trades.

cancel_signature	
string (Cancel signature)
This is only required to cancel escrow for LTC trades.

cancel_psbt_base64	
string (Cancel psbt base64)
This is only required to cancel escrow for LTC trades.

signed_as_multi	
string (Signed as multi) non-empty
This is only required to release escrow for substrate while moving the trade into PUBLISHING_SELLER_RELEASE.

signed_dispute_payload	
string (Signed dispute payload) non-empty
This is only required to resolve dispute for substrate trades.

btc_trade_secrets	
object (Btc trade secrets)
This is only required for non-custodial BTC trades.

seller_secret	
string (Seller secret) non-empty
This is only required to mark non-custodial BTC trades as FUND_RECEIVED by the seller.

cancellation_secret	
string (Cancellation secret) non-empty
This is only required to cancel BTC trades that have escrowed

cancellation_signature	
object (Signed relay signature)
This is only required to mark non-custodial ERC20 trades as FUND_RECEIVED by the seller.

signed_cancel_payload	
string (Signed cancel payload) non-empty
This is only required to cancel for substrate trades that have escrowed.

cancellation_reason	
string (Cancellation reason) Nullable
Enum: "CREATE_ANOTHER_TRADE_WITH_USER" "MARKET_PRICE_CHANGED" "OTHER_USER_SLOW" "USER_NOT_AVAILABLE" "CUSTODIAL_NC_CONFUSION" "OTHER_USER_CHANGED_TERMS" "COULDNT_MEET_TERMS" "PAYMENT_METHOD_ISSUE" "LCS_WEBSITE_ISSUE" "COMPLETED_TRADE_ELSEWHERE" "OTHER_USER_SUSPICIOUS" "OPENED_TRADE_BY_MISTAKE" "OTHER"
Responses
200
RESPONSE SCHEMA: application/json
id	
integer (ID)
ad	
object (Ad)
status	
string (Status)
Enum: "CREATED" "ACCEPTED" "REJECTED" "WAITING_FOR_ESCROW" "BROADCASTING_ESCROW" "BROADCASTING_ESCROW_FAILED" "WAITING_FOR_MIN_ESCROW_CONFIRMS" "CRYPTO_ESC" "CRYPTO_ESC_FAILED" "FUND_PAID" "FUND_RECEIVED" "COMPLETED" "EXPIRED" "DISPUTED" "DISPUTE_RESOLVE_BUYER" "DISPUTE_RESOLVE_SELLER" "CANCELLATION_REQUESTED" "CANCELLED" "CANCELLATION_REJECTED" "BROADCASTING_RELEASE" "BROADCASTING_RELEASE_FAILED" "WAITING_FOR_CRYPTO_RELEASE_CONFIRMS" "CRYPTO_REL" "CRYPTO_REL_FAILED" "PUBLISHING_SELLER_ESCROW" "ARB_PUBLISHING_RELEASE_TX" "ARB_RELEASE_FAILED" "WAITING_SELLER_RELEASE" "PUBLISHING_SELLER_RELEASE" "SELLER_RELEASE_FAILED" "ARB_PUBLISHING_CANCEL_TXS" "ARB_CANCEL_FAILED" "WAITING_SELLER_CANCEL" "PUBLISHING_SELLER_CANCEL" "SELLER_CANCEL_FAILED" "ARB_PUBLISHING_DISPUTE_TXS" "ARB_DISPUTE_FAILED" "WAITING_DISPUTE_BUYER" "WAITING_DISPUTE_SELLER" "PUBLISHING_BUYER_DISPUTE" "PUBLISHING_SELLER_DISPUTE" "SELLER_DISPUTE_FAILED" "BUYER_DISPUTE_FAILED" "WAITING_FOR_MIN_APPROVE_CONFIRMS" "TRANSFER_APPROVED" "TRANSFER_APPROVAL_FAILED" "WAITING_FOR_TRANSFER_APPROVE"
status_meta
required
object (Status meta)
uuid	
string <uuid> (Uuid)
contract_responder	
object (Contract responder)
buyer	
object (Contract responder)
seller	
object (Contract responder)
disputed_by	
object (User)
fiat_amount
required
string <decimal> (Fiat amount)
coin_amount
required
string <decimal> (Coin amount)
time_of_expiry	
integer (Expiry time) [ 0 .. 2147483647 ] Nullable
time_created	
integer (Created time) [ 0 .. 2147483647 ] Nullable
coin_currency	
object
fiat_currency	
object
crypto_in_usd	
string <decimal> (Crypto value in USD)
Value of crypto in USD at the time of trade creation.

responder_geo
required
object (Responder geo)
tx_meta
required
object (Tx meta)
buyer_meta
required
object (Buyer meta)
seller_meta
required
object (Seller meta)
non_custodial	
boolean (Non custodial)
amount_to_escrow
required
string <decimal> (Amount to escrow)
fees
required
string <decimal> (Fees)
btc_escrow_data
required
object (Btc escrow data)
eth_escrow_data
required
object (Eth escrow data)
multisig_escrow_data
required
object (Multisig escrow data)
PATCH
/trades/non-custodial/update/{uuid}/
https://api.localcoinswap.com/api/v2/trades/non-custodial/update/{uuid}/
Request samples
Payloadbashpythonjavascript
Content type
application/json
Copy
Expand allCollapse all
{
"status": "ACCEPTED",
"wallet_address": "string",
"wallet_pubkey": "string",
"wallet_type": "webwallet",
"signed_txn": "string",
"fee_signed_txn": "string",
"trx_signed_txn": { },
"broadcasted_txn_hash": "string",
"signed_relay_signature": {
"r": "string",
"s": "string",
"v": 0
},
"release_signature": "string",
"release_psbt_base64": "string",
"cancel_signature": "string",
"cancel_psbt_base64": "string",
"signed_as_multi": "string",
"signed_dispute_payload": "string",
"btc_trade_secrets": {
"encrypted_secret": "string",
"hashed_secret": "string",
"hashed_public_key": "string",
"hashed_secret_signed": "string",
"address_signed": "string"
},
"seller_secret": "string",
"cancellation_secret": "string",
"cancellation_signature": {
"r": "string",
"s": "string",
"v": 0
},
"signed_cancel_payload": "string",
"cancellation_reason": "CREATE_ANOTHER_TRADE_WITH_USER"
}
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 0,
"ad": { },
"status": "CREATED",
"status_meta": { },
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
"date_joined": "2025-01-15T11:44:10Z"
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
"date_joined": "2025-01-15T11:44:10Z"
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
"date_joined": "2025-01-15T11:44:10Z"
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
"responder_geo": { },
"tx_meta": { },
"buyer_meta": { },
"seller_meta": { },
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
Watch escrow txn trigger.
This is created so that we don't have to keep polling btc node. We call this API when tx confirms on the node.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string
Responses
201
POST
/trades/non-custodial/watch-txn/{uuid}/
https://api.localcoinswap.com/api/v2/trades/non-custodial/watch-txn/{uuid}/
trades_to-uuid_read
Get trade uuid from first 8 chars.

AUTHORIZATIONS:
Token
PATH PARAMETERS
trade_id
required
string
Responses
200
GET
/trades/to-uuid/{trade_id}/
https://api.localcoinswap.com/api/v2/trades/to-uuid/{trade_id}/
trades_withdraw-dispute_create
AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string
Responses
201
POST
/trades/withdraw-dispute/{uuid}/
https://api.localcoinswap.com/api/v2/trades/withdraw-dispute/{uuid}/
Get trade by UUID.
Get trade details with provided UUID. Only seller or buyer of the trade can request trade details.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string <uuid>
Responses
200 Success response
GET
/trades/{uuid}/
https://api.localcoinswap.com/api/v2/trades/{uuid}/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"id": 22949,
"ad": {
"uuid": "a73b2a38-2f4a-4de6-a7f1-f0d2739e0759",
"created_by": {},
"is_active": true,
"is_available": true,
"fiat_currency": {},
"coin_currency": {},
"payment_method": {},
"trading_type": {},
"trading_hours": "Mon - Sun: Trading all day<br />\n",
"min_trade_size": "1.0000000000",
"max_trade_size": "1.0000000000",
"enforced_sizes": "",
"trading_conditions": "",
"location_name": "Little Mountain",
"country_code": "AU",
"price_formula_value": "23451.271183213503",
"price_formula": {},
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
"coordinates": {},
"current_margin_percentage": "50.0000000000",
"headline": "",
"custodial_type": 2
},
"status": "WAITING_FOR_MIN_ESCROW_CONFIRMS",
"status_meta": {
"CRYPTO_ESC": {}
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
"languages": [ ],
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
"languages": [ ],
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
"languages": [ ],
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
"location": {}
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
Get trade feedback.
Feedback submitted by the authenticated user on the trade is retrieved.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string
Responses
200 Success response
GET
/trades/{uuid}/feedback/
https://api.localcoinswap.com/api/v2/trades/{uuid}/feedback/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/feedback/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
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
trades_invoice_create
AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string
Responses
201
POST
/trades/{uuid}/invoice/
https://api.localcoinswap.com/api/v2/trades/{uuid}/invoice/
Get trade status.
Use this to quickly check trade status. This is faster than retrieving full trade details. Prefer this when you only need to check the current status of the trade.

AUTHORIZATIONS:
Token
PATH PARAMETERS
uuid
required
string
Responses
200 Success response
GET
/trades/{uuid}/status/
https://api.localcoinswap.com/api/v2/trades/{uuid}/status/
Request samples
bashpythonjavascript
Copy
curl \
--request GET 'https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/status/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Token YOUR_TOKEN_HERE' \

Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"uuid": "f3c6120b-d63a-4a1f-9d18-f181c4be29c2",
"status": "COMPLETED"
}
Notifications
Get notifs as list.
Paginated notifs API for authenticated users.

AUTHORIZATIONS:
Token
QUERY PARAMETERS
limit	
integer
Number of results to return per page.

offset	
integer
The initial index from which to return the results.

Responses
200
RESPONSE SCHEMA: application/json
count
required
integer
next	
string <uri> Nullable
previous	
string <uri> Nullable
results
required
Array of objects (Notif)
GET
/notifs/
https://api.localcoinswap.com/api/v2/notifs/
Response samples
200
Content type
application/json
Copy
Expand allCollapse all
{
"count": 0,
"next": "http://example.com",
"previous": "http://example.com",
"results": [
{}
]
}
Mark all notifications as read.
This removes the red dot from the notifs in UI. The highlighting in the notifs dropdown still stays intact.

AUTHORIZATIONS:
Token
Responses
201
POST
/notifs/read/
https://api.localcoinswap.com/api/v2/notifs/read/
Mark notification as read.
This removes the highlighting for notifs

AUTHORIZATIONS:
Token
PATH PARAMETERS
notif_id
required
string
Responses
201
POST
/notifs/read/{notif_id}/
https://api.localcoinswap.com/api/v2/notifs/read/{notif_id}/
Mark all notifications as seen.
This removes the red dot from the notifs in UI. The highlighting in the notifs dropdown still stays intact.

AUTHORIZATIONS:
Token
Responses
201

Swagger

{"swagger": "2.0", "info": {"title": "LocalCoinSwap Exchange API", "description": "\n# Introduction\nThis API provides complete functionality for the LocalCoinSwap exchange.\nYou can use this API to search for offers, manage your offers, and automate the\ntrading process.\n\nThis API supports non-custodial trading in Bitcoin, Ethereum, Kusama, and all ERC20's.\n\nThis API supports custodial trading in Bitcoin & Dash.\n\nWe have a dedicated [examples repository](https://github.com/LocalCoinSwap/api-examples)\nfor this API, which we will update whenever you ask us to. If you want to use our\nAPI to do something and you don't know how, just raise a\n[Github issue](https://github.com/LocalCoinSwap/api-examples/issues/new) and we will\nupdate the repository with an example of how to use the API to achieve your use-case.\nWe will create your example in either Python or Javascript, or maybe even both.\n\nWe are a fast-moving company and updates may be made to this API on short notice\nfor various reasons. However, we will endevour to remain backwards compatible\nwhere possible.\n\nDon't hesistate to get in touch with us if you need more help using the API, or if\nyou have a specific use-case the API does not cover. We are always interested in\nmaking our products easier for you to use, and are happy to update or modify the API\nitself to assist you in your programming goals.\n\n# Authentication\n\nThe API uses JWT Token Authentication scheme. Use the following steps to generate a token:\n\n1. How to generate API Token:\n    - Register on [LocalCoinSwap](https://localcoinswap.com/register/)\n    - Login to your account and go to [Preferences](https://localcoinswap.com/preferences/)\n    - Click on the **API** tab and then click on the **Generate Token** button\n    - Note down the token\n2. Include the returned token in the `Authorization` HTTP header as follows:\n```HTTP\nAuthorization: Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9\n```\n3. Unauthenticated responses that are denied permission will result in an HTTP 401 Unauthorized\n  response, with an appropriate WWW-Authenticate header. For example:\n```HTTP\nWWW-Authenticate: Token\n```\n```json\n{\n    \"message\": \"Authentication credentials were not provided.\",\n    \"code\": \"not_authenticated\",\n    \"error\": true\n}\n```\n\nSimple example of accessing a secured endpoint using Python:\n```python\nfrom requests import Session\n\ns = Session()\ns.headers.update({'Authorization': 'Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9'})\n\nresponse = s.post('https://api.localcoinswap.com/api/v2/notifs-seen/')\n\n```\n\nSimple example of accessing a secured endpoint using Javascript (ES6):\n```javascript\nimport axios from \"axios\";\n\nasync function examplePost() {\n  const url = \"https://api.localcoinswap.com/api/v2/notifs-seen/\";\n  const result = await axios.get(\n    url, {headers: {\"Authorization\": \"Token ha8e9f7712531a70c65fbe03f9c37dfc1c8c0ee9\"}}\n  )\n}\n\nexamplePost()\n```\n", "termsOfService": "https://localcoinswap.com/terms-of-service/", "contact": {"email": "dev@localcoinswap.com"}, "license": {"name": "GPL-3.0 License"}, "x-logo": {"url": "https://localcoinswap.com/images/logo/lcs_logo_colored.svg", "altText": "LocalCoinSwap"}, "version": ""}, "host": "api.localcoinswap.com", "schemes": ["https"], "basePath": "/api/v2", "consumes": ["application/json"], "produces": ["application/json"], "securityDefinitions": {"Token": {"type": "apiKey", "name": "Authorization", "in": "header"}}, "security": [{"Token": []}], "paths": {"/academy/get-like/": {"post": {"operationId": "academy_get-like_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["academy"]}, "parameters": []}, "/academy/post-like/": {"post": {"operationId": "academy_post-like_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["academy"]}, "parameters": []}, "/academy/subscribe/": {"post": {"operationId": "academy_subscribe_create", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/AcademySubscriptionCreate"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/AcademySubscriptionCreate"}}}, "tags": ["academy"]}, "parameters": []}, "/approx-geo/": {"get": {"operationId": "approx-geo_list", "description": "Get geo based on IP for search box.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": ""}}, "tags": ["approx-geo"]}, "parameters": []}, "/bid-round/bids/{bid_round}/": {"get": {"operationId": "bid-round_bids_read", "description": "", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/BidRead"}}}}}}, "tags": ["bid-round"]}, "parameters": [{"name": "bid_round", "in": "path", "required": true, "type": "string"}]}, "/bid/": {"post": {"operationId": "bid_create", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/BidCreate"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/BidCreate"}}}, "tags": ["bid"]}, "parameters": []}, "/currencies/active-cryptos/": {"get": {"operationId": "currencies_active_cryptos", "summary": "Active cryptos on exchange.", "description": "Get a list of all the cryptos currently active on the\nexchange and their associated information.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/Currency"}}}}, "examples": {"application/json": {"active_page": 1, "count": 9, "next": "https://api.localcoinswap.com/api/v2/currencies/active-cryptos/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 2, "results": [{"id": 1, "title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true, "withdraw_fee": "0.000070000000000000", "minimum_withdrawal": "0.001000000000000000", "slug": "bitcoin-BTC", "active_status": "currency_active"}, {"id": 2, "title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true, "withdraw_fee": "0.002000000000000000", "minimum_withdrawal": "0.007830853563000000", "slug": "ethereum-ETH", "active_status": "currency_active"}, {"id": 15, "title": "Dash", "symbol": "DASH", "symbol_filename": "dash.svg", "is_crypto": true, "withdraw_fee": "0.000500000000000000", "minimum_withdrawal": "0.001000000000000000", "slug": "dash-DASH", "active_status": "currency_active"}, {"id": 19, "title": "Tether", "symbol": "USDT", "symbol_filename": "usdt.svg", "is_crypto": true, "withdraw_fee": "1.000000000000000000", "minimum_withdrawal": "3.000000000000000000", "slug": "tether-USDT", "active_status": "currency_active"}, {"id": 23, "title": "Dai Stablecoin", "symbol": "DAI", "symbol_filename": "dai.svg", "is_crypto": true, "withdraw_fee": "1.000000000000000000", "minimum_withdrawal": "3.000000000000000000", "slug": "dai-stablecoin-DAI", "active_status": "currency_active"}]}}}}, "tags": ["currencies"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/currencies/crypto-currencies/": {"get": {"operationId": "currencies_crypto_currencies", "summary": "Cryptocurrencies.", "description": "List of cryptocurrencies supported on the platform.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/MinimalCurrency"}}}}, "examples": {"application/json": {"active_page": 1, "count": 28, "next": "https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 6, "results": [{"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, {"title": "Dash", "symbol": "DASH", "symbol_filename": "dash.svg", "is_crypto": true}, {"title": "Monero", "symbol": "XMR", "symbol_filename": "None", "is_crypto": true}, {"title": "Tether", "symbol": "USDT", "symbol_filename": "usdt.svg", "is_crypto": true}]}}}}, "tags": ["currencies"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/currencies/crypto-currencies/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/currencies/fiat-currencies/": {"get": {"operationId": "currencies_fiat_currencies", "summary": "Local currencies.", "description": "List of local (fiat) currencies supported on the platform.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/MinimalCurrency"}}}}, "examples": {"application/json": {"active_page": 1, "count": 168, "next": "https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 34, "results": [{"title": "Afghan Afghani", "symbol": "AFN", "symbol_filename": "None", "is_crypto": false}, {"title": "Albanian Lek", "symbol": "ALL", "symbol_filename": "None", "is_crypto": false}, {"title": "Algerian Dinar", "symbol": "DZD", "symbol_filename": "None", "is_crypto": false}, {"title": "Angolan Kwanza", "symbol": "AOA", "symbol_filename": "None", "is_crypto": false}, {"title": "Argentine Peso", "symbol": "ARS", "symbol_filename": "None", "is_crypto": false}]}}}}, "tags": ["currencies"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/currencies/fiat-currencies/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/currencies/{symbol}/": {"get": {"operationId": "currencies_read", "summary": "Cryptocurrency details.", "description": "Returns full detail of a currency by symbol i.e. `BTC`, `USD` etc.", "parameters": [], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/CurrencyWithMeta"}, "examples": {"application/json": {"id": 3, "title": "LCS Cryptoshares", "symbol": "LCS", "symbol_filename": "lcs.svg", "is_crypto": true, "withdraw_fee": "38.000000000000000000", "minimum_withdrawal": "99.000000000000000000", "metadata": {"banner_image": "/media/currency/start_trading_lcs.png", "about": "Cryptoshares (LCS) are the native currency of the LocalCoinSwap platform", "official_website": "https://localcoinswap.com/", "initial_release": 1523750400, "min_unit_name": "None", "total_supply": 72732420, "circulating_supply": 40211430, "cmc_analytics": {"id": 3, "symbol": "LCS", "usd_price": "0.0093986938", "usd_market_cap": "492841.1945892310", "usd_volume_24h": "8037.5140275405", "percent_change_1h": "0.9349020000", "percent_change_24h": "2.4310200000", "percent_change_7d": "26.4646000000", "usd_last_updated": 1597384689, "last_updated": 1597384789}}, "slug": "lcs-cryptoshares-LCS"}}}}, "tags": ["currencies"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/currencies/LCS/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/currencies/LCS/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/currencies/LCS/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "symbol", "in": "path", "required": true, "type": "string"}]}, "/get-round/{country_code}/{payment_method_slug}/": {"get": {"operationId": "get-round_read", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["get-round"]}, "parameters": [{"name": "country_code", "in": "path", "required": true, "type": "string"}, {"name": "payment_method_slug", "in": "path", "required": true, "type": "string"}]}, "/leaderboard/xp/": {"get": {"operationId": "leaderboard_xp_list", "description": "Return list of users sorted by xp.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/ProfileLeaderboard"}}}}}}, "tags": ["leaderboard"]}, "parameters": []}, "/marketing/feature-offer-request/": {"post": {"operationId": "marketing_feature-offer-request_create", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/FeatureOfferRequestCreate"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/FeatureOfferRequestCreate"}}}, "tags": ["marketing"]}, "parameters": []}, "/marketing/list-project-token/": {"post": {"operationId": "marketing_list-project-token_create", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/ProjectListingRequestCreate"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/ProjectListingRequestCreate"}}}, "tags": ["marketing"]}, "parameters": []}, "/notifs/": {"get": {"operationId": "notifs_list", "summary": "Get notifs as list.", "description": "Paginated notifs API for authenticated users.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/Notif"}}}}}}, "tags": ["notifs"], "x-code-samples": null}, "parameters": []}, "/notifs/read/": {"post": {"operationId": "notifs_read_create", "summary": "Mark all notifications as read.", "description": "This removes the red dot from the notifs in UI.\nThe highlighting in the notifs dropdown still stays intact.", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["notifs"]}, "parameters": []}, "/notifs/read/{notif_id}/": {"post": {"operationId": "notifs_read_create", "summary": "Mark notification as read.", "description": "This removes the highlighting for notifs", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["notifs"]}, "parameters": [{"name": "notif_id", "in": "path", "required": true, "type": "string"}]}, "/notifs/seen/": {"post": {"operationId": "notifs_seen_create", "summary": "Mark all notifications as seen.", "description": "This removes the red dot from the notifs in UI.\nThe highlighting in the notifs dropdown still stays intact.", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["notifs"]}, "parameters": []}, "/offers/": {"get": {"operationId": "offers_list", "summary": "Get your offers.", "description": "Returns list of offers created by the current user.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/OfferRead"}}}}, "examples": {"application/json": {"active_page": 1, "count": 9112, "next": "https://api.localcoinswap.com/api/v2/offers/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 1823, "results": [{"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Bitcoin (BTC)", "slug": "bitcoin-btc"}, "location_name": "Mountain View", "country_code": "US", "coordinates": {"latitude": 37.3860517, "longitude": -122.0838511}, "min_trade_size": "100.0000000000", "max_trade_size": "1000.0000000000", "trading_conditions": "Send me your bitcoin", "headline": "Bitcoin trading", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}, {"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Payoneer", "slug": "payoneer"}, "location_name": "", "country_code": "US", "coordinates": {"latitude": 37.09024, "longitude": -95.712891}, "min_trade_size": "50.0000000000", "max_trade_size": "400.0000000000", "trading_conditions": "Trade with us with Payoneer, fast transfer under 10 minuts", "headline": "", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}, {"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "Australian Dollar", "symbol": "AUD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayID", "slug": "payid"}, "location_name": "Sydney", "country_code": "AU", "coordinates": {"latitude": -33.8688197, "longitude": 151.2092955}, "min_trade_size": "100.0000000000", "max_trade_size": "100.0000000000", "trading_conditions": "BTC AUD Buy Now Cash Deposit CBA Australia\n\nPay via PAYID (Australia)\nAustralian Cash Deposit via CBA ATM. \nAfter deposit is made BTC will be released to you instantly. \nAustralian Buyers Only. Scammers will be prosecuted.", "headline": "", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}, {"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "Australian Dollar", "symbol": "AUD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash Deposit", "slug": "cash-deposit"}, "location_name": "Sydney", "country_code": "AU", "coordinates": {"latitude": -33.8688197, "longitude": 151.2092955}, "min_trade_size": "100.0000000000", "max_trade_size": "100.0000000000", "trading_conditions": "Australian Cash Deposit via CBA ATM.\nAfter deposit is made BTC will be released to you instantly.\nAustralian Buyers Only.\nScammers will be prosecuted.", "headline": "Instant Release BTC AUD Buy Now Cash Deposit CBA Australia", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}, {"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash App (Square Cash)", "slug": "cash-app-square-cash"}, "location_name": "Clearwater", "country_code": "US", "coordinates": {"latitude": 27.9658533, "longitude": -82.8001026}, "min_trade_size": "5.0000000000", "max_trade_size": "200.0000000000", "trading_conditions": "Flordia Kid", "headline": "", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}]}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "post": {"operationId": "offers_create", "summary": "Create offer.", "description": "Create a trade offer for others to respond to.\nThis can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/OfferCreate"}}], "responses": {"201": {"description": "Success response", "schema": {"$ref": "#/definitions/OfferCreate"}, "examples": {"application/json": {"trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24", "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayPal", "slug": "paypal"}, "country_code": "AW", "min_trade_size": 10, "max_trade_size": 2000, "trading_conditions": "Please be polite.", "headline": "", "hidden": false, "enforced_sizes": "", "automatic_cancel_time": 240, "sms_required": false, "minimum_feedback": 0, "custodial_type": 0}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/offers/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"USD\", \"payment_method\": \"PayPal\", \"country_code\": \"AW\", \"min_trade_size\": 10, \"max_trade_size\": 2000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"USD\", \"payment_method\": \"PayPal\", \"country_code\": \"AW\", \"min_trade_size\": 10, \"max_trade_size\": 2000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/offers/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"USD\", \"payment_method\": \"PayPal\", \"country_code\": \"AW\", \"min_trade_size\": 10, \"max_trade_size\": 2000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/dryrun-expression/": {"post": {"operationId": "offers_dryrun-expression_create", "summary": "Calculate advanced price.", "description": "The formula expression is directly passed into this endpoint to compute the result.\nThis can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/DryrunPricingExpressionRequest"}}], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/DryrunPricingFormulaResponse"}, "examples": {"application/json": {"price": "12863.983"}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/offers/dryrun-expression/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"expression\": \"market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1)\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"expression\": \"market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1)\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/offers/dryrun-expression/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"expression\": \"market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1)\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/dryrun-expression/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/dryrun-formula/": {"post": {"operationId": "offers_dryrun-formula_create", "summary": "Get price for market.", "description": "We create a formula expression from the parameters passed and then compute\nthe result. This can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/DryrunPricingFormulaRequest"}}], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/DryrunPricingFormulaResponse"}, "examples": {"application/json": {"price": "472.31389170020003"}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/offers/dryrun-formula/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"pricing_market\": \"cmc\", \"coin_currency\": \"ETH\", \"fiat_currency\": \"USD\", \"margin_percent\": \"10\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"pricing_market\": \"cmc\", \"coin_currency\": \"ETH\", \"fiat_currency\": \"USD\", \"margin_percent\": \"10\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/offers/dryrun-formula/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"pricing_market\": \"cmc\", \"coin_currency\": \"ETH\", \"fiat_currency\": \"USD\", \"margin_percent\": \"10\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/dryrun-formula/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/featured/": {"get": {"operationId": "offers_featured_list", "description": "", "parameters": [{"name": "coin_currency", "in": "query", "description": "List of cryptocurrencies to filter by. Takes `slug` of the currency.", "required": false, "type": "string"}, {"name": "trading_type", "in": "query", "description": "Filter by either buy/sell trades.", "required": false, "type": "string"}, {"name": "fiat_currency", "in": "query", "description": "List of fiat currencies to filter by. Takes `symbol` of the currency.", "required": false, "type": "string"}, {"name": "payment_method", "in": "query", "description": "List of payment-methods to filter by. Takes `slug` of payment method.", "required": false, "type": "string"}, {"name": "country_code", "in": "query", "description": "\nTo prioritize given country in the list. If no offers found in the\ngiven country then other relevant offers may still show up.\n", "required": false, "type": "string"}, {"name": "username", "in": "query", "description": "Search by username of traders.", "required": false, "type": "string"}, {"name": "last_seen", "in": "query", "description": "\nFilter by last seen time of the trader.\nSupported input: `\"30mins\"`, `\"24hours\"`, `\"1week\"`, `\"2weeks\"`, `\"1month\"`", "required": false, "type": "string"}, {"name": "hide_new", "in": "query", "description": "Whether to hide offers from new users or not.", "required": false, "type": "string"}, {"name": "created_by", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "ordering", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "country_code_exact", "in": "query", "description": "\nTo filter by given country, returns empty if no offers in given country.\n", "required": false, "type": "string"}, {"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/OfferList"}}}}, "examples": {"application/json": {"active_page": 1, "count": 912, "next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy", "previous": "None", "offset": 0, "limit": 5, "total_pages": 183, "results": [{"uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24", "created_by": {"username": "Taylor", "activity_status": "recently-active", "activity_tooltip": "Seen 53\\xa0minutes ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 27, "last_seen": 1597396837, "is_legacy": false, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "completed_trades": 32}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayPal", "slug": "paypal"}, "location_name": "", "country_code": "AW", "min_trade_size": "10.0000000000", "max_trade_size": "2000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-aruba"}, {"uuid": "eb0151b1-827b-475f-9e0e-a4765a4fcac8", "created_by": {"username": "Benbands", "activity_status": "inactive", "activity_tooltip": "Seen 4\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 3219, "last_seen": 1597384804, "is_legacy": false, "user_uuid": "01f9ac81-c46b-4bf6-b4f9-e310cfe4ab7e", "completed_trades": 0}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Bank Transfer", "slug": "bank-transfers"}, "location_name": "", "country_code": "SG", "min_trade_size": "500.0000000000", "max_trade_size": "5000.0000000000", "headline": "Many other payment option available", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-singapore"}, {"uuid": "92215a31-fc4e-4c4e-87aa-828ed5bfbe72", "created_by": {"username": "Shiee", "activity_status": "inactive", "activity_tooltip": "Seen 8\\xa0hours ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 0, "last_seen": 1597369701, "is_legacy": false, "user_uuid": "f5b1d2d4-f1cd-45fa-947d-b7b821c0db10", "completed_trades": 0}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayPal", "slug": "paypal"}, "location_name": "Mountain View", "country_code": "US", "min_trade_size": "200.0000000000", "max_trade_size": "3000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "14648.300236625", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}, {"uuid": "c5bb94cd-9807-4a84-9fc1-c6840e0477a6", "created_by": {"username": "sgornick", "activity_status": "inactive", "activity_tooltip": "Seen 1\\xa0day, 13\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 518, "last_seen": 1597265143, "is_legacy": false, "user_uuid": "149a48c6-4a21-4366-af18-06efb6eb25f6", "completed_trades": 6}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash in person", "slug": "cash-in-person"}, "location_name": "San Diego", "country_code": "US", "min_trade_size": "20.0000000000", "max_trade_size": "1000.0000000000", "headline": "San Diego, CA | Sell BTC for cash (USD), in-person", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11601.008100000001", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}, {"uuid": "b9c1cb3b-7542-43c2-89c6-a1a6bf09afbb", "created_by": {"username": "Soas14", "activity_status": "inactive", "activity_tooltip": "Seen 1\\xa0day, 19\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 0, "last_seen": 1597243312, "is_legacy": false, "user_uuid": "f5c7370d-4f5e-4fc7-8ea5-b990db506029", "completed_trades": 1}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash App (Square Cash)", "slug": "cash-app-square-cash"}, "location_name": "Islip", "country_code": "US", "min_trade_size": "1000.0000000000", "max_trade_size": "3000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}]}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/new-offer/": {"get": {"operationId": "offers_new-offer_list", "description": "Get data for rendering the new offer page.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": ""}}, "tags": ["offers"]}, "parameters": []}, "/offers/payment-methods/": {"get": {"operationId": "offers_payment-methods_list", "summary": "Payment methods.", "description": "List of payment methods supported for offer listing.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/MinimalPaymentMethod"}}}}, "examples": {"application/json": {"active_page": 1, "count": 262, "next": "https://api.localcoinswap.com/api/v2/offers/payment-methods/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 53, "results": [{"name": "Abra", "slug": "abra"}, {"name": "AccountNow Card2Card Transfer", "slug": "accountnow-card2card-transfer"}, {"name": "Adidas Gift Card", "slug": "adidas-gift-card"}, {"name": "AdvCash", "slug": "advcash"}, {"name": "Airbnb Gift Card", "slug": "airbnb-gift-card"}]}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/payment-methods/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/payment-methods/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/payment-methods/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/search-data/": {"get": {"operationId": "offers_search-data_list", "description": "Get data for rendering the search form.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": ""}}, "tags": ["offers"]}, "parameters": []}, "/offers/search/": {"get": {"operationId": "offers_search_list", "summary": "Search all offers.", "description": "Search through publicly listed trade offers.\nSupports sorting and filtering based on with multiple parameter combinations.", "parameters": [{"name": "coin_currency", "in": "query", "description": "List of cryptocurrencies to filter by. Takes `slug` of the currency.", "required": false, "type": "string"}, {"name": "trading_type", "in": "query", "description": "Filter by either buy/sell trades.", "required": false, "type": "string"}, {"name": "fiat_currency", "in": "query", "description": "List of fiat currencies to filter by. Takes `symbol` of the currency.", "required": false, "type": "string"}, {"name": "payment_method", "in": "query", "description": "List of payment-methods to filter by. Takes `slug` of payment method.", "required": false, "type": "string"}, {"name": "country_code", "in": "query", "description": "\nTo prioritize given country in the list. If no offers found in the\ngiven country then other relevant offers may still show up.\n", "required": false, "type": "string"}, {"name": "username", "in": "query", "description": "Search by username of traders.", "required": false, "type": "string"}, {"name": "last_seen", "in": "query", "description": "\nFilter by last seen time of the trader.\nSupported input: `\"30mins\"`, `\"24hours\"`, `\"1week\"`, `\"2weeks\"`, `\"1month\"`", "required": false, "type": "string"}, {"name": "hide_new", "in": "query", "description": "Whether to hide offers from new users or not.", "required": false, "type": "string"}, {"name": "created_by", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "ordering", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "country_code_exact", "in": "query", "description": "\nTo filter by given country, returns empty if no offers in given country.\n", "required": false, "type": "string"}, {"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/OfferList"}}}}, "examples": {"application/json": {"active_page": 1, "count": 912, "next": "https://api.localcoinswap.com/api/v2/offers/search/?amp=&amp=&coin_currency=BTC&fiat_currency=USD&limit=5&offset=5&trading_type=buy", "previous": "None", "offset": 0, "limit": 5, "total_pages": 183, "results": [{"uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24", "created_by": {"username": "Taylor", "activity_status": "recently-active", "activity_tooltip": "Seen 53\\xa0minutes ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 27, "last_seen": 1597396837, "is_legacy": false, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "completed_trades": 32}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayPal", "slug": "paypal"}, "location_name": "", "country_code": "AW", "min_trade_size": "10.0000000000", "max_trade_size": "2000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-aruba"}, {"uuid": "eb0151b1-827b-475f-9e0e-a4765a4fcac8", "created_by": {"username": "Benbands", "activity_status": "inactive", "activity_tooltip": "Seen 4\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 3219, "last_seen": 1597384804, "is_legacy": false, "user_uuid": "01f9ac81-c46b-4bf6-b4f9-e310cfe4ab7e", "completed_trades": 0}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Bank Transfer", "slug": "bank-transfers"}, "location_name": "", "country_code": "SG", "min_trade_size": "500.0000000000", "max_trade_size": "5000.0000000000", "headline": "Many other payment option available", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-singapore"}, {"uuid": "92215a31-fc4e-4c4e-87aa-828ed5bfbe72", "created_by": {"username": "Shiee", "activity_status": "inactive", "activity_tooltip": "Seen 8\\xa0hours ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 0, "last_seen": 1597369701, "is_legacy": false, "user_uuid": "f5b1d2d4-f1cd-45fa-947d-b7b821c0db10", "completed_trades": 0}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "PayPal", "slug": "paypal"}, "location_name": "Mountain View", "country_code": "US", "min_trade_size": "200.0000000000", "max_trade_size": "3000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "14648.300236625", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}, {"uuid": "c5bb94cd-9807-4a84-9fc1-c6840e0477a6", "created_by": {"username": "sgornick", "activity_status": "inactive", "activity_tooltip": "Seen 1\\xa0day, 13\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 518, "last_seen": 1597265143, "is_legacy": false, "user_uuid": "149a48c6-4a21-4366-af18-06efb6eb25f6", "completed_trades": 6}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash in person", "slug": "cash-in-person"}, "location_name": "San Diego", "country_code": "US", "min_trade_size": "20.0000000000", "max_trade_size": "1000.0000000000", "headline": "San Diego, CA | Sell BTC for cash (USD), in-person", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11601.008100000001", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}, {"uuid": "b9c1cb3b-7542-43c2-89c6-a1a6bf09afbb", "created_by": {"username": "Soas14", "activity_status": "inactive", "activity_tooltip": "Seen 1\\xa0day, 19\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 0, "last_seen": 1597243312, "is_legacy": false, "user_uuid": "f5c7370d-4f5e-4fc7-8ea5-b990db506029", "completed_trades": 1}, "trading_type": {"slug": "buy", "name": "buy", "opposite_name": "sell"}, "coin_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash App (Square Cash)", "slug": "cash-app-square-cash"}, "location_name": "Islip", "country_code": "US", "min_trade_size": "1000.0000000000", "max_trade_size": "3000.0000000000", "headline": "", "sms_required": false, "minimum_feedback": "0", "price_formula_value": "11484.267385514", "slug": "sell-bitcoin-btc-for-usd-in-united-states"}]}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/search/?coin_currency=BTC&amp;trading_type=buy&amp;fiat_currency=USD\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/slugs/": {"get": {"operationId": "offers_slugs_list", "summary": "Get all search index offer slugs.", "description": "We use this endpoint for sitemap generation.", "parameters": [], "responses": {"200": {"description": "", "schema": {"type": "array", "items": {"$ref": "#/definitions/OfferSlug"}}}}, "tags": ["offers"]}, "parameters": []}, "/offers/trade-types/": {"get": {"operationId": "offers_trade-types_list", "summary": "Trade types.", "description": "List of trade types supported for creating offer.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/MinimalTradeType"}}}}, "examples": {"application/json": {"active_page": 1, "count": 2, "next": "None", "previous": "None", "offset": 0, "limit": 5, "total_pages": 1, "results": [{"slug": "buy", "name": "buy", "opposite_name": "sell"}, {"slug": "sell", "name": "sell", "opposite_name": "buy"}]}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/trade-types/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/trade-types/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/trade-types/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/offers/{uuid}/": {"get": {"operationId": "offers_read", "summary": "Get offer by UUID.", "description": "This can be done by anonymous users.", "parameters": [], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/OfferRead"}, "examples": {"application/json": {"trading_type": {"slug": "sell", "name": "sell", "opposite_name": "buy"}, "coin_currency": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "fiat_currency": {"title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false}, "payment_method": {"name": "Cash Deposit", "slug": "cash-deposit"}, "location_name": "Ahmedabad", "country_code": "IN", "coordinates": {"latitude": 23.022505, "longitude": 72.5713621}, "min_trade_size": "100.0000000000", "max_trade_size": "10000.0000000000", "trading_conditions": "", "headline": "", "hidden": true, "enforced_sizes": "", "automatic_cancel_time": "240", "sms_required": false, "minimum_feedback": "0"}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/offers/9fd021ae-2339-4285-aa67-d4937a6b0012/' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/offers/9fd021ae-2339-4285-aa67-d4937a6b0012/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/9fd021ae-2339-4285-aa67-d4937a6b0012/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "patch": {"operationId": "offers_partial_update", "summary": "Update offer by UUID.", "description": "Update a trade offer for others to respond to.\nThis can be done only by the original offer creator.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/OfferUpdate"}}], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/OfferUpdate"}, "examples": {"application/json": {"uuid": "6c393ba2-665d-48c3-8aa6-e57c2e73fa24", "created_by": {"username": "Taylor", "local_currency_symbol": "AUD", "activity_status": "active", "activity_tooltip": "Seen a second ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 27, "completed_trades": 32, "last_seen": 1597401286, "is_legacy": false, "bio": "", "is_superuser": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "primary_language": "en", "on_holiday": false, "sound_notifications": true, "nc_pw_reset_done": true}, "is_active": true, "is_available": true, "fiat_currency": {"id": 10001, "title": "United States Dollar", "symbol": "USD", "symbol_filename": "None", "is_crypto": false, "withdraw_fee": "None", "minimum_withdrawal": "None", "slug": "united-states-dollar", "active_status": "currency_active"}, "coin_currency": {"id": 1, "title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true, "withdraw_fee": "0.000300000000000000", "minimum_withdrawal": "0.001000000000000000", "slug": "bitcoin-BTC", "active_status": "currency_active"}, "payment_method": {"id": 9, "name": "PayPal", "priority": 460, "slug": "paypal", "icon_filename": "None", "high_risk": true, "type": 3}, "trading_type": {"id": 1, "slug": "buy", "name": "buy", "action_name": "Buying", "opposite_name": "sell", "opposite_action_name": "Selling"}, "trading_hours": "Mon - Sun: 12:00 am  - 11:00 am , 10:30 pm  - 12:00 am (next day)<br />\n", "min_trade_size": "10.0000000000", "max_trade_size": "2000.0000000000", "enforced_sizes": "", "trading_conditions": "Please be polite.", "location_name": "", "country_code": "AW", "price_formula_value": "11507.622373702", "price_formula": {"display_formula": "-2", "prefix_formula": "exchange.btcusd|v||exchange.usdusd|v||*|o||0.98|n||*|o", "pricing_type": "MARGIN", "market": "cmc"}, "automatic_cancel_time": "240", "sms_required": false, "only_friends": false, "minimum_feedback": "0", "min_fiat_limit": 10, "max_fiat_limit": 2000, "current_price": "11507.6223737020", "current_price_usd": "11507.6223737020", "slug": "sell-bitcoin-btc-for-usd-in-aruba", "trading_hours_bits": "111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000111111", "trading_hours_localised": "Mon - Sun: 8:30 am  - 9:00 pm <br />\n", "trading_hours_bits_localised": "000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111000000000000", "hidden": false, "is_deleted": false, "coordinates": {"latitude": -70.0201, "longitude": 12.5391}, "current_margin_percentage": "-2.0000000000", "headline": "", "custodial_type": 0}}}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request PATCH 'https://api.localcoinswap.com/api/v2/offers/{uuid}/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"AUD\", \"payment_method\": \"PayPal\", \"country_code\": \"AU\", \"min_trade_size\": 10, \"max_trade_size\": 5000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"AUD\", \"payment_method\": \"PayPal\", \"country_code\": \"AU\", \"min_trade_size\": 10, \"max_trade_size\": 5000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"PATCH\", \"https://api.localcoinswap.com/api/v2/offers/{uuid}/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"trading_type\": \"buy\", \"coin_currency\": \"BTC\", \"fiat_currency\": \"AUD\", \"payment_method\": \"PayPal\", \"country_code\": \"AU\", \"min_trade_size\": 10, \"max_trade_size\": 5000, \"pricing_type\": \"MARGIN\", \"pricing_market\": \"cmc\", \"pricing_expression\": \"2\", \"trading_conditions\": \"Please be polite.\", \"trading_hours_type\": \"daily\", \"trading_hours_json\": {\"anyday\": {\"from\": \"08:30\", \"to\": \"21:00\"}}});\n\nvar requestOptions = {\n  method: \"PATCH\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/{uuid}/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "delete": {"operationId": "offers_delete", "summary": "Delete offer by UUID.", "description": "This can be done only by the original offer creator.", "parameters": [], "responses": {"204": {"description": ""}}, "tags": ["offers"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request DELETE 'https://api.localcoinswap.com/api/v2/offers/678ac0c8-07d1-4aba-9213-2f083059fc7f' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"DELETE\", \"https://api.localcoinswap.com/api/v2/offers/678ac0c8-07d1-4aba-9213-2f083059fc7f\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"DELETE\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/offers/678ac0c8-07d1-4aba-9213-2f083059fc7f\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string", "format": "uuid"}]}, "/onboarding/{user__user_uuid}/": {"get": {"operationId": "onboarding_read", "description": "", "parameters": [], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/OnboardingUpdate"}}}, "tags": ["onboarding"]}, "patch": {"operationId": "onboarding_partial_update", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/OnboardingUpdate"}}], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/OnboardingUpdate"}}}, "tags": ["onboarding"]}, "parameters": [{"name": "user__user_uuid", "in": "path", "required": true, "type": "string"}]}, "/profile-verif/new-form/": {"get": {"operationId": "profile-verif_new-form_list", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["profile-verif"]}, "parameters": []}, "/profile/encrypted-blob/": {"get": {"operationId": "profile_encrypted-blob_read", "summary": "Encrypted blob.", "description": "Encrypted container for a users account, normally provided after login\nwhen 2FA is complete. This contains the users secret mnemonic and\naccount key. Requires the users password to decrypt.\n\n**Warning: This blob protects your private keys and all the funds contained in\nyour account. Be very careful if you decide to decrypt it!**\n\nTo see how to decrypt this information you can\n<a href=\"https://github.com/LocalCoinSwap/localcoinswap-cryptography\" target=\"_blank\">\ncheck out some examples</a>", "parameters": [], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/ProfileCryptoDataRead"}}}, "tags": ["profile"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/profile/encrypted-blob/' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/profile/encrypted-blob/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/profile/encrypted-blob/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/profile/slugs/": {"get": {"operationId": "profile_slugs_list", "summary": "Get all search index profile slugs.", "description": "We use this endpoint for sitemap generation.", "parameters": [], "responses": {"200": {"description": "", "schema": {"type": "array", "items": {"$ref": "#/definitions/ProfileSlug"}}}}, "tags": ["profile"]}, "parameters": []}, "/profile/update-username/{user_uuid}/": {"patch": {"operationId": "profile_update-username_partial_update", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/ProfileUsernameUpdate"}}], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/ProfileUsernameUpdate"}}}, "tags": ["profile"]}, "parameters": [{"name": "user_uuid", "in": "path", "required": true, "type": "string"}]}, "/referrals/commission-payments/list/": {"get": {"operationId": "referrals_commission-payments_list_list", "description": "List of commissions paid to referrer.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/CommissionPaymentList"}}}}}}, "tags": ["referrals"]}, "parameters": []}, "/referrals/my-referrals/": {"get": {"operationId": "referrals_my-referrals_list", "description": "Return list of referrals.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/ReferredUsersSerialier"}}}}}}, "tags": ["referrals"]}, "parameters": []}, "/referrals/overview/": {"get": {"operationId": "referrals_overview_list", "description": "Get info about the auth user referral balance.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/ReferralCommission"}}}}}}, "tags": ["referrals"]}, "patch": {"operationId": "referrals_overview_partial_update", "description": "Get info about the auth user referral balance.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/ReferralCommission"}}], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/ReferralCommission"}}}, "tags": ["referrals"]}, "parameters": []}, "/referrals/trade-commissions/list/": {"get": {"operationId": "referrals_trade-commissions_list_list", "description": "List of per trade commission earned by referrer.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/TradeCommissionList"}}}}}}, "tags": ["referrals"]}, "parameters": []}, "/report-trader/": {"post": {"operationId": "report-trader_create", "summary": "Report trader.", "description": "Endpoint for reporting traders.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/ReportTrader"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/ReportTrader"}}}, "tags": ["report-trader"]}, "parameters": []}, "/swaps/": {"get": {"operationId": "swaps_list", "summary": "CRUD operations on Swap.", "description": "Also has a list endpoint to get list of current user's offers.\nThere's a separate endpoint to search all public swap listings\nendpoint with support for various filters.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/SwapRead"}}}}}}, "tags": ["swaps"], "x-code-samples": null}, "post": {"operationId": "swaps_create", "summary": "Create swap.", "description": "Create a swap trade.\nThis can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/SwapCreate"}}], "responses": {"201": {"description": "Success response", "schema": {"$ref": "#/definitions/SwapUuid"}, "examples": {"application/json": {"uuid": "ec8c3831-0bb4-48e7-9938-c072a5de544f", "status": "NEW", "provider": "CHANGENOW", "from_crypto": "ETH", "to_currency": "BTC", "from_amount": "0.100000000000000000", "payout_address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS", "refund_address": "0x8456D17ef805E5B75dB839275356973E757f5a3E", "initial_to_amount": "0.003134120000000000"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/swaps/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"from_crypto\": \"ETH\", \"to_currency\": \"BTC\", \"from_amount\": \"0.1\", \"payout_address\": \"3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS\", \"refund_address\": \"0x8456D17ef805E5B75dB839275356973E757f5a3E\", \"provider\": \"CHANGENOW\", \"initial_to_amount\": \"0.00313412\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"from_crypto\": \"ETH\", \"to_currency\": \"BTC\", \"from_amount\": \"0.1\", \"payout_address\": \"3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS\", \"refund_address\": \"0x8456D17ef805E5B75dB839275356973E757f5a3E\", \"provider\": \"CHANGENOW\", \"initial_to_amount\": \"0.00313412\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/swaps/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"from_crypto\": \"ETH\", \"to_currency\": \"BTC\", \"from_amount\": \"0.1\", \"payout_address\": \"3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS\", \"refund_address\": \"0x8456D17ef805E5B75dB839275356973E757f5a3E\", \"provider\": \"CHANGENOW\", \"initial_to_amount\": \"0.00313412\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/swaps/active-swaps/": {"get": {"operationId": "swaps_active_swaps", "summary": "Users active swaps on exchange.", "description": "Get a list of all the swaps currently active on the\nexchange and their associated information.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/SwapRead"}}}}, "examples": {"application/json": {"provider": "CHANGENOW", "swap_id": "7fb484616da1e8", "user": {"username": "taylor-local1", "local_currency_symbol": "AUD", "activity_status": "active", "activity_tooltip": "Seen 3\u00a0minutes ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 21522, "completed_trades": 12, "last_seen": 1602131574, "is_legacy": false, "bio": "", "is_superuser": true, "user_uuid": "944d2fce-54c2-4d93-af7a-5c64c96f38a8", "primary_language": "en", "on_holiday": false, "sound_notifications": true, "nc_pw_reset_done": true}, "status": "WAITING", "from_crypto": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "to_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "from_amount": "0.100000000000000000", "initial_to_amount": "0.003134120000000000", "payin_address": "0x85b481F4e3691AD6aFF51Bf8e919dC1C3c0B6D5D", "payout_address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS", "refund_address": "0x8456D17ef805E5B75dB839275356973E757f5a3E", "uuid": "ec8c3831-0bb4-48e7-9938-c072a5de544f", "network_fee": "None", "transaction_speed_forecast": "None", "payout_transaction_hash": "None", "payin_transaction_hash": "None", "final_to_amount": "None"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/swaps/estimate-swap-amount/": {"post": {"operationId": "swaps_estimate-swap-amount_create", "summary": "Estimated swap amount.", "description": "Endpoint to return estimated swap amount for the exchange.\nAlso returns time estimate for trade.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/EstimateSwapAmount"}}], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"estimatedAmount": "0.0313412", "transactionSpeedForecast": "10-60", "warningMessage": "None"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/swaps/estimate-swap-amount/1/ETH/BTC' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/swaps/estimate-swap-amount/1/ETH/BTC\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/estimate-swap-amount/1/ETH/BTC\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/swaps/min-swap-amount/{from_crypto}/{to_currency}/": {"get": {"operationId": "swaps_min-swap-amount_read", "summary": "Minimal swap amount.", "description": "Endpoint to return minimal payment amount required to make a swap.\nIf you try to swap less, the transaction will most likely fail.", "parameters": [], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"minAmount": "0.0726799"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/swaps/min-swap-amount/ETH/BTC' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/swaps/min-swap-amount/ETH/BTC\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/min-swap-amount/ETH/BTC\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "from_crypto", "in": "path", "required": true, "type": "string"}, {"name": "to_currency", "in": "path", "required": true, "type": "string"}]}, "/swaps/past-swaps/": {"get": {"operationId": "swaps_past_swaps", "summary": "Users past swaps on exchange.", "description": "Get a list of all the swaps currently past on the\nexchange and their associated information.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/SwapRead"}}}}, "examples": {"application/json": {"provider": "CHANGENOW", "swap_id": "7fb484616da1e8", "user": {"username": "taylor-local1", "local_currency_symbol": "AUD", "activity_status": "active", "activity_tooltip": "Seen 3\u00a0minutes ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 21522, "completed_trades": 12, "last_seen": 1602131574, "is_legacy": false, "bio": "", "is_superuser": true, "user_uuid": "944d2fce-54c2-4d93-af7a-5c64c96f38a8", "primary_language": "en", "on_holiday": false, "sound_notifications": true, "nc_pw_reset_done": true}, "status": "WAITING", "from_crypto": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "to_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "from_amount": "0.100000000000000000", "initial_to_amount": "0.003134120000000000", "payin_address": "0x85b481F4e3691AD6aFF51Bf8e919dC1C3c0B6D5D", "payout_address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS", "refund_address": "0x8456D17ef805E5B75dB839275356973E757f5a3E", "uuid": "ec8c3831-0bb4-48e7-9938-c072a5de544f", "network_fee": "None", "transaction_speed_forecast": "None", "payout_transaction_hash": "None", "payin_transaction_hash": "None", "final_to_amount": "None"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/swaps/status/": {"post": {"operationId": "swaps_status_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["swaps"]}, "parameters": []}, "/swaps/{uuid}/": {"get": {"operationId": "swaps_read", "summary": "Get swap by UUID.", "description": "This can be done by anonymous users.", "parameters": [], "responses": {"200": {"description": "Success response", "schema": {"$ref": "#/definitions/SwapRead"}, "examples": {"application/json": {"provider": "CHANGENOW", "swap_id": "7fb484616da1e8", "user": {"username": "taylor-local1", "local_currency_symbol": "AUD", "activity_status": "active", "activity_tooltip": "Seen 3\u00a0minutes ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 21522, "completed_trades": 12, "last_seen": 1602131574, "is_legacy": false, "bio": "", "is_superuser": true, "user_uuid": "944d2fce-54c2-4d93-af7a-5c64c96f38a8", "primary_language": "en", "on_holiday": false, "sound_notifications": true, "nc_pw_reset_done": true}, "status": "WAITING", "from_crypto": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "to_currency": {"title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true}, "from_amount": "0.100000000000000000", "initial_to_amount": "0.003134120000000000", "payin_address": "0x85b481F4e3691AD6aFF51Bf8e919dC1C3c0B6D5D", "payout_address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS", "refund_address": "0x8456D17ef805E5B75dB839275356973E757f5a3E", "uuid": "ec8c3831-0bb4-48e7-9938-c072a5de544f", "network_fee": "None", "transaction_speed_forecast": "None", "payout_transaction_hash": "None", "payin_transaction_hash": "None", "final_to_amount": "None"}}}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f' \\\n--header 'Content-Type: application/json' \\\n\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\n\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/swaps/ec8c3831-0bb4-48e7-9938-c072a5de544f\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "patch": {"operationId": "swaps_partial_update", "summary": "Update offer by UUID.", "description": "Update a trade offer for others to respond to.\nThis can be done only by the original offer creator.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/SwapUpdate"}}], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/SwapUpdate"}}}, "tags": ["swaps"], "x-code-samples": null}, "delete": {"operationId": "swaps_delete", "summary": "Delete swap by UUID.", "description": "This can be done only by the original swap creator.", "parameters": [], "responses": {"204": {"description": ""}}, "tags": ["swaps"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string", "format": "uuid"}]}, "/trade-utxos/BTC/": {"get": {"operationId": "trade-utxos_BTC_list", "description": "", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/TradeUtxo"}}}}}}, "tags": ["trade-utxos"]}, "parameters": []}, "/trades/feedback/create/": {"post": {"operationId": "trades_feedback_create_create", "summary": "Submit feeback on trade.", "description": "This can be done only by seller/buyer of the trade.\nThey both can submit feedback for each other.\nFeedback can only be submitted for completed trades.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/TradeFeedbackCreate"}}], "responses": {"201": {"description": "Success response", "schema": {"$ref": "#/definitions/TradeFeedbackRead"}, "examples": {"application/json": {"feedback_for": {"username": "review1", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "date_joined": "2020-02-21T02:59:17.630488Z", "primary_language": "en", "non_custodial": true}, "rating": "5.0", "feedback": "Great trade!", "feedback_by": {"username": "Taylor", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "date_joined": "2018-09-09T23:14:24.244501Z", "primary_language": "en", "non_custodial": true}, "id": 7780, "rating_percentage": 100.0, "time_created": 1597403044, "trade": "0638cfd3-5e4b-49d9-8fb0-a2dc80f014ba"}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/trades/feedback/create/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"rating\": \"5\", \"feedback\": \"Great trade!\", \"trade\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"rating\": \"5\", \"feedback\": \"Great trade!\", \"trade\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/trades/feedback/create/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"rating\": \"5\", \"feedback\": \"Great trade!\", \"trade\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/feedback/create/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/trades/feedback/list/": {"get": {"operationId": "trades_feedback_list_list", "summary": "List trade feedbacks.", "description": "Filter from list of trade feedbacks.", "parameters": [{"name": "rating", "in": "query", "description": "", "required": false, "type": "number"}, {"name": "feedback_by", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "feedback_for", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"active_page": 1, "count": 0, "next": "None", "previous": "None", "offset": 0, "limit": 5, "total_pages": 0, "results": [[{"feedback_for": {"username": "Taylor", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "date_joined": "2018-09-09T23:14:24.244501Z", "primary_language": "en", "non_custodial": true}, "rating": "5.0", "feedback": "Great trade", "feedback_by": {"username": "review1", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "date_joined": "2020-02-21T02:59:17.630488Z", "primary_language": "en", "non_custodial": true}, "id": 7781, "rating_percentage": 100, "time_created": 1597403339, "trade": "0638cfd3-5e4b-49d9-8fb0-a2dc80f014ba"}, {"feedback_for": {"username": "Taylor", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "date_joined": "2018-09-09T23:14:24.244501Z", "primary_language": "en", "non_custodial": true}, "rating": "5.0", "feedback": "review", "feedback_by": {"username": "review1", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "date_joined": "2020-02-21T02:59:17.630488Z", "primary_language": "en", "non_custodial": true}, "id": 7619, "rating_percentage": 100, "time_created": 1597115982, "trade": "82ca2908-4dfa-4e68-9bc7-2f1e548946bd"}]]}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/feedback/list/?feedback_for=3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/feedback/list/?feedback_for=3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/feedback/list/?feedback_for=3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/trades/history-metrics/{username}/": {"get": {"operationId": "trades_history-metrics_read", "description": "Get metrics for trade history with this user.", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["trades"]}, "parameters": [{"name": "username", "in": "path", "required": true, "type": "string"}]}, "/trades/history/": {"get": {"operationId": "trades_history_list", "summary": "Download trade history.", "description": "Endpoint which returns the user's historical trade history.", "parameters": [], "responses": {"200": {"description": "Success response", "examples": {"application/json": "csv file"}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/history/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/history/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/history/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/trades/list/": {"get": {"operationId": "trades_list_list", "summary": "List trades.", "description": "Retrives a list where the authenticated user is\neither a buyer/seller.", "parameters": [{"name": "status", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "coin_currency", "in": "query", "description": "List of cryptocurrencies to filter by. Takes `slug` of the currency.", "required": false, "type": "string"}, {"name": "stage", "in": "query", "description": "\nEnum: `\"live\"`, `\"past\"`.\n\n\nUseful when you only want to view all live/ongoing trades for example.\n", "required": false, "type": "string"}, {"name": "trade_format", "in": "query", "description": "\nEnum: `\"standard\"`, `\"non-custodial\"`.\n", "required": false, "type": "string"}, {"name": "trade_type", "in": "query", "description": "\nEnum: `\"buy\"`, `\"sell\"`.\n", "required": false, "type": "string"}, {"name": "trade_status", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "payment_method", "in": "query", "description": "List of payment-methods to filter by. Takes `slug` of payment method.", "required": false, "type": "string"}, {"name": "fiat_currency", "in": "query", "description": "List of fiat currencies to filter by. Takes `symbol` of the currency.", "required": false, "type": "string"}, {"name": "text", "in": "query", "description": "Search by username of traders.", "required": false, "type": "string"}, {"name": "user", "in": "query", "description": "Filter by exact username.", "required": false, "type": "string"}, {"name": "ordering", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"active_page": 1, "count": 75, "next": "https://api.localcoinswap.com/api/v2/trades/list/?limit=5&offset=5", "previous": "None", "offset": 0, "limit": 5, "total_pages": 15, "results": [{"status": "EXPIRED", "uuid": "14cc3377-6bd6-4ff1-97a7-5b8bcbe23079", "buyer": {"username": "nathan", "activity_status": "inactive", "activity_tooltip": "Seen 2\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 362, "last_seen": 1597396895, "is_legacy": false, "user_uuid": "5982337e-14eb-47b7-a712-99cb7bc7e164"}, "seller": {"username": "Taylor", "activity_status": "active", "activity_tooltip": "Seen 3\\xa0minutes ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 27, "last_seen": 1597404200, "is_legacy": false, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba"}, "fiat_amount": "10.000000000000000000", "coin_amount": "0.010000000000000000", "time_created": 1590047139, "coin_currency": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "fiat_currency": {"title": "British Pound", "symbol": "GBP", "symbol_filename": "None", "is_crypto": false}}, {"status": "REJECTED", "uuid": "c502cd3b-3246-40e5-a4ae-1e3931291ee2", "buyer": {"username": "nathan", "activity_status": "inactive", "activity_tooltip": "Seen 2\\xa0hours ago", "is_email_verified": true, "is_phone_verified": true, "avg_response_time": 362, "last_seen": 1597396895, "is_legacy": false, "user_uuid": "5982337e-14eb-47b7-a712-99cb7bc7e164"}, "seller": {"username": "Taylor", "activity_status": "active", "activity_tooltip": "Seen 3\\xa0minutes ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 27, "last_seen": 1597404200, "is_legacy": false, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba"}, "fiat_amount": "10.000000000000000000", "coin_amount": "0.010000000000000000", "time_created": 1590055104, "coin_currency": {"title": "Ethereum", "symbol": "ETH", "symbol_filename": "eth.svg", "is_crypto": true}, "fiat_currency": {"title": "British Pound", "symbol": "GBP", "symbol_filename": "None", "is_crypto": false}}]}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/list?coin_currency=2&amp;stage=live/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/list?coin_currency=2&amp;stage=live/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/list?coin_currency=2&amp;stage=live/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/trades/message/get/{message_id}/": {"get": {"operationId": "trades_message_get_read", "summary": "Get trade message object.", "description": "To get the trade message object by its id.", "parameters": [], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/ContractMessageList"}}}, "tags": ["trades"], "x-code-samples": null}, "parameters": [{"name": "message_id", "in": "path", "required": true, "type": "string"}]}, "/trades/message/list/{contract_uuid}/": {"get": {"operationId": "trades_message_list_read", "summary": "List trade messages.", "description": "Retrives a list of messages for a trade where the authenticated\nuser is either a buyer/seller.", "parameters": [{"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"active_page": 1, "count": 3, "next": "None", "previous": "None", "offset": 0, "limit": 5, "total_pages": 1, "results": [{"content": "test 2, good idea dude", "attachment": "None", "time_created": 1597212069, "created_by": {"username": "review1", "timezone": "Europe/London", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "is_superuser": false, "is_email_verified": true, "last_seen": 1597403340, "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "active", "activity_tooltip": "Seen 24\\xa0minutes ago", "feedback_score": 5.0, "completed_trades": 22, "avg_response_time": 13, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "languages": [], "date_joined": "2020-02-21T02:59:17.630488Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": "None", "imported_estimated_volume": "None", "on_holiday": false, "non_custodial": true}, "recipient": "None"}, {"content": "test", "attachment": "None", "time_created": 1597212026, "created_by": {"username": "Taylor", "timezone": "Australia/Sydney", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "is_superuser": true, "is_email_verified": true, "last_seen": 1597404437, "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "active", "activity_tooltip": "Seen 5\\xa0minutes ago", "feedback_score": 5.0, "completed_trades": 32, "avg_response_time": 27, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "languages": [], "date_joined": "2018-09-09T23:14:24.244501Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": "None", "imported_estimated_volume": "None", "on_holiday": false, "non_custodial": true}, "recipient": "None"}, {"content": "CONTRACT_WAS_ACCEPTED_AND_WAITING", "attachment": "None", "time_created": 1594114457, "created_by": {"username": "trade_support", "timezone": "Europe/London", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "is_superuser": false, "is_email_verified": false, "last_seen": "None", "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "none", "activity_tooltip": "None", "feedback_score": 5.0, "completed_trades": 0, "avg_response_time": 0, "user_uuid": "dc5d88cf-55c4-4068-9506-3826d9d0b366", "languages": [], "date_joined": "2019-05-16T14:08:31.227597Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": "None", "imported_estimated_volume": "None", "on_holiday": false, "non_custodial": false}, "recipient": "None"}]}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/message/list/8e35e145-44b6-48a6-903e-a340b5c61384/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/message/list/8e35e145-44b6-48a6-903e-a340b5c61384/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/message/list/8e35e145-44b6-48a6-903e-a340b5c61384/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "contract_uuid", "in": "path", "required": true, "type": "string"}]}, "/trades/message/{uuid}/": {"post": {"operationId": "trades_message_create", "summary": "Send message on trade.", "description": "Sends a chat message for the provided trade uuid.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/ContractMessage"}}], "responses": {"201": {"description": "Success response", "examples": {"application/json": {"attachment": "https://localcoinswap.com/media/contract_messages/boat.png", "content": "Hello, lets trade"}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/trades/message/f1825235-dec0-4151-bf2b-4b7335125b2f/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"content\": \"Hello, let's trade crypto!\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"content\": \"Hello, let's trade crypto!\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/trades/message/f1825235-dec0-4151-bf2b-4b7335125b2f/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"content\": \"Hello, let's trade crypto!\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/message/f1825235-dec0-4151-bf2b-4b7335125b2f/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string", "format": "uuid"}]}, "/trades/non-custodial/create/": {"post": {"operationId": "trades_non-custodial_create_create", "summary": "Create non-custodial trade.", "description": "Create a custodial trade from the provided offer uuid.\nOffer creator can then choose to accept or reject trade.\nThis can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/NonCustodialTradeCreate"}}], "responses": {"201": {"description": "Success response", "schema": {"$ref": "#/definitions/TradeUuid"}, "examples": {"application/json": {"status": "CREATED", "uuid": "02789d73-caca-4b42-8362-0abeb0669d92"}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/trades/non-custodial/create/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"offer\": \"6ab3a6f8-5a70-41d2-80c9-8f91b27f85bd\", \"coin_amount\": \"Great trade!\", \"fiat_amount\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\", \"wallet_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"wallet_type\": \"metamask\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"offer\": \"6ab3a6f8-5a70-41d2-80c9-8f91b27f85bd\", \"coin_amount\": \"Great trade!\", \"fiat_amount\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\", \"wallet_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"wallet_type\": \"metamask\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/trades/non-custodial/create/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"offer\": \"6ab3a6f8-5a70-41d2-80c9-8f91b27f85bd\", \"coin_amount\": \"Great trade!\", \"fiat_amount\": \"d6f42b70-ac9f-46c7-8fa4-33fc533a2fc7\", \"wallet_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"wallet_type\": \"metamask\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/non-custodial/create/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/trades/non-custodial/update/{uuid}/": {"patch": {"operationId": "trades_non-custodial_update_partial_update", "summary": "Update non-custodial trade.", "description": "Used for changing the `status` of a trade.\nThis can be done only by authenticated users.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/NonCustodialTradeUpdate"}}], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/TradeRead"}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request PATCH 'https://api.localcoinswap.com/api/v2/trades/custodial/update/49721d63-1a9b-4b39-a749-78d6f2dc1b2b/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"status\": \"REJECTED\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"status\": \"REJECTED\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"PATCH\", \"https://api.localcoinswap.com/api/v2/trades/custodial/update/49721d63-1a9b-4b39-a749-78d6f2dc1b2b/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"status\": \"REJECTED\"});\n\nvar requestOptions = {\n  method: \"PATCH\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/custodial/update/49721d63-1a9b-4b39-a749-78d6f2dc1b2b/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string", "format": "uuid"}]}, "/trades/non-custodial/watch-txn/{uuid}/": {"post": {"operationId": "trades_non-custodial_watch-txn_create", "summary": "Watch escrow txn trigger.", "description": "This is created so that we don't have to keep polling btc node.\nWe call this API when tx confirms on the node.", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["trades"]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string"}]}, "/trades/to-uuid/{trade_id}/": {"get": {"operationId": "trades_to-uuid_read", "description": "Get trade uuid from first 8 chars.", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["trades"]}, "parameters": [{"name": "trade_id", "in": "path", "required": true, "type": "string"}]}, "/trades/withdraw-dispute/{uuid}/": {"post": {"operationId": "trades_withdraw-dispute_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["trades"]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string"}]}, "/trades/{uuid}/": {"get": {"operationId": "trades_read", "summary": "Get trade by UUID.", "description": "Get trade details with provided UUID.\nOnly seller or buyer of the trade can request trade details.", "parameters": [], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"id": 22949, "ad": {"uuid": "a73b2a38-2f4a-4de6-a7f1-f0d2739e0759", "created_by": {"username": "Taylor", "local_currency_symbol": "AUD", "activity_status": "active", "activity_tooltip": "Seen 12 seconds ago", "is_email_verified": true, "is_phone_verified": false, "avg_response_time": 33, "completed_trades": 24, "last_seen": 1596445063, "is_legacy": false, "bio": "", "is_superuser": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "primary_language": "en", "on_holiday": false, "sound_notifications": true, "nc_pw_reset_done": true}, "is_active": true, "is_available": true, "fiat_currency": {"id": 10002, "title": "Australian Dollar", "symbol": "AUD", "symbol_filename": null, "is_crypto": false, "withdraw_fee": null, "minimum_withdrawal": null, "slug": "australian-dollar", "active_status": "currency_active"}, "coin_currency": {"id": 1, "title": "Bitcoin", "symbol": "BTC", "symbol_filename": "btc.svg", "is_crypto": true, "withdraw_fee": "0.000300000000000000", "minimum_withdrawal": "0.001000000000000000", "slug": "bitcoin-BTC", "active_status": "currency_active"}, "payment_method": {"id": 109, "name": "Gamestop Gift Card", "priority": 192, "slug": "gamestop-gift-card", "icon_filename": null, "high_risk": true, "type": 5}, "trading_type": {"id": 2, "name": "sell", "action_name": "Selling", "opposite_name": "buy", "opposite_action_name": "Buying"}, "trading_hours": "Mon - Sun: Trading all day<br />\n", "min_trade_size": "1.0000000000", "max_trade_size": "1.0000000000", "enforced_sizes": "", "trading_conditions": "", "location_name": "Little Mountain", "country_code": "AU", "price_formula_value": "23451.271183213503", "price_formula": {"display_formula": "50", "prefix_formula": "exchange.btcusd|v||exchange.usdaud|v||*|o||1.5|n||*|o", "pricing_type": "MARGIN", "market": "cmc"}, "automatic_cancel_time": "240", "sms_required": false, "only_friends": false, "minimum_feedback": "0", "min_fiat_limit": 1, "max_fiat_limit": 1, "current_price": "23142.1629808268", "current_price_usd": "16511.6469583500", "slug": "buy-bitcoin-btc-for-aud-in-australia", "trading_hours_bits": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", "trading_hours_localised": "Mon - Sun: Trading all day<br />\n", "trading_hours_bits_localised": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111", "hidden": true, "is_deleted": false, "coordinates": {"latitude": -26.781, "longitude": 153.094}, "current_margin_percentage": "50.0000000000", "headline": "", "custodial_type": 2}, "status": "WAITING_FOR_MIN_ESCROW_CONFIRMS", "status_meta": {"CRYPTO_ESC": {"expected_confirmations": 2, "confirmations_received": 0}}, "uuid": "02789d73-caca-4b42-8362-0abeb0669d92", "contract_responder": {"username": "review1", "timezone": "Europe/London", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "is_superuser": false, "is_email_verified": true, "last_seen": 1597405793, "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "active", "activity_tooltip": "Seen 12 minutes ago", "feedback_score": 5.0, "completed_trades": 22, "avg_response_time": 13, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "languages": [], "date_joined": "2020-02-21T02:59:17.630488Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": null, "imported_estimated_volume": null, "on_holiday": false, "non_custodial": true}, "buyer": {"username": "review1", "timezone": "Europe/London", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "is_superuser": false, "is_email_verified": true, "last_seen": 1597405793, "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "active", "activity_tooltip": "Seen 12 minutes ago", "feedback_score": 5.0, "completed_trades": 22, "avg_response_time": 13, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "languages": [], "date_joined": "2020-02-21T02:59:17.630488Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": null, "imported_estimated_volume": null, "on_holiday": false, "non_custodial": true}, "seller": {"username": "Taylor", "timezone": "Australia/Sydney", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "is_superuser": true, "is_email_verified": true, "last_seen": 1597406249, "profile_image": "https://api.localcoinswap.com/media/default_user.jpg", "activity_status": "active", "activity_tooltip": "Seen 4 minutes ago", "feedback_score": 5.0, "completed_trades": 32, "avg_response_time": 27, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "languages": [], "date_joined": "2018-09-09T23:14:24.244501Z", "is_phone_verified": false, "is_legacy": false, "primary_language": "en", "times_blocked": 0, "times_followed": 0, "imported_total_trades": null, "imported_estimated_volume": null, "on_holiday": false, "non_custodial": true}, "fiat_amount": "1.000000000000000000", "coin_amount": "0.000042640000000000", "time_of_expiry": 1596459474, "time_created": 1596445075, "coin_currency": {"id": 1, "title": "Bitcoin", "slug": "bitcoin-BTC", "symbol": "BTC", "symbol_filename": "btc.svg", "icon": "https://api.localcoinswap.com/media/currency/btc.svg", "is_crypto": true, "withdraw_fee": "0.000300000000000000", "minimum_withdrawal": "0.001000000000000000", "multiplier": "100000000.0000000000", "gas_limit": null, "priority": 1, "country_code": null, "active_status": "currency_active", "is_active": true, "metadata": 1}, "fiat_currency": {"id": 10002, "title": "Australian Dollar", "slug": "australian-dollar", "symbol": "AUD", "symbol_filename": null, "icon": "https://api.localcoinswap.com/media/currency/usd.svg", "is_crypto": false, "withdraw_fee": null, "minimum_withdrawal": null, "multiplier": null, "gas_limit": null, "priority": 99, "country_code": null, "active_status": "currency_active", "is_active": true, "metadata": null}, "responder_geo": {"location": {"country": "AU", "region": "Queensland", "city": "Little Mountain", "lat": -26.7896, "lng": 153.104, "postalCode": "4551", "timezone": "+10:00", "geonameId": 8348536}}, "buyer_meta": {"address": "3GrNNCqyoW4wJEQr81sfZPK3b5UTifd4WA", "wallet_type": "webwallet", "public_key": "3cc255aea0bc7ced2df46116d339860da83415c00b0af48fc1ee643db2e40a0e56df45c3c1ac67ef140581ce78f601b55b6d3caf4828ac4ff3b965943cb5bbd2", "buyer_hashed_secret": "a0539399de4588f097ca4b0b7517fae496352fd7", "buyer_hashed_public_key": "8f9d3f4a0858dda7e3399370a207e70fafe68af0", "buyer_hashed_secret_signed": "H6wPzzYJF2JhWrsTAETTTWVe6d7mNCbt9WNYK0W0w/jWPO+d4Y9j7rXHryQwFYzeavU0cNij/kHZj7U778hVuDM=", "buyer_address_signed": "H5nG2ih3RKJM3uA9ccPKKiStXNr4wyQrbhxayYE+YAI7TqS0Ri8wTw+nm87wKFht55HGXLBbiv3yU6lcZ9yyGb0=", "buyer_encrypted_secret": "7ab9d3cc33efbbb178955b91e9b89fcf833be98bd76e1068b568a574affa32863a14676bbcbed4704024f2447ca37b610690467f763abe0bb20bae10a0dadac0797f8fcae25b5a4c7649c9d0a8f41532"}, "seller_meta": {"public_key": "f1048e6936ac33726c9f5d60ff2079482d9d8e79bae35587bfc6ad7252e24dacdb9bcbfa33bb7f4ff7cce7e1baaee8b1869eeb35906664198f335f2d07139e25", "address": "3KmzZfakKYbDrTm8fFZz5QTbWuMHL9uTnS", "wallet_type": "webwallet", "seller_hashed_secret": "74eb626d6893455ccfae38737a847044747eddaf", "seller_hashed_public_key": "405722a7b2f48c07095f94aed3d7b9010080ac9a", "seller_encrypted_secret": "cf16c82112b99c4c2e0371b42e7dc48354c8bfcc0118661f3a080328e2c7d981fe42c5d5e0b56a57159fc3e215a84bfbed0a3f6e4ac7918fe7aa8ef824af4c3fe4f503511ebdbcd75ef119280abd564b"}, "tx_meta": {"hashed_release_secret": "c500d8804e43dc9814420aae1e9cf76e134a39bf", "hashed_return_secret": "15f283ff885bfa684303d065ff28ebf72295e557", "escrow_address": "3CqHBgwTWMVRzWXNBuy1eVLDjCPixja7M9", "fee_address": "35YsVDSRHTpPdzZUWMe1Rw9DEkofis5Adb", "escrow_witness": "7651876375148f9d3f4a0858dda7e3399370a207e70fafe68af01474eb626d6893455ccfae38737a847044747eddaf677652876375148f9d3f4a0858dda7e3399370a207e70fafe68af014c500d8804e43dc9814420aae1e9cf76e134a39bf67765387637514405722a7b2f48c07095f94aed3d7b9010080ac9a14a0539399de4588f097ca4b0b7517fae496352fd767548814405722a7b2f48c07095f94aed3d7b9010080ac9a1415f283ff885bfa684303d065ff28ebf72295e5576868687ba98878a988ac", "fee_witness": "7653876375a914a0539399de4588f097ca4b0b7517fae496352fd78876a914405722a7b2f48c07095f94aed3d7b9010080ac9a88ac677654876375a91415f283ff885bfa684303d065ff28ebf72295e5578876a914405722a7b2f48c07095f94aed3d7b9010080ac9a88ac6776a9144d85a6c909524300a3141da25a031a82165b6cb088ac6868", "escrow_signed_tx": "02000000000101931089e2a0640f48f1c84ddaba1ae94829310ee31249bdad1c88f8eb5ad0a0fe0200000017160014405722a7b2f48c07095f94aed3d7b9010080ac9afeffffff03a81000000000000017a9147a39735ef0f98df2bfb2eeb06aa8099efb5ff55887220200000000000017a9142a562201ccbb3b9148ea96abfd5107c39d4fce76871ed602000000000017a914c663356bf85b5241aec63092ac0a85eed3d0d7b5870247304402204c8c679e85ba7a33698c8264e8d9710da1c7f15f8ff0f84a3422270ee4076cbb022073fe02fedaa70affa04b3863fdcb9ffedcbbc5afd393b560c04d6f3ce466936c01210284911b8aaccd8c18572f15b5d0727f3443b25493eb73d7620e77959a28f63e7600000000", "escrow_broadcast_tx": "d6381aaa668d0b3ec11bda6de0425d408fef3598b6989c919c785c3ddd7f4829"}, "non_custodial": true}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/3bf25b56-f009-40bc-ae94-0b5cac1ff0ba/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string", "format": "uuid"}]}, "/trades/{uuid}/feedback/": {"get": {"operationId": "trades_feedback_read", "summary": "Get trade feedback.", "description": "Feedback submitted by the authenticated user on the trade\nis retrieved.", "parameters": [], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"feedback_for": {"username": "review1", "local_currency_symbol": "USD", "bio": "", "is_staff": false, "user_uuid": "4f542b3a-a979-4e3f-8ccb-f0bfaa1cbb0b", "date_joined": "2020-02-21T02:59:17.630488Z", "primary_language": "en", "non_custodial": true}, "rating": "5.0", "feedback": "Great trade!", "feedback_by": {"username": "Taylor", "local_currency_symbol": "AUD", "bio": "", "is_staff": true, "user_uuid": "3bf25b56-f009-40bc-ae94-0b5cac1ff0ba", "date_joined": "2018-09-09T23:14:24.244501Z", "primary_language": "en", "non_custodial": true}, "id": 7721, "rating_percentage": 100, "time_created": 1597280511, "trade": "f3c6120b-d63a-4a1f-9d18-f181c4be29c2"}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/feedback/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/feedback/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/feedback/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string"}]}, "/trades/{uuid}/invoice/": {"post": {"operationId": "trades_invoice_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["trades"]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string"}]}, "/trades/{uuid}/status/": {"get": {"operationId": "trades_status_list", "summary": "Get trade status.", "description": "Use this to quickly check trade status.\nThis is faster than retrieving full trade details. Prefer this when\nyou only need to check the current status of the trade.", "parameters": [], "responses": {"200": {"description": "Success response", "examples": {"application/json": {"uuid": "f3c6120b-d63a-4a1f-9d18-f181c4be29c2", "status": "COMPLETED"}}}}, "tags": ["trades"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request GET 'https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/status/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n\n"}, {"lang": "python", "source": "import requests\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"GET\", \"https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/status/\", headers=headers)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar requestOptions = {\n  method: \"GET\",\n  headers: myHeaders,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/trades/f3c6120b-d63a-4a1f-9d18-f181c4be29c2/status/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": [{"name": "uuid", "in": "path", "required": true, "type": "string"}]}, "/tx-history/non-custodial/BTC/": {"get": {"operationId": "tx-history_non-custodial_BTC_list", "description": "", "parameters": [{"name": "txtype", "in": "query", "description": "", "required": false, "type": "string"}, {"name": "limit", "in": "query", "description": "Number of results to return per page.", "required": false, "type": "integer"}, {"name": "offset", "in": "query", "description": "The initial index from which to return the results.", "required": false, "type": "integer"}], "responses": {"200": {"description": "", "schema": {"required": ["count", "results"], "type": "object", "properties": {"count": {"type": "integer"}, "next": {"type": "string", "format": "uri", "x-nullable": true}, "previous": {"type": "string", "format": "uri", "x-nullable": true}, "results": {"type": "array", "items": {"$ref": "#/definitions/BtcTxHistory"}}}}}}, "tags": ["tx-history"]}, "parameters": []}, "/volume/weekly/": {"get": {"operationId": "volume_weekly_list", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["volume"]}, "parameters": []}, "/wallets/allowance-reset/": {"post": {"operationId": "wallets_allowance-reset_create", "summary": "Reset USDT allowance.", "description": "Reset the allowance to 0of an address with our USDT escrow contract.\n`currency` is the currency id, found at `/currencies/{symbol}/`.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/AllowanceReset"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/AllowanceReset"}}}, "tags": ["wallets"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/wallets/allowance-reset/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"currency\": 19, \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"currency\": 19, \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/wallets/allowance-reset/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"currency\": 19, \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/wallets/allowance-reset/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/wallets/allowance/{crypto_slug}/": {"get": {"operationId": "wallets_allowance_read", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["wallets"]}, "parameters": [{"name": "crypto_slug", "in": "path", "required": true, "type": "string"}]}, "/wallets/approve-allowance/{crypto_slug}/": {"post": {"operationId": "wallets_approve-allowance_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["wallets"]}, "parameters": [{"name": "crypto_slug", "in": "path", "required": true, "type": "string"}]}, "/wallets/balance/{currency_slug}/": {"get": {"operationId": "wallets_balance_read", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["wallets"]}, "parameters": [{"name": "currency_slug", "in": "path", "required": true, "type": "string"}]}, "/wallets/broadcast-trx-tx/": {"post": {"operationId": "wallets_broadcast-trx-tx_create", "description": "", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/TrxSignedTx"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/TrxSignedTx"}}}, "tags": ["wallets"]}, "parameters": []}, "/wallets/custodial-withdrawal/": {"post": {"operationId": "wallets_custodial-withdrawal_create", "summary": "Create a custodial wallet withdrawal.", "description": "Initiate a withdrawal for custodial Bitcoin or Dash.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/Withdraw"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/Withdraw"}}}, "tags": ["wallets"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/wallets/custodial-withdrawal/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"amount\": \"0.001\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"amount\": \"0.001\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/wallets/custodial-withdrawal/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"amount\": \"0.001\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/wallets/custodial-withdrawal/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/wallets/non-custodial/{currency_slug}/": {"get": {"operationId": "wallets_non-custodial_read", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["wallets"]}, "parameters": [{"name": "currency_slug", "in": "path", "required": true, "type": "string"}]}, "/wallets/publish/": {"post": {"operationId": "wallets_publish_create", "summary": "Publish transaction to blockchain.", "description": "Endpoint to publish a signed transactions to the blockchain.\nMay be used in conjunction with the unsigned transaction endpoint.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/SendSigned"}}], "responses": {"201": {"description": "Success response", "examples": {"application/json": {"status": "successful", "data": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed", "error": false, "tx": "dc0799b48558cdbe964d3c79c103c64fd5601c7256c2ae84925a0893695a52ed"}}}}, "tags": ["wallets"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/wallets/publish/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"currency\": 1, \"signed_tx\": \"0200000001a4af9f3fc589ba79017ac1beeedc9798fb712891a89a92db03c62de9ae871af5010000006b483045022100bda30f6e23d11da838fb6f42f5ec798e6f48010488cc884f2d4dba36a0739f0702201ced67c70c12ef6ac007d611292585330e619cbd9508c8a37194a7b7d5bb14b201210294508ab61f9d3759b7de2b43e287eda9e0afc3c2b5dcbc15b25ddcf7b812ba58fdffffff02204e0000000000001976a914bcc3f41e0d9b523fece5004531b783e85ed9855288ac99299c0e000000001976a91413b18b29c4c4681a950b5c30fa9f507937a686a988ac40d20900\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"currency\": 1, \"signed_tx\": \"0200000001a4af9f3fc589ba79017ac1beeedc9798fb712891a89a92db03c62de9ae871af5010000006b483045022100bda30f6e23d11da838fb6f42f5ec798e6f48010488cc884f2d4dba36a0739f0702201ced67c70c12ef6ac007d611292585330e619cbd9508c8a37194a7b7d5bb14b201210294508ab61f9d3759b7de2b43e287eda9e0afc3c2b5dcbc15b25ddcf7b812ba58fdffffff02204e0000000000001976a914bcc3f41e0d9b523fece5004531b783e85ed9855288ac99299c0e000000001976a91413b18b29c4c4681a950b5c30fa9f507937a686a988ac40d20900\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/wallets/publish/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"currency\": 1, \"signed_tx\": \"0200000001a4af9f3fc589ba79017ac1beeedc9798fb712891a89a92db03c62de9ae871af5010000006b483045022100bda30f6e23d11da838fb6f42f5ec798e6f48010488cc884f2d4dba36a0739f0702201ced67c70c12ef6ac007d611292585330e619cbd9508c8a37194a7b7d5bb14b201210294508ab61f9d3759b7de2b43e287eda9e0afc3c2b5dcbc15b25ddcf7b812ba58fdffffff02204e0000000000001976a914bcc3f41e0d9b523fece5004531b783e85ed9855288ac99299c0e000000001976a91413b18b29c4c4681a950b5c30fa9f507937a686a988ac40d20900\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/wallets/publish/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/wallets/request-withdrawal-otp/": {"post": {"operationId": "wallets_request-withdrawal-otp_create", "description": "Request OTP to creat wallet withdrawal.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/RequestWithdrawalOtp"}}], "responses": {"201": {"description": "", "schema": {"$ref": "#/definitions/RequestWithdrawalOtp"}}}, "tags": ["wallets"]}, "parameters": []}, "/wallets/resolve-ns/": {"post": {"operationId": "wallets_resolve-ns_create", "description": "", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["wallets"]}, "parameters": []}, "/wallets/unsigned/": {"post": {"operationId": "wallets_unsigned_create", "summary": "Prepare unsigned transaction.", "description": "Endpoint to prepare an unsigned transaction for signing by the user.\nRequired parameters vary by cryptocurrency.", "parameters": [{"name": "data", "in": "body", "required": true, "schema": {"$ref": "#/definitions/CreateUnsigned"}}], "responses": {"201": {"description": "Success response", "examples": {"application/json": {"tx": {"to": "0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e", "value": 1000000000000000, "gas": 21000, "gasPrice": 122000000000, "nonce": 27}, "fromAddress": "0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0"}}}}, "tags": ["wallets"], "x-code-samples": [{"lang": "bash", "source": "curl \\\n--request POST 'https://api.localcoinswap.com/api/v2/wallets/unsigned/' \\\n--header 'Content-Type: application/json' \\\n--header 'Authorization: Token YOUR_TOKEN_HERE' \\\n--data-raw '{\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"gas_price\": 122000000000, \"gas_limit\": 21000, \"amount\": \"0.001\"}'\n"}, {"lang": "python", "source": "import requests\n\npayload = {\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"gas_price\": 122000000000, \"gas_limit\": 21000, \"amount\": \"0.001\"}\n\n\nheaders = {\n  \"Authorization\": \"Token YOUR_TOKEN_HERE\",\n  \"Content-Type\": \"application/json\",\n}\n\nresponse = requests.request(\"POST\", \"https://api.localcoinswap.com/api/v2/wallets/unsigned/\", headers=headers, data=payload)\n"}, {"lang": "javascript", "source": "var myHeaders = new Headers();\nmyHeaders.append(\"Authorization\", \"Token YOUR_TOKEN_HERE\");\nmyHeaders.append(\"Content-Type\", \"application/json\");\n\n\nvar raw = JSON.stringify({\"currency\": 2, \"to_address\": \"0xD337f60a6589f56c44f72937Dc7b5C84dac2c14e\", \"from_address\": \"0x7D1f14c29825b052004A5eF02d8F0BC7E2c9A2A0\", \"gas_price\": 122000000000, \"gas_limit\": 21000, \"amount\": \"0.001\"});\n\nvar requestOptions = {\n  method: \"POST\",\n  headers: myHeaders,\n  body: raw,\n  redirect: \"follow\"\n};\n\n\nfetch(\"https://api.localcoinswap.com/api/v2/wallets/unsigned/\", requestOptions)\n  .then(response => response.text())\n  .then(result => console.log(result))\n  .catch(error => console.log(\"error\", error));\n"}]}, "parameters": []}, "/wallets/watch-tx/": {"post": {"operationId": "wallets_watch-tx_create", "summary": "Watch btc withdrawal txn trigger.", "description": "Used by the watcher to trigger tx confirmation.", "parameters": [], "responses": {"201": {"description": ""}}, "tags": ["wallets"]}, "parameters": []}, "/year-in-review-2022/{username}/": {"get": {"operationId": "year-in-review-2022_read", "description": "", "parameters": [], "responses": {"200": {"description": "", "schema": {"$ref": "#/definitions/YearInReview2022"}}}, "tags": ["year-in-review-2022"]}, "parameters": [{"name": "username", "in": "path", "required": true, "type": "string"}]}, "/zendesk/auth/": {"get": {"operationId": "zendesk_auth_list", "description": "", "parameters": [], "responses": {"200": {"description": ""}}, "tags": ["zendesk"]}, "parameters": []}}, "definitions": {"AcademySubscriptionCreate": {"required": ["email"], "type": "object", "properties": {"name": {"title": "Name", "type": "string", "maxLength": 100, "x-nullable": true}, "email": {"title": "Email", "type": "string", "format": "email", "maxLength": 254, "minLength": 1}, "locale": {"title": "Locale", "type": "string", "maxLength": 4, "minLength": 1}, "referrer": {"title": "Referrer", "type": "string", "maxLength": 512, "x-nullable": true}}}, "ProfileSlug": {"title": "User", "required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}}}, "BidRead": {"required": ["bid_round", "amount", "user"], "type": "object", "properties": {"bid_round": {"title": "Bid round", "type": "integer"}, "amount": {"title": "Amount", "type": "string", "format": "decimal"}, "created": {"title": "Created", "type": "string", "format": "date-time", "readOnly": true}, "user": {"$ref": "#/definitions/ProfileSlug"}}}, "BidCreate": {"required": ["bid_round", "amount"], "type": "object", "properties": {"bid_round": {"title": "Bid round", "type": "integer"}, "amount": {"title": "Amount", "type": "string", "format": "decimal"}}}, "Currency": {"required": ["title", "symbol"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "title": {"title": "Title", "type": "string", "maxLength": 64, "minLength": 1}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 16, "minLength": 1}, "chain": {"title": "Chain", "type": "string", "maxLength": 16, "x-nullable": true}, "token_standard": {"title": "Token standard", "type": "string", "maxLength": 16, "x-nullable": true}, "symbol_filename": {"title": "Symbol filename", "type": "string", "maxLength": 16, "x-nullable": true}, "is_crypto": {"title": "Is crypto", "type": "boolean"}, "withdraw_fee": {"title": "Withdraw fee", "type": "string", "format": "decimal", "x-nullable": true}, "minimum_withdrawal": {"title": "Minimum withdrawal", "type": "string", "format": "decimal", "x-nullable": true}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 50}, "active_status": {"title": "Currency status", "type": "string", "enum": ["currency_active", "currency_offers_only", "currency_staff_only", "currency_paused", "currency_delisted"], "x-nullable": true}}}, "MinimalCurrency": {"required": ["title", "symbol"], "type": "object", "properties": {"title": {"title": "Title", "type": "string", "maxLength": 64, "minLength": 1}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 16, "minLength": 1}, "token_standard": {"title": "Token standard", "type": "string", "maxLength": 16, "x-nullable": true}, "symbol_filename": {"title": "Symbol filename", "type": "string", "maxLength": 16, "x-nullable": true}, "is_crypto": {"title": "Is crypto", "type": "boolean"}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 50}}}, "CMCCurrencyQuotes": {"title": "Cmc analytics", "required": ["symbol", "usd_price"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 100, "minLength": 1}, "usd_price": {"title": "Usd price", "type": "string", "format": "decimal"}, "usd_market_cap": {"title": "Usd market cap", "type": "string", "format": "decimal", "x-nullable": true}, "usd_volume_24h": {"title": "Usd volume 24h", "type": "string", "format": "decimal", "x-nullable": true}, "percent_change_1h": {"title": "Percent change 1h", "type": "string", "format": "decimal", "x-nullable": true}, "percent_change_24h": {"title": "Percent change 24h", "type": "string", "format": "decimal", "x-nullable": true}, "percent_change_7d": {"title": "Percent change 7d", "type": "string", "format": "decimal", "x-nullable": true}, "usd_last_updated": {"title": "Last update times for USD value", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "last_updated": {"title": "Last update time of this object", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}}}, "CurrencyMetadata": {"title": "Metadata", "required": ["cmc_analytics"], "type": "object", "properties": {"banner_image": {"title": "Banner image", "type": "string", "readOnly": true}, "about": {"title": "About", "description": "Information about the currency; history, purpose etc", "type": "string"}, "official_website": {"title": "Official website", "description": "Link to official website", "type": "string", "format": "uri", "maxLength": 200}, "white_paper": {"title": "White paper", "description": "Link to original whitepaper", "type": "string", "format": "uri", "maxLength": 200}, "initial_release": {"title": "Initial release", "description": "Date when first released", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "min_unit_name": {"title": "Min unit name", "description": "Name of the minimum unit value, for eg: Satoshi for Bitcoin", "type": "string", "maxLength": 64, "x-nullable": true}, "total_supply": {"title": "Total supply", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "circulating_supply": {"title": "Circulating supply", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "cmc_analytics": {"$ref": "#/definitions/CMCCurrencyQuotes"}}}, "CurrencyWithMeta": {"required": ["title", "symbol", "metadata"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "title": {"title": "Title", "type": "string", "maxLength": 64, "minLength": 1}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 16, "minLength": 1}, "chain": {"title": "Chain", "type": "string", "maxLength": 16, "x-nullable": true}, "token_standard": {"title": "Token standard", "type": "string", "maxLength": 16, "x-nullable": true}, "symbol_filename": {"title": "Symbol filename", "type": "string", "maxLength": 16, "x-nullable": true}, "is_crypto": {"title": "Is crypto", "type": "boolean"}, "withdraw_fee": {"title": "Withdraw fee", "type": "string", "format": "decimal", "x-nullable": true}, "minimum_withdrawal": {"title": "Minimum withdrawal", "type": "string", "format": "decimal", "x-nullable": true}, "metadata": {"$ref": "#/definitions/CurrencyMetadata"}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 50}}}, "ProfileLeaderboard": {"required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "xp": {"title": "Experience points", "type": "integer", "maximum": 2147483647, "minimum": 0}, "xp_level": {"title": "Experience level", "description": "Current logic for this calculation is:\n\n    if xp < 10:\n        return \"NEWBIE\"\n    if xp >= 10 and xp < 25:\n        return \"APPRENTICE\"\n    if xp >= 25 and xp < 100:\n        return \"SPECIALIST\"\n    if xp >= 100 and xp < 500:\n        return \"EXPERT\"\n    if xp >= 500 and xp < 1000:\n        return \"VETERAN\"\n    if xp >= 1000 and xp < 2500:\n        return \"MASTER\"\n    if xp >= 2500 and xp < 5000:\n        return \"GRANDMASTER\"\n    if xp >= 5000 and xp < 10000:\n        return \"CHAMPION\"\n    if xp >= 10000:\n        return \"LEGENDARY\"\n\n", "type": "string", "enum": ["NEWBIE", "APPRENTICE", "SPECIALIST", "EXPERT", "VETERAN", "MASTER", "GRANDMASTER", "CHAMPION", "LEGENDARY"]}}}, "FeatureOfferRequestCreate": {"required": ["offer_links"], "type": "object", "properties": {"username": {"title": "Username", "type": "string", "maxLength": 100, "x-nullable": true}, "offer_links": {"title": "Offer links", "type": "string", "minLength": 1}}}, "ProjectListingRequestCreate": {"required": ["name", "email", "project_name", "website"], "type": "object", "properties": {"name": {"title": "Name", "type": "string", "maxLength": 100, "minLength": 1}, "email": {"title": "Email", "type": "string", "format": "email", "maxLength": 254, "minLength": 1}, "project_name": {"title": "Project name", "type": "string", "maxLength": 100, "minLength": 1}, "website": {"title": "Website", "type": "string", "format": "uri", "maxLength": 200, "minLength": 1}, "message": {"title": "Message", "type": "string", "maxLength": 512, "x-nullable": true}, "locale": {"title": "Locale", "type": "string", "maxLength": 4, "minLength": 1}, "referrer": {"title": "Referrer", "type": "string", "maxLength": 512, "x-nullable": true}}}, "Notif": {"required": ["title", "description", "event"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "unread": {"title": "Unread", "type": "boolean"}, "title": {"title": "Title", "type": "string", "maxLength": 255, "minLength": 1}, "description": {"title": "Description", "type": "string", "maxLength": 255, "minLength": 1}, "event": {"title": "Event", "type": "string", "enum": ["TRADE_STATUS", "TRADE_MSG", "TRADE_ADMIN_MSG", "SWAP", "DIRECT_MSG", "REFERRAL", "WITHDRAWAL", "DEPOSIT", "ACCOUNT", "PROMO"]}, "metadata": {"title": "Metadata", "type": "object", "x-nullable": true}, "since": {"title": "Since", "type": "string", "readOnly": true}}}, "ProfileSerializerForOfferRetrieve": {"title": "Created by", "required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "local_currency_symbol": {"title": "Local currency symbol", "type": "string", "maxLength": 16, "minLength": 1, "x-nullable": true}, "activity_status": {"title": "Activity status", "type": "string", "readOnly": true}, "activity_tooltip": {"title": "Activity tooltip", "type": "string", "readOnly": true}, "is_email_verified": {"title": "Is email verified", "type": "string", "readOnly": true}, "is_phone_verified": {"title": "Is phone verified", "type": "string", "readOnly": true}, "avg_response_time": {"title": "Average response time", "description": "Average response time of user to reject or accept the contract", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "completed_trades": {"title": "Completed trades on our platform", "type": "integer", "maximum": 2147483647, "minimum": 0}, "platform_volume": {"title": "Platform volume", "type": "string", "readOnly": true}, "feedback_score": {"title": "Avg rating out of 5", "type": "string", "format": "decimal", "x-nullable": true}, "last_seen": {"title": "Last seen", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "is_legacy": {"title": "Pro Trader Badge", "type": "boolean"}, "bio": {"title": "Bio", "description": "What you are about, what you love and how people should contact you", "type": "string"}, "is_superuser": {"title": "Superuser status", "description": "Designates that this user has all permissions without explicitly assigning them.", "type": "boolean"}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid"}, "primary_language": {"title": "Primary language", "type": "string", "enum": ["en", "es", "ru", "ja", "hi", "ko", "ms", "pt", "zh"]}, "on_holiday": {"title": "On holiday", "type": "boolean"}, "sound_notifications": {"title": "Sound notification status", "type": "boolean"}, "nc_pw_reset_done": {"title": "Has the user performed one time password change for NC?", "type": "boolean"}, "hide_from_google": {"title": "Hide from google", "type": "boolean"}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time"}}}, "TradeType": {"title": "Trading type", "required": ["name", "action_name", "opposite_name", "opposite_action_name"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 100}, "name": {"title": "Name", "type": "string", "maxLength": 10, "minLength": 1}, "action_name": {"title": "Action name", "type": "string", "maxLength": 10, "minLength": 1}, "opposite_name": {"title": "Opposite name", "type": "string", "maxLength": 10, "minLength": 1}, "opposite_action_name": {"title": "Opposite action name", "type": "string", "maxLength": 10, "minLength": 1}}}, "MinimalPaymentMethod": {"title": "Payment method", "required": ["name"], "type": "object", "properties": {"name": {"title": "Payment method name", "type": "string", "maxLength": 100, "minLength": 1}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 100}}}, "PriceFormula": {"title": "Price formula", "required": ["display_formula"], "type": "object", "properties": {"display_formula": {"title": "Display formula", "type": "string", "maxLength": 128, "minLength": 1}, "prefix_formula": {"title": "Prefix formula", "type": "string", "maxLength": 1024, "minLength": 1, "x-nullable": true}, "pricing_type": {"title": "Pricing type", "description": "Pricing type for price formula", "type": "string", "enum": ["MARGIN", "ADVANCED", "FIXED"], "x-nullable": true}, "market": {"title": "Market", "description": "Pricing Market chosen for Margin price type", "type": "string", "enum": ["cmc", "bitfinex", "kraken", "bitstamp", "binance", "bittrex", "coinbase", "poloniex", "hitbtc", "cexio", "coinone", "independent_reserve", "kucoin"], "x-nullable": true}}}, "OfferRead": {"required": ["created_by", "trading_type", "coin_currency", "fiat_currency", "payment_method"], "type": "object", "properties": {"uuid": {"title": "Offer uuid", "type": "string", "format": "uuid"}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 128}, "is_active": {"title": "Is active", "type": "boolean"}, "created_by": {"$ref": "#/definitions/ProfileSerializerForOfferRetrieve"}, "trading_type": {"$ref": "#/definitions/TradeType"}, "coin_currency": {"$ref": "#/definitions/MinimalCurrency"}, "fiat_currency": {"$ref": "#/definitions/MinimalCurrency"}, "payment_method": {"$ref": "#/definitions/MinimalPaymentMethod"}, "location_name": {"title": "Location", "description": "City or region where you wish to trade", "type": "string", "maxLength": 100, "x-nullable": true}, "country_code": {"title": "Country Code", "description": "Country code in which you wish to trade", "type": "string", "maxLength": 2, "x-nullable": true}, "custodial_type": {"title": "Trade types allowed", "type": "integer", "maximum": 2147483647, "minimum": 0}, "min_trade_size": {"title": "Minimum trade volume", "type": "string", "format": "decimal"}, "max_trade_size": {"title": "Maximum trade volume", "type": "string", "format": "decimal", "x-nullable": true}, "trading_conditions": {"title": "Trading conditions", "description": "The conditions under which you trade with others.", "type": "string"}, "headline": {"title": "Headline", "description": "Headline for the offer, highlighted on the listings page.", "type": "string", "maxLength": 100, "x-nullable": true}, "hidden": {"title": "Hidden offer", "description": "If true, offer is hidden and only accessible directly through the URL", "type": "boolean"}, "enforced_sizes": {"title": "Trade sizes", "description": "These are the accepted sizes, comma separated. Eg: if you are exchanging\n        for gift cards of values $50 and $100, enter `50,100`", "type": "string", "maxLength": 1024, "x-nullable": true}, "blocked_countries": {"title": "Blocked country codes", "description": "Comma separated list of iso2 country codes like NG,KE", "type": "string", "maxLength": 512, "x-nullable": true}, "automatic_cancel_time": {"title": "Automatic cancellation time in minutes", "description": "Time until the trade will automatically cancel if you don't respond", "type": "string", "format": "decimal", "x-nullable": true}, "sms_required": {"title": "Phone verification required", "description": "Require potential traders to have verified their phone number.", "type": "boolean"}, "minimum_feedback": {"title": "Minimum feedback percentage", "description": "The minimum feedback percentage for users you\n        want to trade with (e.g. 100)", "type": "string", "format": "decimal"}, "price_formula": {"$ref": "#/definitions/PriceFormula"}, "price_formula_value": {"title": "Price formula value", "type": "string", "readOnly": true}, "trading_hours_localised": {"title": "Trading hours localised", "type": "string", "readOnly": true}, "trading_hours_type": {"title": "Trading hours type", "type": "string", "readOnly": true}, "trading_hours_json": {"title": "Trading hours json", "type": "string", "readOnly": true}, "current_margin_percentage": {"title": "Margin %", "type": "string", "format": "decimal", "x-nullable": true}}}, "OfferCreate": {"required": ["trading_type", "coin_currency", "fiat_currency", "payment_method", "country_code", "max_trade_size", "trading_hours_json"], "type": "object", "properties": {"trading_type": {"title": "Trading type", "description": "Trade type. It can either be `buy` or `sell`.", "type": "string"}, "coin_currency": {"title": "Coin currency", "description": "\nCrypto currency slug. Examples: `BTC`, `ETH`, `USDT-ERC20`.\n\n\nFull list of available cryptocurrencies can be found\nat `/currencies/crypto-currencies/`\n", "type": "string"}, "fiat_currency": {"title": "Fiat currency", "description": "\nFiat currency symbol. Examples: `USD`, `GBP`, `AUD`.\n\n\nFull list of available fiat-currencies can be found at `/currencies/fiat-currencies/`\n", "type": "string"}, "payment_method": {"title": "Payment method", "description": "\nName of the payment method. Examples: `PayPal`, `Cash Deposit`.\n\n\nFull list of available payment-methods can be found at `/offers/payment-methods/`\n", "type": "string"}, "uuid": {"title": "Offer uuid", "type": "string", "format": "uuid", "readOnly": true}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "readOnly": true, "minLength": 1}, "country_code": {"title": "Country code", "description": "Country code in alpha-2 format (two characters only).\n        See the list of available choices above.", "type": "string", "enum": ["EU", "AW", "AF", "AO", "AI", "AX", "AL", "AD", "AE", "AR", "AM", "AS", "AQ", "TF", "AG", "AU", "AT", "AZ", "BI", "BE", "BJ", "BQ", "BF", "BD", "BG", "BH", "BS", "BA", "BL", "BY", "BZ", "BM", "BO", "BR", "BB", "BN", "BT", "BV", "BW", "CF", "CA", "CC", "CH", "CL", "CN", "CI", "CM", "CD", "CG", "CK", "CO", "KM", "CV", "CR", "CU", "CW", "CX", "KY", "CY", "CZ", "DE", "DJ", "DM", "DK", "DO", "DZ", "EC", "EG", "ER", "EH", "ES", "EE", "ET", "FI", "FJ", "FK", "FR", "FO", "FM", "GA", "GB", "GE", "GG", "GH", "GI", "GN", "GP", "GM", "GW", "GQ", "GR", "GD", "GL", "GT", "GF", "GU", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IM", "IN", "IO", "IE", "IR", "IQ", "IS", "IL", "IT", "JM", "JE", "JO", "JP", "KZ", "KE", "KG", "KH", "KI", "KN", "KR", "KW", "LA", "LB", "LR", "LY", "LC", "LI", "LK", "LS", "LT", "LU", "LV", "MO", "MF", "MA", "MC", "MD", "MG", "MV", "MX", "MH", "MK", "ML", "MT", "MM", "ME", "MN", "MP", "MZ", "MR", "MS", "MQ", "MU", "MW", "MY", "YT", "NA", "NC", "NE", "NF", "NG", "NI", "NU", "NL", "NO", "NP", "NR", "NZ", "OM", "PK", "PA", "PN", "PE", "PH", "PW", "PG", "PL", "PR", "KP", "PT", "PY", "PS", "PF", "QA", "RE", "RO", "RU", "RW", "SA", "SD", "SN", "SG", "GS", "SH", "SJ", "SB", "SL", "SV", "SM", "SO", "PM", "RS", "SS", "ST", "SR", "SK", "SI", "SE", "SZ", "SX", "SC", "SY", "TC", "TD", "TG", "TH", "TJ", "TK", "TM", "TL", "TO", "TT", "TN", "TR", "TV", "TW", "TZ", "UG", "UA", "UM", "UY", "US", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "ZA", "ZM", "ZW"]}, "location_name": {"title": "Location name", "description": "\nCity or place name, consider using a discoverable location name.\nEg: `Mountain View, California` or `Sydney`.\n\n\nPlease make sure this name is within the `country_code` chosen above.\nBehind the scenes we perform a reverse lookup under\nthat country code to find geo-coordinates which further help in search APIs.\n", "type": "string", "default": "", "maxLength": 64}, "min_trade_size": {"title": "Min trade size", "description": "Expressed in terms of the fiat currency. Should be >= 1.", "type": "integer", "default": 1, "minimum": 1}, "max_trade_size": {"title": "Max trade size", "description": "Expressed in terms of the fiat currency. Should be >= `min_trade_size`.", "type": "integer", "minimum": 1}, "pricing_type": {"title": "Pricing type", "type": "string", "enum": ["MARGIN", "ADVANCED", "FIXED"], "default": "MARGIN"}, "pricing_market": {"title": "Pricing market", "type": "string", "enum": ["cmc", "bitfinex", "kraken", "bitstamp", "binance", "bittrex", "coinbase", "poloniex", "hitbtc", "cexio", "coinone", "independent_reserve", "kucoin"], "default": "cmc"}, "pricing_expression": {"title": "Pricing expression", "type": "string", "default": "2", "maxLength": 128, "minLength": 1}, "trading_conditions": {"title": "Trading conditions", "description": "The conditions under which you trade with others.", "type": "string", "default": ""}, "headline": {"title": "Headline", "description": "Headline for the offer, highlighted on the listings page.", "type": "string", "default": "", "maxLength": 60, "x-nullable": true}, "trading_hours_type": {"title": "Trading hours type", "description": "Choose whether you want to specify common availability hours\n        for every day or specify individual hours for each day", "type": "string", "enum": ["daily", "specific"], "default": "daily"}, "trading_hours_json": {"title": "Trading hours json", "description": "If `trading_hours_type` is `daily` then the format should be: \n\n\n```\n{\n    \"anyday\": {\n        \"from\": \"08:30\",\n        \"to\": \"21:00\"\n    }\n}```\n\n\n\n\nElse the format should be: \n\n\n```\n{\n    \"monday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"tuesday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"wednesday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"thursday\": {\n        \"from\": \"09:30\",\n        \"to\": \"21:00\"\n    },\n    \"friday\": {\n        \"from\": \"00:30\",\n        \"to\": \"21:00\"\n    },\n    \"saturday\": {\n        \"from\": \"18:30\",\n        \"to\": \"19:00\"\n    },\n    \"sunday\": {\n        \"from\": \"08:30\",\n        \"to\": \"21:00\"\n    }\n}```\n", "type": "object"}, "hidden": {"title": "Hidden offer", "description": "If true, offer is hidden and only accessible directly through the URL", "type": "boolean", "default": false}, "enforced_sizes": {"title": "Trade sizes", "description": "These are the accepted sizes, comma separated. Eg: if you are exchanging\n        for gift cards of values $50 and $100, enter `50,100`", "type": "string", "default": "", "maxLength": 500, "x-nullable": true}, "blocked_countries": {"title": "Blocked country codes", "description": "Comma separated list of iso2 country codes like NG,KE", "type": "string", "default": "", "maxLength": 510, "x-nullable": true}, "automatic_cancel_time": {"title": "Automatic cancel time", "description": "Time (in minutes) until the trade will automatically\n        cancel/expire if you don't respond", "type": "integer", "default": 240, "maximum": 2000, "minimum": 10}, "sms_required": {"title": "Phone verification required", "description": "Require potential traders to have verified their phone number.", "type": "boolean", "default": false}, "minimum_feedback": {"title": "Minimum feedback", "description": "Minimum feedback percentage required for traders to\n        initiate a trade on this offer.", "type": "integer", "maximum": 100, "minimum": 0}}}, "DryrunPricingExpressionRequest": {"type": "object", "properties": {"expression": {"title": "Expression", "description": "\nAn expression is a mathematical formula which uses variables supported\nby LocalCoinSwap.\n\n\nEg: `market.binance.btcusdt.ask + (market.binance.btcusdt.ask * 0.1)`\nis a valid expression to get 10% higher value for the current ask for\n`BTC` on Binance market.\n\n\n", "type": "string", "default": "", "maxLength": 128, "minLength": 1}}}, "DryrunPricingFormulaResponse": {"type": "object", "properties": {"price": {"title": "Price", "type": "string", "readOnly": true, "default": "", "maxLength": 64, "minLength": 1}}}, "DryrunPricingFormulaRequest": {"required": ["coin_currency", "fiat_currency", "margin_percent"], "type": "object", "properties": {"pricing_market": {"title": "Pricing market", "type": "string", "enum": ["cmc", "bitfinex", "kraken", "bitstamp", "binance", "bittrex", "coinbase", "poloniex", "hitbtc", "cexio", "coinone", "independent_reserve", "kucoin"], "default": "cmc"}, "coin_currency": {"title": "Coin currency", "description": "\nCrypto currency symbol. Examples: `BTC`, `ETH`.\n\n\nFull list of available cryptocurrencies can be found\nat `/currencies/crypto-currencies/`\n", "type": "string"}, "fiat_currency": {"title": "Fiat currency", "description": "\nFiat currency symbol. Examples: `USD`, `GBP`, `AUD`.\n\n\nFull list of available fiat-currencies can be found at `/currencies/fiat-currencies/`\n", "type": "string"}, "margin_percent": {"title": "Margin percent", "type": "string", "format": "decimal"}}}, "ProfileSerializerForOfferList": {"title": "Created by", "required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "activity_status": {"title": "Activity status", "type": "string", "readOnly": true}, "activity_tooltip": {"title": "Activity tooltip", "type": "string", "readOnly": true}, "is_email_verified": {"title": "Is email verified", "type": "string", "readOnly": true}, "is_phone_verified": {"title": "Is phone verified", "type": "string", "readOnly": true}, "last_seen": {"title": "Last seen", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "is_legacy": {"title": "Pro Trader Badge", "type": "boolean"}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid"}, "hide_from_google": {"title": "Hide from google", "type": "boolean"}, "imported_total_trades": {"title": "Imported trades", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "imported_volume": {"title": "Imported volume", "type": "string", "readOnly": true}, "completed_trades": {"title": "Completed trades on our platform", "type": "integer", "maximum": 2147483647, "minimum": 0}, "platform_volume": {"title": "Platform volume", "type": "string", "readOnly": true}, "feedback_score": {"title": "Avg rating out of 5", "type": "string", "format": "decimal", "x-nullable": true}, "avg_response_time": {"title": "Average response time", "description": "Average response time of user to reject or accept the contract", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}}}, "MinimalTradeType": {"title": "Trading type", "required": ["name", "opposite_name"], "type": "object", "properties": {"slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 100}, "name": {"title": "Name", "type": "string", "maxLength": 10, "minLength": 1}, "opposite_name": {"title": "Opposite name", "type": "string", "maxLength": 10, "minLength": 1}}}, "OfferList": {"required": ["created_by", "trading_type", "coin_currency", "fiat_currency", "payment_method"], "type": "object", "properties": {"uuid": {"title": "Offer uuid", "type": "string", "format": "uuid"}, "created_by": {"$ref": "#/definitions/ProfileSerializerForOfferList"}, "trading_type": {"$ref": "#/definitions/MinimalTradeType"}, "coin_currency": {"$ref": "#/definitions/MinimalCurrency"}, "fiat_currency": {"$ref": "#/definitions/MinimalCurrency"}, "payment_method": {"$ref": "#/definitions/MinimalPaymentMethod"}, "location_name": {"title": "Location", "description": "City or region where you wish to trade", "type": "string", "maxLength": 100, "x-nullable": true}, "country_code": {"title": "Country Code", "description": "Country code in which you wish to trade", "type": "string", "maxLength": 2, "x-nullable": true}, "min_trade_size": {"title": "Minimum trade volume", "type": "string", "format": "decimal"}, "max_trade_size": {"title": "Maximum trade volume", "type": "string", "format": "decimal", "x-nullable": true}, "headline": {"title": "Headline", "description": "Headline for the offer, highlighted on the listings page.", "type": "string", "maxLength": 100, "x-nullable": true}, "sms_required": {"title": "Phone verification required", "description": "Require potential traders to have verified their phone number.", "type": "boolean"}, "minimum_feedback": {"title": "Minimum feedback percentage", "description": "The minimum feedback percentage for users you\n        want to trade with (e.g. 100)", "type": "string", "format": "decimal"}, "price_formula_value": {"title": "Price formula value", "type": "string", "readOnly": true}, "current_margin_percentage": {"title": "Margin %", "type": "string", "format": "decimal", "x-nullable": true}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 128}, "automatic_cancel_time": {"title": "Automatic cancellation time in minutes", "description": "Time until the trade will automatically cancel if you don't respond", "type": "string", "format": "decimal", "x-nullable": true}, "enforced_sizes": {"title": "Trade sizes", "description": "These are the accepted sizes, comma separated. Eg: if you are exchanging\n        for gift cards of values $50 and $100, enter `50,100`", "type": "string", "maxLength": 1024, "x-nullable": true}, "popularity": {"title": "Offer popularity", "description": "The value is computed considering how many\n        trades are successful/expired", "type": "string", "format": "decimal"}, "reputation": {"title": "Reputation", "type": "integer", "maximum": 2147483647, "minimum": 0}, "is_featured": {"title": "Featured offer?", "description": "If true, offer is shown on top as Featured offer", "type": "boolean"}}}, "OfferSlug": {"type": "object", "properties": {"uuid": {"title": "Offer uuid", "type": "string", "format": "uuid"}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 128}}}, "OfferUpdate": {"required": ["country_code", "max_trade_size", "trading_hours_json"], "type": "object", "properties": {"uuid": {"title": "Offer uuid", "type": "string", "format": "uuid", "readOnly": true}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "readOnly": true, "minLength": 1}, "country_code": {"title": "Country code", "description": "Country code in alpha-2 format (two characters only).\n        See the list of available choices above.", "type": "string", "enum": ["EU", "AW", "AF", "AO", "AI", "AX", "AL", "AD", "AE", "AR", "AM", "AS", "AQ", "TF", "AG", "AU", "AT", "AZ", "BI", "BE", "BJ", "BQ", "BF", "BD", "BG", "BH", "BS", "BA", "BL", "BY", "BZ", "BM", "BO", "BR", "BB", "BN", "BT", "BV", "BW", "CF", "CA", "CC", "CH", "CL", "CN", "CI", "CM", "CD", "CG", "CK", "CO", "KM", "CV", "CR", "CU", "CW", "CX", "KY", "CY", "CZ", "DE", "DJ", "DM", "DK", "DO", "DZ", "EC", "EG", "ER", "EH", "ES", "EE", "ET", "FI", "FJ", "FK", "FR", "FO", "FM", "GA", "GB", "GE", "GG", "GH", "GI", "GN", "GP", "GM", "GW", "GQ", "GR", "GD", "GL", "GT", "GF", "GU", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IM", "IN", "IO", "IE", "IR", "IQ", "IS", "IL", "IT", "JM", "JE", "JO", "JP", "KZ", "KE", "KG", "KH", "KI", "KN", "KR", "KW", "LA", "LB", "LR", "LY", "LC", "LI", "LK", "LS", "LT", "LU", "LV", "MO", "MF", "MA", "MC", "MD", "MG", "MV", "MX", "MH", "MK", "ML", "MT", "MM", "ME", "MN", "MP", "MZ", "MR", "MS", "MQ", "MU", "MW", "MY", "YT", "NA", "NC", "NE", "NF", "NG", "NI", "NU", "NL", "NO", "NP", "NR", "NZ", "OM", "PK", "PA", "PN", "PE", "PH", "PW", "PG", "PL", "PR", "KP", "PT", "PY", "PS", "PF", "QA", "RE", "RO", "RU", "RW", "SA", "SD", "SN", "SG", "GS", "SH", "SJ", "SB", "SL", "SV", "SM", "SO", "PM", "RS", "SS", "ST", "SR", "SK", "SI", "SE", "SZ", "SX", "SC", "SY", "TC", "TD", "TG", "TH", "TJ", "TK", "TM", "TL", "TO", "TT", "TN", "TR", "TV", "TW", "TZ", "UG", "UA", "UM", "UY", "US", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "ZA", "ZM", "ZW"]}, "location_name": {"title": "Location name", "description": "\nCity or place name, consider using a discoverable location name.\nEg: `Mountain View, California` or `Sydney`.\n\n\nPlease make sure this name is within the `country_code` chosen above.\nBehind the scenes we perform a reverse lookup under\nthat country code to find geo-coordinates which further help in search APIs.\n", "type": "string", "default": "", "maxLength": 64}, "min_trade_size": {"title": "Min trade size", "description": "Expressed in terms of the fiat currency. Should be >= 1.", "type": "integer", "default": 1, "minimum": 1}, "max_trade_size": {"title": "Max trade size", "description": "Expressed in terms of the fiat currency. Should be >= `min_trade_size`.", "type": "integer", "minimum": 1}, "pricing_type": {"title": "Pricing type", "type": "string", "enum": ["MARGIN", "ADVANCED", "FIXED"], "default": "MARGIN"}, "pricing_market": {"title": "Pricing market", "type": "string", "enum": ["cmc", "bitfinex", "kraken", "bitstamp", "binance", "bittrex", "coinbase", "poloniex", "hitbtc", "cexio", "coinone", "independent_reserve", "kucoin"], "default": "cmc"}, "pricing_expression": {"title": "Pricing expression", "type": "string", "default": "2", "maxLength": 128, "minLength": 1}, "trading_conditions": {"title": "Trading conditions", "description": "The conditions under which you trade with others.", "type": "string", "default": ""}, "headline": {"title": "Headline", "description": "Headline for the offer, highlighted on the listings page.", "type": "string", "default": "", "maxLength": 60, "x-nullable": true}, "trading_hours_type": {"title": "Trading hours type", "description": "Choose whether you want to specify common availability hours\n        for every day or specify individual hours for each day", "type": "string", "enum": ["daily", "specific"], "default": "daily"}, "trading_hours_json": {"title": "Trading hours json", "description": "If `trading_hours_type` is `daily` then the format should be: \n\n\n```\n{\n    \"anyday\": {\n        \"from\": \"08:30\",\n        \"to\": \"21:00\"\n    }\n}```\n\n\n\n\nElse the format should be: \n\n\n```\n{\n    \"monday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"tuesday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"wednesday\": {\n        \"from\": \"06:30\",\n        \"to\": \"21:00\"\n    },\n    \"thursday\": {\n        \"from\": \"09:30\",\n        \"to\": \"21:00\"\n    },\n    \"friday\": {\n        \"from\": \"00:30\",\n        \"to\": \"21:00\"\n    },\n    \"saturday\": {\n        \"from\": \"18:30\",\n        \"to\": \"19:00\"\n    },\n    \"sunday\": {\n        \"from\": \"08:30\",\n        \"to\": \"21:00\"\n    }\n}```\n", "type": "object"}, "hidden": {"title": "Hidden offer", "description": "If true, offer is hidden and only accessible directly through the URL", "type": "boolean", "default": false}, "enforced_sizes": {"title": "Trade sizes", "description": "These are the accepted sizes, comma separated. Eg: if you are exchanging\n        for gift cards of values $50 and $100, enter `50,100`", "type": "string", "default": "", "maxLength": 500, "x-nullable": true}, "blocked_countries": {"title": "Blocked country codes", "description": "Comma separated list of iso2 country codes like NG,KE", "type": "string", "default": "", "maxLength": 510, "x-nullable": true}, "automatic_cancel_time": {"title": "Automatic cancel time", "description": "Time (in minutes) until the trade will automatically\n        cancel/expire if you don't respond", "type": "integer", "default": 240, "maximum": 2000, "minimum": 10}, "sms_required": {"title": "Phone verification required", "description": "Require potential traders to have verified their phone number.", "type": "boolean", "default": false}, "minimum_feedback": {"title": "Minimum feedback", "description": "Minimum feedback percentage required for traders to\n        initiate a trade on this offer.", "type": "integer", "maximum": 100, "minimum": 0}, "is_active": {"title": "Is active", "type": "boolean"}}}, "OnboardingUpdate": {"type": "object", "properties": {"step": {"title": "Current step", "type": "string", "enum": ["INTENT", "PRIOR_EXP_WITH_P2P", "CRYPTO_INTEREST", "CHOOSE_OFFER", "START_TRADE_FORM", "HAS_TRADE_REP_HISTORY", "IMPORT_REP_FORM", "CREATE_OFFER_FORM"]}, "intent": {"title": "User intent", "type": "string", "enum": ["BUY", "SELL", "VENDOR"], "x-nullable": true}, "prior_exp_with_p2p": {"title": "Prior experience with P2P trading", "type": "boolean", "x-nullable": true}, "crypto_interest": {"title": "Crypto interest", "type": "string", "maxLength": 16, "x-nullable": true}, "has_trade_rep_history": {"title": "Has trade reputation to import?", "type": "boolean", "x-nullable": true}, "rep_urls": {"title": "Comma separated rep import URLs", "type": "string", "x-nullable": true}, "completed": {"title": "Reached end of survey?", "type": "boolean"}, "skipped": {"title": "Skipped?", "type": "boolean"}}}, "ProfileCryptoDataRead": {"required": ["salt", "iterations", "initialization_vector", "encrypted_account_key", "public_identity_key"], "type": "object", "properties": {"salt": {"title": "Secret Key Salt", "description": "Random salt generated user-side, used to create Secret Key", "type": "string", "maxLength": 32, "minLength": 1}, "iterations": {"title": "Number of iterations", "description": "Random number between 20,000 and 30,000", "type": "integer", "maximum": 2147483647, "minimum": 0}, "initialization_vector": {"title": "Initialization vector", "description": "Random 16-byte IV generated user-side, used to encrypt/decrypt Account Key", "type": "string", "maxLength": 32, "minLength": 1}, "encrypted_account_key": {"title": "Encrypted Account Key", "description": "User-generated Account Key encrypted with AES-256", "type": "string", "maxLength": 96, "minLength": 1}, "public_identity_key": {"title": "Public Identity Key", "description": "ECDSA public key that corresponds to user's Private Key", "type": "string", "maxLength": 128, "minLength": 1}, "encrypted_mnemonic": {"title": "Encrypted Mnemonic 512", "type": "string", "maxLength": 512, "minLength": 1, "x-nullable": true}, "encrypted_mnemonic_256": {"title": "Encrypted Mnemonic 256", "type": "string", "maxLength": 512, "minLength": 1, "x-nullable": true}, "encrypted_mnemonic_iv": {"title": "Encrypted Mnemonic IV", "type": "string", "maxLength": 32, "minLength": 1, "x-nullable": true}}}, "ProfileUsernameUpdate": {"required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "type": "string", "pattern": "^[A-Za-z0-9_]+$", "maxLength": 14, "minLength": 3}}}, "CommissionPaymentList": {"required": ["to_address"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "uuid": {"title": "Uuid", "type": "string", "format": "uuid"}, "to_address": {"title": "To address", "type": "string", "maxLength": 256, "minLength": 1}, "tx_hash": {"title": "Transaction hash ", "type": "string", "maxLength": 256, "x-nullable": true}, "amount": {"title": "Amount paid in BTC", "type": "string", "format": "decimal"}, "created": {"title": "Created", "type": "string", "format": "date-time", "readOnly": true}}}, "ReferredUsersSerialier": {"type": "object", "properties": {"completed_trades": {"title": "Completed trades on our platform", "type": "integer", "readOnly": true}, "country_code": {"title": "Country code", "description": "Country code in alpha-2 format (two characters only).\n        See the list of available choices above.", "type": "string", "enum": ["EU", "AW", "AF", "AO", "AI", "AX", "AL", "AD", "AE", "AR", "AM", "AS", "AQ", "TF", "AG", "AU", "AT", "AZ", "BI", "BE", "BJ", "BQ", "BF", "BD", "BG", "BH", "BS", "BA", "BL", "BY", "BZ", "BM", "BO", "BR", "BB", "BN", "BT", "BV", "BW", "CF", "CA", "CC", "CH", "CL", "CN", "CI", "CM", "CD", "CG", "CK", "CO", "KM", "CV", "CR", "CU", "CW", "CX", "KY", "CY", "CZ", "DE", "DJ", "DM", "DK", "DO", "DZ", "EC", "EG", "ER", "EH", "ES", "EE", "ET", "FI", "FJ", "FK", "FR", "FO", "FM", "GA", "GB", "GE", "GG", "GH", "GI", "GN", "GP", "GM", "GW", "GQ", "GR", "GD", "GL", "GT", "GF", "GU", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IM", "IN", "IO", "IE", "IR", "IQ", "IS", "IL", "IT", "JM", "JE", "JO", "JP", "KZ", "KE", "KG", "KH", "KI", "KN", "KR", "KW", "LA", "LB", "LR", "LY", "LC", "LI", "LK", "LS", "LT", "LU", "LV", "MO", "MF", "MA", "MC", "MD", "MG", "MV", "MX", "MH", "MK", "ML", "MT", "MM", "ME", "MN", "MP", "MZ", "MR", "MS", "MQ", "MU", "MW", "MY", "YT", "NA", "NC", "NE", "NF", "NG", "NI", "NU", "NL", "NO", "NP", "NR", "NZ", "OM", "PK", "PA", "PN", "PE", "PH", "PW", "PG", "PL", "PR", "KP", "PT", "PY", "PS", "PF", "QA", "RE", "RO", "RU", "RW", "SA", "SD", "SN", "SG", "GS", "SH", "SJ", "SB", "SL", "SV", "SM", "SO", "PM", "RS", "SS", "ST", "SR", "SK", "SI", "SE", "SZ", "SX", "SC", "SY", "TC", "TD", "TG", "TH", "TJ", "TK", "TM", "TL", "TO", "TT", "TN", "TR", "TV", "TW", "TZ", "UG", "UA", "UM", "UY", "US", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "ZA", "ZM", "ZW"], "readOnly": true}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time", "readOnly": true}, "username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "readOnly": true, "minLength": 1}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid", "readOnly": true}, "earnings": {"title": "Earnings", "type": "string", "readOnly": true}}}, "UserDetails": {"title": "User", "required": ["timezone"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "readOnly": true, "minLength": 1}, "username_changed": {"title": "Username changed", "type": "boolean", "readOnly": true}, "email": {"title": "Email address", "type": "string", "format": "email", "readOnly": true, "minLength": 1}, "timezone": {"title": "Timezone", "type": "string"}, "local_currency_symbol": {"title": "Local currency symbol", "type": "string", "maxLength": 16, "minLength": 1, "x-nullable": true}, "bio": {"title": "Bio", "description": "What you are about, what you love and how people should contact you", "type": "string"}, "twitter_username": {"title": "Twitter username", "type": "string", "maxLength": 64, "x-nullable": true}, "is_email_verified": {"title": "Is email verified", "type": "string", "readOnly": true}, "is_superuser": {"title": "Superuser status", "description": "Designates that this user has all permissions without explicitly assigning them.", "type": "boolean", "readOnly": true}, "last_seen": {"title": "Last seen", "type": "integer", "readOnly": true}, "profile_image": {"title": "Profile image", "type": "string", "readOnly": true, "format": "uri"}, "activity_status": {"title": "Activity status", "type": "string", "readOnly": true}, "activity_tooltip": {"title": "Activity tooltip", "type": "string", "readOnly": true}, "feedback_score": {"title": "Avg rating out of 5", "type": "string", "format": "decimal", "readOnly": true}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid", "readOnly": true}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time", "readOnly": true}, "avg_response_time": {"title": "Average response time", "description": "Average response time of user to reject or accept the contract", "type": "integer", "readOnly": true}, "email_preferences": {"title": "Email preferences", "type": "string", "readOnly": true}, "sms_preferences": {"title": "Sms preferences", "type": "string", "readOnly": true}, "trade_settings": {"title": "Trade settings", "type": "string", "readOnly": true}, "primary_language": {"title": "Primary language", "type": "string", "enum": ["en", "es", "ru", "ja", "hi", "ko", "ms", "pt", "zh"]}, "lang_list": {"title": "Known languages (comma separated string)", "type": "string", "maxLength": 512, "minLength": 1}, "phone": {"title": "Phone", "description": "Phone number with country code, without spaces, eg: +8613911820359", "type": "string", "maxLength": 50, "x-nullable": true}, "login_mfa_otp": {"title": "Use App 2FA on login?", "description": "If checked, users will be asked to enter OTP from Auth app on login. If unchecked, then email approve link is sent.", "type": "boolean", "readOnly": true}, "on_holiday": {"title": "On holiday", "type": "boolean"}, "is_telegram_enabled": {"title": "Is telegram enabled", "type": "string", "readOnly": true}, "telegram_preferences": {"title": "Telegram preferences", "type": "string", "readOnly": true}, "telegram_unique_token": {"title": "Telegram unique token", "type": "string", "readOnly": true, "minLength": 1}, "sound_notifications": {"title": "Sound notification status", "type": "boolean"}, "nc_pw_reset_done": {"title": "Has the user performed one time password change for NC?", "type": "boolean", "readOnly": true}, "scam_warning_trade_modal": {"title": "Scam warning trade modal", "type": "boolean"}, "referral_code": {"title": "Unique referral code", "type": "string", "readOnly": true, "minLength": 1}, "hide_volume": {"title": "Hide volume", "type": "boolean"}, "hide_from_leaderboard": {"title": "Hide from leaderboard", "type": "boolean"}, "hide_from_google": {"title": "Hide from google", "type": "boolean"}, "is_kyc_verified": {"title": "Is kyc verified", "type": "string", "readOnly": true}}}, "ReferralCommission": {"type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "user": {"$ref": "#/definitions/UserDetails"}, "total_amount": {"title": "Total earnings", "type": "string", "format": "decimal", "readOnly": true}, "pending_amount": {"title": "Balance", "type": "string", "format": "decimal", "readOnly": true}, "paid_amount": {"title": "Paid", "type": "string", "format": "decimal", "readOnly": true}, "opt_in_next_payout": {"title": "Opt in?", "type": "boolean"}, "btc_payout_address": {"title": "Payout address", "type": "string", "maxLength": 512, "x-nullable": true}, "fiat_values": {"title": "Fiat values", "type": "string", "readOnly": true}, "total_referred_users": {"title": "Total referred users", "type": "string", "readOnly": true}, "total_referred_trades": {"title": "Total referred trades", "type": "string", "readOnly": true}}}, "PublicUserDetails": {"title": "Ref user", "required": ["username", "timezone"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "timezone": {"title": "Timezone", "type": "string"}, "local_currency_symbol": {"title": "Local currency symbol", "type": "string", "maxLength": 16, "minLength": 1, "x-nullable": true}, "bio": {"title": "Bio", "description": "What you are about, what you love and how people should contact you", "type": "string"}, "is_staff": {"title": "Staff status", "description": "Designates whether the user can log into this admin site.", "type": "boolean"}, "is_superuser": {"title": "Superuser status", "description": "Designates that this user has all permissions without explicitly assigning them.", "type": "boolean"}, "is_email_verified": {"title": "Is email verified", "type": "string", "readOnly": true}, "last_seen": {"title": "Last seen", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "cached_last_seen": {"title": "Cached last seen", "type": "string", "readOnly": true}, "profile_image": {"title": "Profile image", "type": "string", "readOnly": true, "format": "uri"}, "activity_status": {"title": "Activity status", "type": "string", "readOnly": true}, "activity_tooltip": {"title": "Activity tooltip", "type": "string", "readOnly": true}, "feedback_score": {"title": "Avg rating out of 5", "type": "string", "format": "decimal", "x-nullable": true}, "completed_trades": {"title": "Completed trades on our platform", "type": "integer", "maximum": 2147483647, "minimum": 0}, "trades_30d": {"title": "Trades 30d", "type": "integer", "maximum": 2147483647, "minimum": 0}, "platform_volume": {"title": "Platform volume", "type": "string", "readOnly": true}, "platform_volume_30d": {"title": "Platform volume 30d", "type": "string", "readOnly": true}, "avg_response_time": {"title": "Average response time", "description": "Average response time of user to reject or accept the contract", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid"}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time"}, "is_phone_verified": {"title": "Is phone verified", "type": "string", "readOnly": true}, "is_legacy": {"title": "Pro Trader Badge", "type": "boolean"}, "primary_language": {"title": "Primary language", "type": "string", "enum": ["en", "es", "ru", "ja", "hi", "ko", "ms", "pt", "zh"]}, "lang_list": {"title": "Known languages (comma separated string)", "type": "string", "maxLength": 512, "minLength": 1}, "times_blocked": {"title": "Times blocked", "type": "integer", "maximum": 2147483647, "minimum": 0}, "times_followed": {"title": "Times followed", "type": "integer", "maximum": 2147483647, "minimum": 0}, "imported_total_trades": {"title": "Imported trades", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "imported_volume": {"title": "Imported volume", "type": "string", "readOnly": true}, "on_holiday": {"title": "On holiday", "type": "boolean"}, "non_custodial": {"title": "Is the user a non-custodial user", "type": "boolean"}, "xp_level": {"title": "Experience level", "description": "Current logic for this calculation is:\n\n    if xp < 10:\n        return \"NEWBIE\"\n    if xp >= 10 and xp < 25:\n        return \"APPRENTICE\"\n    if xp >= 25 and xp < 100:\n        return \"SPECIALIST\"\n    if xp >= 100 and xp < 500:\n        return \"EXPERT\"\n    if xp >= 500 and xp < 1000:\n        return \"VETERAN\"\n    if xp >= 1000 and xp < 2500:\n        return \"MASTER\"\n    if xp >= 2500 and xp < 5000:\n        return \"GRANDMASTER\"\n    if xp >= 5000 and xp < 10000:\n        return \"CHAMPION\"\n    if xp >= 10000:\n        return \"LEGENDARY\"\n\n", "type": "string", "enum": ["NEWBIE", "APPRENTICE", "SPECIALIST", "EXPERT", "VETERAN", "MASTER", "GRANDMASTER", "CHAMPION", "LEGENDARY"]}, "xp": {"title": "Experience points", "type": "integer", "maximum": 2147483647, "minimum": 0}, "stats": {"title": "Stats", "type": "string", "readOnly": true}}}, "ReferrerTrade": {"title": "Trade", "required": ["coin_currency", "fiat_currency"], "type": "object", "properties": {"uuid": {"title": "Uuid", "type": "string", "format": "uuid"}, "time_created": {"title": "Created time", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "coin_currency": {"$ref": "#/definitions/MinimalCurrency"}, "fiat_currency": {"$ref": "#/definitions/MinimalCurrency"}}}, "TradeCommissionList": {"type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "ref_user": {"$ref": "#/definitions/PublicUserDetails"}, "trade": {"$ref": "#/definitions/ReferrerTrade"}, "amount": {"title": "Commission", "type": "string", "format": "decimal"}, "percent": {"title": "Percent from our fee", "type": "string", "format": "decimal"}, "is_paid": {"title": "Is paid", "type": "boolean"}, "created": {"title": "Created", "type": "string", "format": "date-time", "readOnly": true}}}, "ReportTrader": {"required": ["description", "reported_user_uuid"], "type": "object", "properties": {"description": {"title": "Description", "type": "string", "minLength": 1}, "reported_user_uuid": {"title": "Reported user uuid", "type": "string", "format": "uuid"}}}, "SwapRead": {"required": ["provider", "user", "from_crypto", "to_currency", "from_amount", "initial_to_amount", "addresses_json", "tx_json"], "type": "object", "properties": {"provider": {"title": "Provider", "type": "string", "enum": ["CHANGENOW"]}, "swap_id": {"title": "Swap id", "description": "This is the id provided by the third party.", "type": "string", "maxLength": 256, "x-nullable": true}, "user": {"$ref": "#/definitions/ProfileSerializerForOfferRetrieve"}, "status": {"title": "Status", "type": "string", "enum": ["NEW", "WAITING", "FUNDING", "CONFIRMING", "EXCHANGING", "SENDING", "FINISHED", "FAILED", "REFUNDED", "VERIFYING", "EXPIRED"]}, "from_crypto": {"$ref": "#/definitions/MinimalCurrency"}, "to_currency": {"$ref": "#/definitions/MinimalCurrency"}, "from_amount": {"title": "From amount", "type": "string", "format": "decimal"}, "initial_to_amount": {"title": "Initial to amount", "description": "Initial expected amount to be recieved", "type": "string", "format": "decimal"}, "addresses_json": {"title": "Addresses json", "type": "object"}, "uuid": {"title": "Uuid", "type": "string", "format": "uuid"}, "tx_json": {"title": "Tx json", "type": "object"}, "final_to_amount": {"title": "Final to amount", "description": "Final amount actually recieved by our user", "type": "string", "format": "decimal", "x-nullable": true}, "provider_created_at": {"title": "Provider_created_at", "type": "string", "format": "date-time", "x-nullable": true}}}, "SwapCreate": {"required": ["provider", "from_crypto", "to_currency", "from_amount", "addresses_json", "initial_to_amount"], "type": "object", "properties": {"uuid": {"title": "Uuid", "type": "string", "format": "uuid"}, "status": {"title": "Status", "type": "string", "enum": ["NEW", "WAITING", "FUNDING", "CONFIRMING", "EXCHANGING", "SENDING", "FINISHED", "FAILED", "REFUNDED", "VERIFYING", "EXPIRED"]}, "provider": {"title": "Provider", "type": "string", "enum": ["CHANGENOW"]}, "from_crypto": {"title": "From crypto", "description": "Crypto you want to swap from.", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "to_currency": {"title": "To currency", "description": "Crypto you want to swap to.", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "from_amount": {"title": "From amount", "type": "string", "format": "decimal"}, "addresses_json": {"title": "Addresses json", "type": "object"}, "initial_to_amount": {"title": "Initial to amount", "description": "Initial expected amount to be recieved", "type": "string", "format": "decimal"}, "provider_created_at": {"title": "Provider_created_at", "type": "string", "format": "date-time", "x-nullable": true}}}, "SwapUuid": {"type": "object", "properties": {"status": {"title": "Status", "type": "string", "enum": ["NEW", "WAITING", "FUNDING", "CONFIRMING", "EXCHANGING", "SENDING", "FINISHED", "FAILED", "REFUNDED", "VERIFYING", "EXPIRED"]}, "uuid": {"title": "Uuid", "type": "string", "format": "uuid"}}}, "EstimateSwapAmount": {"required": ["amount", "to_currency", "from_crypto"], "type": "object", "properties": {"amount": {"title": "Amount", "description": "Amount of crypto you want to swap from.", "type": "string", "format": "decimal"}, "to_currency": {"title": "To currency", "description": "Currency you want to swap to.", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "from_crypto": {"title": "From crypto", "description": "Crypto you want to swap from.", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}}}, "SwapUpdate": {"required": ["tx_json"], "type": "object", "properties": {"status": {"title": "Status", "description": "#### The status in which you want to move the swap into.\n        Currently users only need to move their swap to:\n - `FUNDING` - When you have sent the funds to be swapped to the pay-in address.\n   - Only can be called when swap is in `CREATED` state.\n", "type": "string", "enum": ["NEW", "WAITING", "FUNDING", "CONFIRMING", "EXCHANGING", "SENDING", "FINISHED", "FAILED", "REFUNDED", "VERIFYING", "EXPIRED"], "default": "FUNDING"}, "tx_json": {"title": "Tx json", "type": "object"}}}, "TradeUtxo": {"required": ["value", "witnessScript", "trade", "tradeInstruction", "type"], "type": "object", "properties": {"secret_uid": {"title": "Secret uid", "type": "string", "readOnly": true}, "prev_tx": {"title": "Serialized previous transaction", "type": "string", "x-nullable": true}, "tx_hash": {"title": "Tx hash", "type": "string", "maxLength": 256, "x-nullable": true}, "tx_pos": {"title": "Tx input position", "type": "integer", "maximum": 2147483647, "minimum": 0}, "value": {"title": "Value", "type": "integer"}, "witnessScript": {"title": "Witnessscript", "type": "string", "minLength": 1}, "trade": {"title": "Trade", "type": "string", "format": "uuid"}, "trade_secret_enc": {"title": "Encrypted trade secret", "type": "string", "maxLength": 1024, "x-nullable": true}, "tradeInstruction": {"title": "Tradeinstruction", "type": "string", "minLength": 1}, "type": {"title": "Type", "type": "string", "minLength": 1}}}, "TradeFeedbackCreate": {"required": ["rating", "feedback", "trade"], "type": "object", "properties": {"rating": {"title": "Rating", "type": "string", "enum": ["1", "2", "3", "4", "5"]}, "feedback": {"title": "Feedback", "type": "string"}, "trade": {"title": "Trade", "description": "UUID of the trade you want to provide the feedback on.", "type": "string"}}}, "MinimalUserDetails": {"title": "Feedback for", "description": "Username", "required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "local_currency_symbol": {"title": "Local currency symbol", "type": "string", "maxLength": 16, "minLength": 1, "x-nullable": true}, "bio": {"title": "Bio", "description": "What you are about, what you love and how people should contact you", "type": "string"}, "is_staff": {"title": "Staff status", "description": "Designates whether the user can log into this admin site.", "type": "boolean"}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid"}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time"}, "primary_language": {"title": "Primary language", "type": "string", "enum": ["en", "es", "ru", "ja", "hi", "ko", "ms", "pt", "zh"]}, "non_custodial": {"title": "Is the user a non-custodial user", "type": "boolean"}}}, "TradeFeedbackRead": {"required": ["trade"], "type": "object", "properties": {"feedback_for": {"$ref": "#/definitions/MinimalUserDetails"}, "rating": {"title": "Rating", "type": "string", "format": "decimal", "x-nullable": true}, "feedback": {"title": "Feedback", "type": "string", "x-nullable": true}, "feedback_by": {"$ref": "#/definitions/MinimalUserDetails"}, "id": {"title": "ID", "type": "integer", "readOnly": true}, "rating_percentage": {"title": "Rating percentage", "type": "string", "readOnly": true}, "time_created": {"title": "Created time", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "trade": {"title": "Trade", "type": "string", "format": "uuid"}}}, "ContractMessageList": {"type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "content": {"title": "Content", "type": "string", "x-nullable": true}, "attachment": {"title": "Attachment", "type": "string", "readOnly": true}, "time_created": {"title": "Created at", "type": "integer", "maximum": 2147483647, "minimum": 0}, "created_by": {"$ref": "#/definitions/PublicUserDetails"}, "recipient": {"$ref": "#/definitions/PublicUserDetails"}}}, "ContractMessage": {"type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "content": {"title": "Content", "type": "string", "x-nullable": true}, "message": {"title": "Message", "type": "string", "maxLength": 2000, "x-nullable": true}, "attachment": {"title": "Attachment", "type": "string", "readOnly": true, "format": "uri"}, "time_created": {"title": "Created at", "type": "integer", "readOnly": true}, "created_by": {"$ref": "#/definitions/PublicUserDetails"}, "recipient": {"title": "Recipient", "type": "integer", "readOnly": true}}}, "BtcNcTradeSecret": {"title": "Btc trade secrets", "description": "This is **only required** for non-custodial BTC trades.", "required": ["encrypted_secret", "hashed_secret", "hashed_public_key"], "type": "object", "properties": {"encrypted_secret": {"title": "Encrypted secret", "type": "string", "minLength": 1}, "hashed_secret": {"title": "Hashed secret", "type": "string", "minLength": 1}, "hashed_public_key": {"title": "Hashed public key", "type": "string", "minLength": 1}, "hashed_secret_signed": {"title": "Hashed secret signed", "type": "string", "minLength": 1}, "address_signed": {"title": "Address signed", "type": "string", "minLength": 1}}}, "NonCustodialTradeCreate": {"required": ["offer", "fiat_amount", "coin_amount", "wallet_address"], "type": "object", "properties": {"offer": {"title": "Offer", "description": "UUID of the Offer you want to initiate the trade with.", "type": "string"}, "fiat_amount": {"title": "Fiat amount", "description": "Amount in fiat (local) currency corresponding to\n        the crypto value to buy/sell.", "type": "string", "format": "decimal"}, "coin_amount": {"title": "Coin amount", "description": "Crypto value for the trade.", "type": "string", "format": "decimal"}, "wallet_address": {"title": "Wallet address", "description": "Wallet address you want to use to start the trade.", "type": "string", "maxLength": 256, "minLength": 1}, "wallet_pubkey": {"title": "Wallet pubkey", "description": "Public key hex corresponding to `wallet_address`.", "type": "string", "maxLength": 256}, "wallet_type": {"title": "Wallet type", "description": "Web wallet is the non-custodial LocalCoinSwap Wallet.\n        You can also connect Metamask wallet and use that to start a trade.\n        This requires authorization from Metamask when funding/releasing escrow.", "type": "string", "enum": ["webwallet"], "default": "webwallet"}, "btc_trade_secrets": {"$ref": "#/definitions/BtcNcTradeSecret"}}}, "TradeUuid": {"type": "object", "properties": {"status": {"title": "Status", "type": "string", "enum": ["CREATED", "ACCEPTED", "REJECTED", "WAITING_FOR_ESCROW", "BROADCASTING_ESCROW", "BROADCASTING_ESCROW_FAILED", "WAITING_FOR_MIN_ESCROW_CONFIRMS", "CRYPTO_ESC", "CRYPTO_ESC_FAILED", "FUND_PAID", "FUND_RECEIVED", "COMPLETED", "EXPIRED", "DISPUTED", "DISPUTE_RESOLVE_BUYER", "DISPUTE_RESOLVE_SELLER", "CANCELLATION_REQUESTED", "CANCELLED", "CANCELLATION_REJECTED", "BROADCASTING_RELEASE", "BROADCASTING_RELEASE_FAILED", "WAITING_FOR_CRYPTO_RELEASE_CONFIRMS", "CRYPTO_REL", "CRYPTO_REL_FAILED", "PUBLISHING_SELLER_ESCROW", "ARB_PUBLISHING_RELEASE_TX", "ARB_RELEASE_FAILED", "WAITING_SELLER_RELEASE", "PUBLISHING_SELLER_RELEASE", "SELLER_RELEASE_FAILED", "ARB_PUBLISHING_CANCEL_TXS", "ARB_CANCEL_FAILED", "WAITING_SELLER_CANCEL", "PUBLISHING_SELLER_CANCEL", "SELLER_CANCEL_FAILED", "ARB_PUBLISHING_DISPUTE_TXS", "ARB_DISPUTE_FAILED", "WAITING_DISPUTE_BUYER", "WAITING_DISPUTE_SELLER", "PUBLISHING_BUYER_DISPUTE", "PUBLISHING_SELLER_DISPUTE", "SELLER_DISPUTE_FAILED", "BUYER_DISPUTE_FAILED", "WAITING_FOR_MIN_APPROVE_CONFIRMS", "TRANSFER_APPROVED", "TRANSFER_APPROVAL_FAILED", "WAITING_FOR_TRANSFER_APPROVE"]}, "uuid": {"title": "Uuid", "type": "string", "format": "uuid"}}}, "SignedRelaySignature": {"title": "Signed relay signature", "description": "This is **only required** to mark non-custodial ERC20 trades\n        as FUND_RECEIVED by the seller.", "required": ["r", "s", "v"], "type": "object", "properties": {"r": {"title": "R", "type": "string", "minLength": 1}, "s": {"title": "S", "type": "string", "minLength": 1}, "v": {"title": "V", "type": "integer"}}}, "NonCustodialTradeUpdate": {"type": "object", "properties": {"status": {"title": "Status", "description": "#### The status in which you want to move the trade into.\n - `ACCEPTED` - When you want to accept a trade initiated on your offer.\n   - Only offer creator can accept a trade.\n   - When seller accepts the trade and if they have enough funds in their LocalCoinSwap Wallet,\n     transition to `CRYPTO_ESC` happens automatically.\n - `WAITING_FOR_MIN_APPROVE_CONFIRMS`\n   - When you are waiting for the minimum number of blockchain confirmations\n     for an ERC20 approval transaction.\n   - This step is required only for ERC20 token (excluding ETH)\n - `TRANSFER_APPROVED` - When you want to approve ERC20 non-custodial escrow.\n   - Only seller can perform this action.\n   - This step is required only for ERC20 token (excluding ETH)\n - `WAITING_FOR_MIN_ESCROW_CONFIRMS`\n   - When you are waiting for the minimum number of blockchain confirmations\n     for an escrow transaction.\n - `CRYPTO_ESC` - When you want to fund the Escrow.\n   - Only seller can perform this action.\n   - Requires enough funds in the selected non-custodial Wallet.\n - `FUND_PAID` - When you want to indicate that you have transferred fiat/local currency\n payment via the payment method agreed upon based on offer terms.\n   - Only buyer can perform this action.\n - `FUND_RECEIVED` - When you want to indicate that you have received fiat/local currency\n payment from the buyer.\n - `PUBLISHING_SELLER_RELEASE`\n   - When you sign the payload to release.\n   - Only seller can perform this action.\n - `CANCELLED` - When you want to canel a trade.\n   - If the current status of the trade allows cancellation right away, the trade will be\n     marked cancelled.\n   - Else, the trade will follow double-confirmation flow where both seller and buyer have\n     to mutually agree to cancel the trade.\n - `CANCELLATION_REJECTED` - When you want to reject the cancellation request.\n - `PUBLISHING_SELLER_CANCEL` - When you want to revert the escrowed crypto.\n", "type": "string", "enum": ["ACCEPTED", "WAITING_FOR_MIN_APPROVE_CONFIRMS", "TRANSFER_APPROVED", "WAITING_FOR_MIN_ESCROW_CONFIRMS", "CRYPTO_ESC", "FUND_PAID", "FUND_RECEIVED", "PUBLISHING_SELLER_RELEASE", "DISPUTED", "PUBLISHING_BUYER_DISPUTE", "PUBLISHING_SELLER_DISPUTE", "CANCELLED", "CANCELLATION_REJECTED", "PUBLISHING_SELLER_CANCEL"], "default": "ACCEPTED"}, "wallet_address": {"title": "Wallet address", "description": "Wallet address you want to use to accept the trade.\n        Required only at the time of accepting a non-custodial trade.", "type": "string", "maxLength": 256, "minLength": 1}, "wallet_pubkey": {"title": "Wallet pubkey", "description": "Public key hex corresponding to `wallet_address`.", "type": "string", "maxLength": 256}, "wallet_type": {"title": "Wallet type", "description": "Required only at the time of accepting a non-custodial trade.\n        Web wallet is the non-custodial LocalCoinSwap Wallet.\n        You can also connect Metamask wallet and use that to start a trade.\n        This requires authorization from Metamask when funding/releasing escrow.", "type": "string", "enum": ["webwallet"], "default": "webwallet"}, "signed_txn": {"title": "Signed txn", "type": "string", "minLength": 1}, "fee_signed_txn": {"title": "Fee signed txn", "description": "This is **only required** to mark non-custodial substrate trades\n        as WAITING_FOR_MIN_ESCROW_CONFIRMS by the seller.", "type": "string", "minLength": 1}, "trx_signed_txn": {"title": "Trx signed txn", "type": "object"}, "broadcasted_txn_hash": {"title": "Broadcasted txn hash", "description": "This is used only when you connect a hardware wallet like Metamask\n        with LocalCoinSwap. You have to broadcast the signed transaction yourself and\n        pass the broadcasted transaction hash to the API.", "type": "string", "minLength": 1}, "signed_relay_signature": {"$ref": "#/definitions/SignedRelaySignature"}, "release_signature": {"title": "Release signature", "description": "This is **only required** to release escrow for LTC trades.", "type": "string"}, "release_psbt_base64": {"title": "Release psbt base64", "description": "This is **only required** to release escrow for LTC trades.", "type": "string"}, "cancel_signature": {"title": "Cancel signature", "description": "This is **only required** to cancel escrow for LTC trades.", "type": "string"}, "cancel_psbt_base64": {"title": "Cancel psbt base64", "description": "This is **only required** to cancel escrow for LTC trades.", "type": "string"}, "signed_as_multi": {"title": "Signed as multi", "description": "This is **only required** to release escrow for substrate while\n        moving the trade into PUBLISHING_SELLER_RELEASE.", "type": "string", "minLength": 1}, "signed_dispute_payload": {"title": "Signed dispute payload", "description": "This is **only required** to resolve dispute for substrate trades.", "type": "string", "minLength": 1}, "btc_trade_secrets": {"$ref": "#/definitions/BtcNcTradeSecret"}, "seller_secret": {"title": "Seller secret", "description": "This is **only required** to mark non-custodial BTC trades\n        as FUND_RECEIVED by the seller.", "type": "string", "minLength": 1}, "cancellation_secret": {"title": "Cancellation secret", "description": "This is only required to cancel BTC trades that have escrowed", "type": "string", "minLength": 1}, "cancellation_signature": {"$ref": "#/definitions/SignedRelaySignature"}, "signed_cancel_payload": {"title": "Signed cancel payload", "description": "This is **only required** to cancel for substrate trades that\n        have escrowed.", "type": "string", "minLength": 1}, "cancellation_reason": {"title": "Cancellation reason", "type": "string", "enum": ["CREATE_ANOTHER_TRADE_WITH_USER", "MARKET_PRICE_CHANGED", "OTHER_USER_SLOW", "USER_NOT_AVAILABLE", "CUSTODIAL_NC_CONFUSION", "OTHER_USER_CHANGED_TERMS", "COULDNT_MEET_TERMS", "PAYMENT_METHOD_ISSUE", "LCS_WEBSITE_ISSUE", "COMPLETED_TRADE_ELSEWHERE", "OTHER_USER_SUSPICIOUS", "OPENED_TRADE_BY_MISTAKE", "OTHER"], "x-nullable": true}}}, "ProfileSerializerForTradeRetrieve": {"title": "Contract responder", "required": ["username"], "type": "object", "properties": {"username": {"title": "Username", "description": "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.", "type": "string", "pattern": "^[\\w.@+-]+$", "maxLength": 150, "minLength": 1}, "activity_status": {"title": "Activity status", "type": "string", "readOnly": true}, "activity_tooltip": {"title": "Activity tooltip", "type": "string", "readOnly": true}, "is_email_verified": {"title": "Is email verified", "type": "string", "readOnly": true}, "is_phone_verified": {"title": "Is phone verified", "type": "string", "readOnly": true}, "avg_response_time": {"title": "Average response time", "description": "Average response time of user to reject or accept the contract", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "completed_trades": {"title": "Completed trades on our platform", "type": "integer", "maximum": 2147483647, "minimum": 0}, "platform_volume": {"title": "Platform volume", "type": "string", "readOnly": true}, "feedback_score": {"title": "Avg rating out of 5", "type": "string", "format": "decimal", "x-nullable": true}, "last_seen": {"title": "Last seen", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "is_legacy": {"title": "Pro Trader Badge", "type": "boolean"}, "user_uuid": {"title": "User uuid", "type": "string", "format": "uuid"}, "hide_from_google": {"title": "Hide from google", "type": "boolean"}, "date_joined": {"title": "Date joined", "type": "string", "format": "date-time"}}}, "BtcEscrowMeta": {"title": "Btc escrow data", "required": ["escrow_address", "fee_address"], "type": "object", "properties": {"escrow_address": {"title": "Escrow address", "type": "string", "maxLength": 256, "minLength": 1}, "fee_address": {"title": "Fee address", "type": "string", "maxLength": 256, "minLength": 1}, "escrow_tx": {"title": "Escrow tx", "type": "string", "maxLength": 256, "x-nullable": true}}}, "EthEscrowMeta": {"title": "Eth escrow data", "type": "object", "properties": {"approve_tx": {"title": "Approve tx", "type": "string", "maxLength": 256, "x-nullable": true}, "escrow_tx": {"title": "Escrow tx", "type": "string", "maxLength": 256, "x-nullable": true}, "release_tx": {"title": "Release tx", "type": "string", "maxLength": 256, "x-nullable": true}, "dispute_tx": {"title": "Dispute tx", "type": "string", "maxLength": 256, "x-nullable": true}, "cancel_tx": {"title": "Cancel tx", "type": "string", "maxLength": 256, "x-nullable": true}}}, "MultiSigEscrowMeta": {"title": "Multisig escrow data", "required": ["escrow_address"], "type": "object", "properties": {"escrow_address": {"title": "Escrow address", "type": "string", "maxLength": 256, "minLength": 1}, "fee_address": {"title": "Fee address", "type": "string", "maxLength": 256, "x-nullable": true}, "escrow_tx": {"title": "Escrow tx", "type": "string", "maxLength": 256, "x-nullable": true}, "release_tx": {"title": "Release tx", "type": "string", "maxLength": 256, "x-nullable": true}, "dispute_tx": {"title": "Dispute tx", "type": "string", "maxLength": 256, "x-nullable": true}, "cancel_tx": {"title": "Cancel tx", "type": "string", "maxLength": 256, "x-nullable": true}}}, "TradeRead": {"required": ["status_meta", "fiat_amount", "coin_amount", "responder_geo", "tx_meta", "buyer_meta", "seller_meta", "amount_to_escrow", "fees", "btc_escrow_data", "eth_escrow_data", "multisig_escrow_data"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "ad": {"title": "Ad", "type": "object", "readOnly": true}, "status": {"title": "Status", "type": "string", "enum": ["CREATED", "ACCEPTED", "REJECTED", "WAITING_FOR_ESCROW", "BROADCASTING_ESCROW", "BROADCASTING_ESCROW_FAILED", "WAITING_FOR_MIN_ESCROW_CONFIRMS", "CRYPTO_ESC", "CRYPTO_ESC_FAILED", "FUND_PAID", "FUND_RECEIVED", "COMPLETED", "EXPIRED", "DISPUTED", "DISPUTE_RESOLVE_BUYER", "DISPUTE_RESOLVE_SELLER", "CANCELLATION_REQUESTED", "CANCELLED", "CANCELLATION_REJECTED", "BROADCASTING_RELEASE", "BROADCASTING_RELEASE_FAILED", "WAITING_FOR_CRYPTO_RELEASE_CONFIRMS", "CRYPTO_REL", "CRYPTO_REL_FAILED", "PUBLISHING_SELLER_ESCROW", "ARB_PUBLISHING_RELEASE_TX", "ARB_RELEASE_FAILED", "WAITING_SELLER_RELEASE", "PUBLISHING_SELLER_RELEASE", "SELLER_RELEASE_FAILED", "ARB_PUBLISHING_CANCEL_TXS", "ARB_CANCEL_FAILED", "WAITING_SELLER_CANCEL", "PUBLISHING_SELLER_CANCEL", "SELLER_CANCEL_FAILED", "ARB_PUBLISHING_DISPUTE_TXS", "ARB_DISPUTE_FAILED", "WAITING_DISPUTE_BUYER", "WAITING_DISPUTE_SELLER", "PUBLISHING_BUYER_DISPUTE", "PUBLISHING_SELLER_DISPUTE", "SELLER_DISPUTE_FAILED", "BUYER_DISPUTE_FAILED", "WAITING_FOR_MIN_APPROVE_CONFIRMS", "TRANSFER_APPROVED", "TRANSFER_APPROVAL_FAILED", "WAITING_FOR_TRANSFER_APPROVE"]}, "status_meta": {"title": "Status meta", "type": "object"}, "uuid": {"title": "Uuid", "type": "string", "format": "uuid"}, "contract_responder": {"$ref": "#/definitions/ProfileSerializerForTradeRetrieve"}, "buyer": {"$ref": "#/definitions/ProfileSerializerForTradeRetrieve"}, "seller": {"$ref": "#/definitions/ProfileSerializerForTradeRetrieve"}, "disputed_by": {"$ref": "#/definitions/ProfileSlug"}, "fiat_amount": {"title": "Fiat amount", "type": "string", "format": "decimal"}, "coin_amount": {"title": "Coin amount", "type": "string", "format": "decimal"}, "time_of_expiry": {"title": "Expiry time", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "time_created": {"title": "Created time", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "coin_currency": {"required": ["title", "symbol"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "title": {"title": "Title", "type": "string", "maxLength": 64, "minLength": 1}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 50}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 16, "minLength": 1}, "symbol_filename": {"title": "Symbol filename", "type": "string", "maxLength": 16, "x-nullable": true}, "is_crypto": {"title": "Is crypto", "type": "boolean"}, "withdraw_fee": {"title": "Withdraw fee", "type": "string", "format": "decimal", "x-nullable": true}, "minimum_withdrawal": {"title": "Minimum withdrawal", "type": "string", "format": "decimal", "x-nullable": true}, "multiplier": {"title": "Multiplier", "type": "string", "format": "decimal", "x-nullable": true}, "gas_limit": {"title": "Gas limit", "description": "Put a limit on gas used for the transaction.\n        This may not make sense for all currencies.", "type": "integer", "maximum": 9223372036854775807, "minimum": -9223372036854775808, "x-nullable": true}, "priority": {"title": "Ordering priority", "description": "Priority of ordering currency", "type": "integer", "maximum": 32767, "minimum": -32768}, "chain": {"title": "Chain", "type": "string", "maxLength": 16, "x-nullable": true}, "token_standard": {"title": "Token standard", "type": "string", "maxLength": 16, "x-nullable": true}, "country_code": {"title": "Country code", "description": "Country code of currency", "type": "string", "maxLength": 5, "x-nullable": true}, "active_status": {"title": "Currency status", "type": "string", "enum": ["currency_active", "currency_offers_only", "currency_staff_only", "currency_paused", "currency_delisted"], "x-nullable": true}, "metadata": {"title": "Metadata", "type": "integer", "x-nullable": true}}, "readOnly": true}, "fiat_currency": {"required": ["title", "symbol"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "title": {"title": "Title", "type": "string", "maxLength": 64, "minLength": 1}, "slug": {"title": "Slug", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$", "maxLength": 50}, "symbol": {"title": "Symbol", "type": "string", "maxLength": 16, "minLength": 1}, "symbol_filename": {"title": "Symbol filename", "type": "string", "maxLength": 16, "x-nullable": true}, "is_crypto": {"title": "Is crypto", "type": "boolean"}, "withdraw_fee": {"title": "Withdraw fee", "type": "string", "format": "decimal", "x-nullable": true}, "minimum_withdrawal": {"title": "Minimum withdrawal", "type": "string", "format": "decimal", "x-nullable": true}, "multiplier": {"title": "Multiplier", "type": "string", "format": "decimal", "x-nullable": true}, "gas_limit": {"title": "Gas limit", "description": "Put a limit on gas used for the transaction.\n        This may not make sense for all currencies.", "type": "integer", "maximum": 9223372036854775807, "minimum": -9223372036854775808, "x-nullable": true}, "priority": {"title": "Ordering priority", "description": "Priority of ordering currency", "type": "integer", "maximum": 32767, "minimum": -32768}, "chain": {"title": "Chain", "type": "string", "maxLength": 16, "x-nullable": true}, "token_standard": {"title": "Token standard", "type": "string", "maxLength": 16, "x-nullable": true}, "country_code": {"title": "Country code", "description": "Country code of currency", "type": "string", "maxLength": 5, "x-nullable": true}, "active_status": {"title": "Currency status", "type": "string", "enum": ["currency_active", "currency_offers_only", "currency_staff_only", "currency_paused", "currency_delisted"], "x-nullable": true}, "metadata": {"title": "Metadata", "type": "integer", "x-nullable": true}}, "readOnly": true}, "crypto_in_usd": {"title": "Crypto value in USD", "description": "Value of crypto in USD at the time of trade creation.", "type": "string", "format": "decimal"}, "responder_geo": {"title": "Responder geo", "type": "object"}, "tx_meta": {"title": "Tx meta", "type": "object"}, "buyer_meta": {"title": "Buyer meta", "type": "object"}, "seller_meta": {"title": "Seller meta", "type": "object"}, "non_custodial": {"title": "Non custodial", "type": "boolean"}, "amount_to_escrow": {"title": "Amount to escrow", "type": "string", "format": "decimal"}, "fees": {"title": "Fees", "type": "string", "format": "decimal"}, "btc_escrow_data": {"$ref": "#/definitions/BtcEscrowMeta"}, "eth_escrow_data": {"$ref": "#/definitions/EthEscrowMeta"}, "multisig_escrow_data": {"$ref": "#/definitions/MultiSigEscrowMeta"}}}, "BtcTxHistory": {"required": ["txtype", "ref_data"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "tx": {"title": "Tx", "type": "string", "maxLength": 256, "minLength": 1, "x-nullable": true}, "txtype": {"title": "Txtype", "type": "string", "enum": ["ESCROW", "ESCROW_RELEASE", "ESCROW_FEE", "ESCROW_REFUND", "WITHDRAW", "DEPOSIT"]}, "value": {"title": "Value", "type": "integer", "maximum": 9223372036854775807, "minimum": -9223372036854775808, "x-nullable": true}, "is_confirmed": {"title": "Is confirmed", "type": "boolean"}, "first_seen_at": {"title": "First seen at", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "confirmed_at": {"title": "Confirmed at", "type": "integer", "maximum": 2147483647, "minimum": 0, "x-nullable": true}, "ref_data": {"title": "Ref data", "type": "object"}}}, "AllowanceReset": {"required": ["currency", "from_address"], "type": "object", "properties": {"currency": {"title": "Currency", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "from_address": {"title": "From address", "type": "string", "maxLength": 256, "minLength": 1}}}, "TrxSignedTx": {"required": ["signed_tx"], "type": "object", "properties": {"signed_tx": {"title": "Signed tx", "type": "object"}}}, "Withdraw": {"required": ["otp", "currency", "amount"], "type": "object", "properties": {"id": {"title": "ID", "type": "integer", "readOnly": true}, "otp": {"title": "Otp", "type": "string", "maxLength": 6, "minLength": 6}, "currency": {"title": "Currency", "description": "Currency id", "type": "integer"}, "to_chip": {"title": "To chip", "description": "to_chip is `payment_id` in case of Monero and in case of Ripple", "type": "string", "maxLength": 256, "x-nullable": true}, "to_address": {"title": "To address", "type": "string", "maxLength": 256, "x-nullable": true}, "amount": {"title": "Amount", "type": "string", "format": "decimal"}, "fee": {"title": "Fee", "type": "integer", "readOnly": true}, "is_confirmed": {"title": "Is confirmed", "type": "boolean", "readOnly": true}, "is_validated": {"title": "Is validated", "type": "boolean", "readOnly": true}, "is_reverted": {"title": "Is reverted", "type": "boolean", "readOnly": true}, "payment_id": {"title": "Payment id", "description": "Payment id of withdrawal of ripple and monero", "type": "string", "maxLength": 100, "x-nullable": true}, "withdrawal_tx_hash": {"title": "Withdrawal transaciton hash", "type": "string", "maxLength": 300, "x-nullable": true}}}, "SendSigned": {"required": ["currency"], "type": "object", "properties": {"currency": {"title": "Currency", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "signature": {"title": "Signature", "description": "Signed blockchain transaction", "type": "string", "minLength": 1}, "from_address": {"title": "From address", "type": "string", "minLength": 1}, "to_address": {"title": "To address", "type": "string", "minLength": 1}, "amount": {"title": "Amount", "type": "string", "minLength": 1}, "nonce": {"title": "Nonce", "type": "integer"}, "signed_tx": {"title": "Signed tx", "type": "string", "minLength": 1}}}, "RequestWithdrawalOtp": {"type": "object", "properties": {"user_id": {"title": "User id", "type": "string", "readOnly": true}}}, "CreateUnsigned": {"required": ["currency", "amount", "from_address", "to_address"], "type": "object", "properties": {"currency": {"title": "Currency", "type": "string", "format": "slug", "pattern": "^[-a-zA-Z0-9_]+$"}, "amount": {"title": "Amount", "type": "string", "format": "decimal"}, "from_address": {"title": "From address", "type": "string", "maxLength": 256, "minLength": 1}, "to_address": {"title": "To address", "type": "string", "maxLength": 256, "minLength": 1}, "swap_uuid": {"title": "Swap uuid", "type": "string", "format": "uuid"}, "gas_price": {"title": "Gas price", "description": "Gas price in wei. Only for transactions on the ethereum blockchain", "type": "string", "format": "decimal"}, "gas_limit": {"title": "Gas limit", "description": "Only for transactions on the ethereum blockchain", "type": "string", "format": "decimal"}}}, "YearInReview2022": {"type": "object", "properties": {"trades_count": {"title": "Trades count", "type": "integer", "maximum": 2147483647, "minimum": 0}, "trades_volume": {"title": "Trades volume", "type": "integer", "maximum": 2147483647, "minimum": 0}, "users_traded_with": {"title": "Users traded with", "type": "integer", "maximum": 2147483647, "minimum": 0}, "most_traded_user": {"title": "Most traded user", "type": "string", "maxLength": 64, "x-nullable": true}, "fav_crypto": {"title": "Fav crypto", "type": "string", "maxLength": 16, "x-nullable": true}, "fav_crypto_amount": {"title": "Fav crypto amount", "type": "string", "format": "decimal"}}}}, "tags": [{"name": "currencies", "description": "", "x-displayName": "Currencies"}, {"name": "wallets", "description": "", "x-displayName": "Wallets"}, {"name": "offers", "description": "\nOffers are listed on LocalCoinSwap listings for other traders to respond to.\n\n#### Following operations are possible using Offers:\n\n    - Create\n    - Edit\n    - Delete\n    - Read\n    - Search\n", "x-displayName": "Offers"}, {"name": "profile", "description": "", "x-displayName": "Profiles"}, {"name": "trades", "description": "", "x-displayName": "Trades"}, {"name": "notifs", "description": "", "x-displayName": "Notifications"}], "x-tagGroups": [{"name": "API Endpoints", "tags": ["currencies", "wallets", "offers", "profile", "trades", "notifs"]}]}
