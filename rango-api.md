API Key
To use our API endpoints, you should request an API key, describing your dApp, the blockchains you like to connect to, and your dApp domain if it's a website to enable CORS headers for your API key. You should attach your API key to all your request as:

Copy
curl 'https://api.rango.exchange/path/to/resource?apiKey=<YOUR-API-KEY>'

Rango Exchange SDK
Multiple-SDK Reference
Main SDK (Multi Step Tx)
npm version license

Installation
  yarn add rango-sdk
  # or
  npm install rango-sdk --save
Usage
Main-SDK Reference
Examples
EVM Example
Solana Example
Tron Example
Starknet Example

Get Blockchains & Tokens
Get all blockchains, tokens and swappers meta data

Get Full Metadata API
This service gathers all the essential data needed for a swap's UI, including list of all blockchains, tokens and protocols (DEXes & Bridges) metadata.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
// basic usage
const meta = await rango.getAllMetadata()
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
// filtering blockchains, swappers and tokens
const meta = await rango.getAllMetadata({
    blockchains: ['ETH', 'POLYGON'],
    blockchainsExclude: false,
    swappers: ['Across', 'OneInchEth'],
    swappersExclude: false,
    swappersGroups: ['Across', '1Inch'],
    swappersGroupsExclude: false,
    transactionTypes: ['EVM'],
    transactionTypesExclude: false,
    excludeNonPopulars: false
})
Logo
Metadata (tokens, swappers, blockchains)
rango-exchange
GET Metadata Swagger
Why is it required to obtain the list of supported tokens from Rango API?

Even if dApp has its own list of tokens and blockchains, it's still useful to get list of supported tokens by Rango:

To avoid extra API call when token is not supported by Rango

Access tokens' symbol which is required for getting quote for each token.

Why is it recommended to obtain the list of supported blockchains from Rango API?

For working with other API methods like getBestRoute, you need to have identifier  (name) of each blockchain. You could hard code blockchain names if you want to have limited chains support or get them dynamically via the API. (You could store a map of each blockchain chainId to Rango name if required.) 

Because of different reasons like blockchains maintenance, Rango maintenance, hacks, and etc, a blockchain could be disabled in Rango. You could check which blockchains are enabled now using enabled flag for each blockchain in meta response. 

Metadata Request 
API Definition
SDK Models (Typescript)
blockchains String

Description: Pass comma separated list of blockchains if you want to filter meta blockchains to some specific ones.

Example: POLYGON,ETH

blockchainsExclude Boolean

Description: A boolean value indicating whether the specified blockchains should be excluded or included in the response.

Example: true

swappers String

Description: Pass comma separated list of swappers if you want to filter meta swappers to some specific ones.

Example: Across,OneInchEth

swappersExclude Boolean

Description: A boolean value indicating whether the specified swappers should be excluded or included in the response.

Example: false

swappersGroups String

Description: Pass comma separated list of swapper groups if you want to filter meta swapper groups to some specific ones.

Example: Across,1Inch

swappersGroupsExclude Boolean

Description: A boolean value indicating whether the specified swapper groups should be excluded or included in the response.

Example: false

transactionTypes String

Description: Pass comma separated list of transaction types if you want to filter blockchains types to some specific ones.

Example: EVM,COSMOS

transactionTypesExclude Boolean

Description: A boolean value indicating whether the specified transaction types should be excluded or included in the response.

Example: false

excludeSecondaries Boolean

Description: It indicates whether secondary tokens should be excluded from the response. By secondary tokens, we mean tokens that are imported from our secondary tokens lists.

Example: false

excludeNonPopulars Boolean

Description: It indicates whether non-popular tokens should be excluded from the response. By popular tokens, we mean native token and stable coins of each blockchain.

Example: false

ignoreSupportedSwappers Boolean

Description: Set this flag to false to exclude the supported swappers for each token from the response. The default value is true.

Example: false

enableCentralizedSwappers Boolean

Description: Set this flag to true if you want to enable routing through the centralized solutions and obtain the associated metadata, including related swappers and tokens. The default value for this argument is false.

Example: true

Metadata Response 
API Definition
SDK Models (Typescript)
Sample Response
blockchains

Description: List of all supported blockchains

tokens

Description: List of all tokens

popularTokens

Description: List of all popular tokens

swappers

Description: List of all supported protocols (DEXes & Bridges)

Get Specific Part of Metadata
If you only want to load a specific part of metadata rather than full metadata, i.e. only blockchains data, tokens list or supported protocols, you can use the following methods/endpoints:

Get List of Blockchains API
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const meta = await rango.getBlockchains()
Logo
Blockchains Metadata
rango-exchange
GET Blockchains Swagger
Get List of Swappers API
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const meta = await rango.getSwappers()
Logo

Get Blockchains & Tokens
Get all blockchains, tokens and swappers meta data

Get Full Metadata API
This service gathers all the essential data needed for a swap's UI, including list of all blockchains, tokens and protocols (DEXes & Bridges) metadata.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
// basic usage
const meta = await rango.getAllMetadata()
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
// filtering blockchains, swappers and tokens
const meta = await rango.getAllMetadata({
    blockchains: ['ETH', 'POLYGON'],
    blockchainsExclude: false,
    swappers: ['Across', 'OneInchEth'],
    swappersExclude: false,
    swappersGroups: ['Across', '1Inch'],
    swappersGroupsExclude: false,
    transactionTypes: ['EVM'],
    transactionTypesExclude: false,
    excludeNonPopulars: false
})
Logo
Metadata (tokens, swappers, blockchains)
rango-exchange
GET Metadata Swagger
Why is it required to obtain the list of supported tokens from Rango API?

Even if dApp has its own list of tokens and blockchains, it's still useful to get list of supported tokens by Rango:

To avoid extra API call when token is not supported by Rango

Access tokens' symbol which is required for getting quote for each token.

Why is it recommended to obtain the list of supported blockchains from Rango API?

For working with other API methods like getBestRoute, you need to have identifier  (name) of each blockchain. You could hard code blockchain names if you want to have limited chains support or get them dynamically via the API. (You could store a map of each blockchain chainId to Rango name if required.) 

Because of different reasons like blockchains maintenance, Rango maintenance, hacks, and etc, a blockchain could be disabled in Rango. You could check which blockchains are enabled now using enabled flag for each blockchain in meta response. 

Metadata Request 
API Definition
SDK Models (Typescript)
blockchains String

Description: Pass comma separated list of blockchains if you want to filter meta blockchains to some specific ones.

Example: POLYGON,ETH

blockchainsExclude Boolean

Description: A boolean value indicating whether the specified blockchains should be excluded or included in the response.

Example: true

swappers String

Description: Pass comma separated list of swappers if you want to filter meta swappers to some specific ones.

Example: Across,OneInchEth

swappersExclude Boolean

Description: A boolean value indicating whether the specified swappers should be excluded or included in the response.

Example: false

swappersGroups String

Description: Pass comma separated list of swapper groups if you want to filter meta swapper groups to some specific ones.

Example: Across,1Inch

swappersGroupsExclude Boolean

Description: A boolean value indicating whether the specified swapper groups should be excluded or included in the response.

Example: false

transactionTypes String

Description: Pass comma separated list of transaction types if you want to filter blockchains types to some specific ones.

Example: EVM,COSMOS

transactionTypesExclude Boolean

Description: A boolean value indicating whether the specified transaction types should be excluded or included in the response.

Example: false

excludeSecondaries Boolean

Description: It indicates whether secondary tokens should be excluded from the response. By secondary tokens, we mean tokens that are imported from our secondary tokens lists.

Example: false

excludeNonPopulars Boolean

Description: It indicates whether non-popular tokens should be excluded from the response. By popular tokens, we mean native token and stable coins of each blockchain.

Example: false

ignoreSupportedSwappers Boolean

Description: Set this flag to false to exclude the supported swappers for each token from the response. The default value is true.

Example: false

enableCentralizedSwappers Boolean

Description: Set this flag to true if you want to enable routing through the centralized solutions and obtain the associated metadata, including related swappers and tokens. The default value for this argument is false.

Example: true

Metadata Response 
API Definition
SDK Models (Typescript)
Sample Response
blockchains

Description: List of all supported blockchains

tokens

Description: List of all tokens

popularTokens

Description: List of all popular tokens

swappers

Description: List of all supported protocols (DEXes & Bridges)

Get Specific Part of Metadata
If you only want to load a specific part of metadata rather than full metadata, i.e. only blockchains data, tokens list or supported protocols, you can use the following methods/endpoints:

Get List of Blockchains API
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const meta = await rango.getBlockchains()
Logo
Blockchains Metadata
rango-exchange
GET Blockchains Swagger
Get List of Swappers API
Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const meta = await rango.getSwappers()
Logo

Get Best Route
Get the best route for swapping X to Y

Get Best Route API
It goes through all the possible swappers to find the best possible route based on user experience, fee amount, and output of the swap.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const bestRoute = await rango.getBestRoute({
    from: {"blockchain": "BSC", "symbol": "BNB", "address": null},
    to: {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"},    
    amount: "1",
    checkPrerequisites: false,
    slippage: "1.0",
    selectedWallets: {
        "AVAX_CCHAIN": "0xeae6d42093eae057e770010ffd6f4445f7956613",
        "BSC": "0xeae6d42093eae057e770010ffd6f4445f7956613",
    },
})
Logo
Get The Best Route
rango-exchange
Get The Best Route Swagger
You need to pass checkPrerequisites value equals to true when user confirms the route.

When user confirms the route and you want to go to the next step (creating transaction), it's required to pass checkPrerequisites value equals to true. Otherwise, Rango won't create the transaction for you.

But it is recommended to set checkPrerequisites to false when you want to just give the user the best route preview.

How to filter blockchains and swappers of the route?

These parameters are used to limit blockchains of your interest, swappers, types of transactions, complexity of implementation, etc:

swappers, swappersExclude

swapperGroups, swapperGroupsExclude

blockchains, blockchainsExclude

transactionTypes


Example 1. Imagine that you are developing a dApp which only supports EVM and Solana. You could pass the transactionTypes equals to ['EVM', 'SOLANA'].

Example 2. Imagine that you want to only support some specific bridges and dexes in your dApp. you could simply pass the swapperGroups equals to list of those swappers. e.g. you could pass ['Hyphen', 'Synapse Swapper', '1Inch', 'UniSwap'].

Example 3. In multi-step routing, the optimal route may not always be a single step, and intermediary blockchains are chosen based on the best price for the route. By using blockchain parameters, you can control which blockchains are involved in the route. e.g. you could pass blockchains equals to ['ETH',  'BSC', 'ARBITRUM', 'POLYGON']. 

Best Route Request 
API Definition
SDK Models (Typescript)
from *  Asset

Description: The source asset

Example: {"blockchain": "BSC", "symbol": "BNB", "address": null}

to *  Asset

Description: The destination asset

Example:  {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"}

amount * String

Description: The human-readable amount of asset from that is going to be swapped.

Example: 0.28

selectedWallets * 

Description: The list of wallets chosen by the user for this swap. For a multi-step swap, we need the wallet address for each blockchain involved in the route. (Mapping of blockchain to wallet address)

Example: { "AVAX_CCHAIN": "0xeae6d42093eae057e770010ffd6f4445f7956613", "BSC": "0xeae6d42093eae057e770010ffd6f4445f7956613" }

checkPrerequisites  Boolean

Description: It should be set to false when the client only wants to show a route preview to the user, and true when the user has confirmed the swap. If set to true, the server response time will be slower as it will verify certain prerequisites, such as the balance of source token and the necessary fees in the user's wallet.

Default: false

destination String

Description: Custom destination wallet address for the route.

connectedWallets

Description: Optional list of all connected wallets of user in all blockchains. 

slippage number

Description: Amount of user's preferred slippage in percent. if you don't send it, it will assume 0.5% slippage. (It's used to filter the swappers or routes that are not suitable for the given slippage)

contractCall Boolean

Description: set this parameter to true if you want to send transactions through a contract. It will filter swappers that are not possible to be called by another contract.

Caution: if you call Rango contracts using your contract and your contract is not white listed in some underlying protocols like Thorchain, user fund may stuck forever in Thorchain contracts. In this case, you need to exclude these swappers using this flag or ask related protocols to white list your contract.

Example: true

affiliateRef String

Description: The affiliate unique key. In the Rango Exchange App, an affiliate key is generated using a wallet address, and this same wallet address is used to receive the fee charged by the dApp for the request.

Example: K3ldk3

affiliatePercent String

Description: The dApp transaction fee in percent. Rango allows affiliate percent up to maximum of 3.0 percent. 

Example: 1.5 which means 1.5 percent of the input amount 

affiliateWallets

Description: List of affiliate wallets per blockchain for referral rewards. If this parameter is not provided, the wallet used for generating the affiliateRef will be used. By passing this parameter, you can override the wallet address used for the dApp transaction fee for each blockchain. 

maxLength Number

Description: Maximum number of steps allowed in best route response. You could pass this parameter equals to 1 if you are interested in single step routes which is similar to the Basic API.

Example: 2

disableMultiStepTx Boolean

Description: Some bridges requires more than one transaction for each swap. For example, some bridges require transaction on both source and destination blockchains by the users. Using this flag, you could enable routing via these protocols. Default is true.

Note: At the moment, only Voyager bridge subjects to this condition. 

Default: true

blockchains String

Description: Pass comma separated list of blockchains if you want to filter meta blockchains to some specific ones.

Example: POLYGON,ETH

blockchainsExclude Boolean

Description: A boolean value indicating whether the specified blockchains should be excluded or included in the response.

Example: true

swappers String

Description: Pass comma separated list of swappers if you want to filter meta swappers to some specific ones.

Example: Across,OneInchEth

swappersExclude Boolean

Description: A boolean value indicating whether the specified swappers should be excluded or included in the response.

Example: false

swappersGroups String

Description: Pass comma separated list of swapper groups if you want to filter meta swapper groups to some specific ones.

Example: Across,1Inch

swappersGroupsExclude Boolean

Description: A boolean value indicating whether the specified swapper groups should be excluded or included in the response.

Example: false

transactionTypes String

Description: Pass comma separated list of transaction types if you want to filter blockchains types to some specific ones.

Example: EVM,COSMOS

transactionTypesExclude Boolean

Description: A boolean value indicating whether the specified transaction types should be excluded or included in the response.

Example: false

enableCentralizedSwappers Boolean

Description: Set this flag to true if you want to enable routing through the centralized solutions and obtain the associated metadata, including related swappers and tokens. The default value for this argument is false.

Caution: To enable these swappers, you must pass the user's IP to the Rango API for compliance checks. Additionally, user funds may be held for KYC if their wallet is flagged as risky by the screening solutions implemented by these protocols.

Default: false

avoidNativeFeeBoolean

Description: When this condition is true, swappers that charge fees in native tokens will be excluded. For instance, when called from an AA account.
Swappers like Stargate charge user fees in native tokens instead of the input amount, causing the transaction value to differ from the user's input amount. Alternatively, the user may need to transfer native tokens in a contract call to cover these protocol fees. Although you can disable these protocols using this flag, we do not recommend it as it reduces the coverage of routes.

Default: false

interChainMessage

Description: Info about inter-chain message (Source & Destination contracts and IM Message) for cross-chain messaging.

messagingProtocols

Description: List of messaging protocols to be used for passing interchain messages.

Best Route Response 
API Definition
SDK Models (Typescript)
Sample Response
requestId

Description: The unique request Id which is generated for this request by the server. It should be passed down to all other endpoints if this swap continues on. e.g. d10657ce-b13a-405c-825b-b47f8a5016ad

requestAmount

Description: The human readable input amount from the request.

from

Description: The source asset.

to

Description: The destination asset.

result

Description: The best route data.

 validationStatus

Description: Prerequisites (validation) check result. It will be null if the checkPrerequisites field was false (or not given) in the request.

diagnosisMessages

Description: A list of string messages that might be the cause of not finding the route. It's just for display purposes.

missingBlockchains

Description: List of all blockchains which are necessary to be present for the best route and the user has not provided any connected wallets for it. A null or empty list indicates that there is no problem.

blockchains

Description: List of all accepted blockchains, an empty list means no filter is required.

processingLimitReached

Description: A warning indicates that it took too much time to find the best route and the server could not find any routes from X to Y.

walletNotSupportingFromBlockchain

Description: A warning indicating that none of your wallets have the same blockchain as X asset.

error

Description: Error occurred during the operation.

errorCode

Description: Error code shows the type of error.

traceId

Description: Trace Id helps Rango support team to trace an issue.

Get All Possible Routes
Get all possible routes for swapping X to Y

Get Best Routes API
It goes through all the possible swappers to find a list of best possible routes for swapping X to Y.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const bestRoutes = await rango.getAllRoutes({
    from: {"blockchain": "BSC", "symbol": "BNB", "address": null},
    to: {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"},    
    amount: "1",
    slippage: "1.0"
})
Logo
Get Best Routes
rango-exchange
Get All Routes Swagger
Confirm User Selected Route 

When user confirms one of the routes and you want to go to the next step (creating transaction), it's required to call the confirm route with the relevant route request Id. Otherwise, Rango won't create the transaction for you.

How to filter blockchains and swappers of the route?

These parameters are used to limit blockchains of your interest, swappers, types of transactions, complexity of implementation, etc:

swappers, swappersExclude

swapperGroups, swapperGroupsExclude

blockchains, blockchainsExclude

transactionTypes


Example 1. Imagine that you are developing a dApp which only supports EVM and Solana. You could pass the transactionTypes equals to ['EVM', 'SOLANA'].

Example 2. Imagine that you want to only support some specific bridges and dexes in your dApp. you could simply pass the swapperGroups equals to list of those swappers. e.g. you could pass ['Hyphen', 'Synapse Swapper', '1Inch', 'UniSwap'].

Example 3. In multi-step routing, the optimal route may not always be a single step, and intermediary blockchains are chosen based on the best price for the route. By using blockchain parameters, you can control which blockchains are involved in the route. e.g. you could pass blockchains equals to ['ETH',  'BSC', 'ARBITRUM', 'POLYGON']. 

Best Routes Request 
API Definition
SDK Models (Typescript)
from *  Asset

Description: The source asset

Example: {"blockchain": "BSC", "symbol": "BNB", "address": null}

to *  Asset

Description: The destination asset

Example:  {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"}

amount * String

Description: The human-readable amount of asset from that is going to be swapped.

Example: 0.28

connectedWallets

Description: Optional list of all connected wallets of user in all blockchains. 

slippage number

Description: Amount of user's preferred slippage in percent. if you don't send it, it will assume 0.5% slippage. (It's used to filter the swappers or routes that are not suitable for the given slippage)

contractCall Boolean

Description: set this parameter to true if you want to send transactions through a contract. It will filter swappers that are not possible to be called by another contract.

Caution: if you call Rango contracts using your contract and your contract is not white listed in some underlying protocols like Thorchain, user fund may stuck forever in Thorchain contracts. In this case, you need to exclude these swappers using this flag or ask related protocols to white list your contract.

Example: true

affiliateRef String

Description: The affiliate unique key. In the Rango Exchange App, an affiliate key is generated using a wallet address, and this same wallet address is used to receive the fee charged by the dApp for the request.

Example: K3ldk3

affiliatePercent String

Description: The dApp transaction fee in percent. Rango allows affiliate percent up to maximum of 3.0 percent. 

Example: 1.5 which means 1.5 percent of the input amount 

affiliateWallets

Description: List of affiliate wallets per blockchain for referral rewards. If this parameter is not provided, the wallet used for generating the affiliateRef will be used. By passing this parameter, you can override the wallet address used for the dApp transaction fee for each blockchain. 

disableMultiStepTx Boolean

Description: Some bridges requires more than one transaction for each swap. For example, some bridges require transaction on both source and destination blockchains by the users. Using this flag, you could enable routing via these protocols. Default is true.

Note: At the moment, only Voyager bridge subjects to this condition. 

Default: true

blockchains String

Description: Pass comma separated list of blockchains if you want to filter meta blockchains to some specific ones.

Example: POLYGON,ETH

blockchainsExclude Boolean

Description: A boolean value indicating whether the specified blockchains should be excluded or included in the response.

Example: true

swappers String

Description: Pass comma separated list of swappers if you want to filter meta swappers to some specific ones.

Example: Across,OneInchEth

swappersExclude Boolean

Description: A boolean value indicating whether the specified swappers should be excluded or included in the response.

Example: false

swappersGroups String

Description: Pass comma separated list of swapper groups if you want to filter meta swapper groups to some specific ones.

Example: Across,1Inch

swappersGroupsExclude Boolean

Description: A boolean value indicating whether the specified swapper groups should be excluded or included in the response.

Example: false

transactionTypes String

Description: Pass comma separated list of transaction types if you want to filter blockchains types to some specific ones.

Example: EVM,COSMOS

transactionTypesExclude Boolean

Description: A boolean value indicating whether the specified transaction types should be excluded or included in the response.

Example: false

enableCentralizedSwappers Boolean

Description: Set this flag to true if you want to enable routing through the centralized solutions and obtain the associated metadata, including related swappers and tokens. The default value for this argument is false.

Caution: To enable these swappers, you must pass the user's IP to the Rango API for compliance checks. Additionally, user funds may be held for KYC if their wallet is flagged as risky by the screening solutions implemented by these protocols.

Default: false

avoidNativeFeeBoolean

Description: When this condition is true, swappers that charge fees in native tokens will be excluded. For instance, when called from an AA account.
Swappers like Stargate charge user fees in native tokens instead of the input amount, causing the transaction value to differ from the user's input amount. Alternatively, the user may need to transfer native tokens in a contract call to cover these protocol fees. Although you can disable these protocols using this flag, we do not recommend it as it reduces the coverage of routes.

Default: false

interChainMessage

Description: Info about inter-chain message (Source & Destination contracts and IM Message) for cross-chain messaging.

messagingProtocols

Description: List of messaging protocols to be used for passing interchain messages.

Best Routes Response 
API Definition
SDK Models (Typescript)
Sample Response
routeId

The unique request Id which is generated for this request by the server.

Example: d10657ce-b13a-405c-825b-b47f8a5016ad

requestAmount

Description: The human readable input amount from the request.

from

Description: The source asset.

to

Description: The destination asset.

results

Description: list of of all possible routes.

diagnosisMessages

Description: A list of string messages that might be the cause of not finding the route. It's just for display purposes.

missingBlockchains

Description: List of all blockchains which are necessary to be present for the best route and the user has not provided any connected wallets for it. A null or empty list indicates that there is no problem.

blockchains

Description: List of all accepted blockchains, an empty list means no filter is required.

processingLimitReached

Description: A warning indicates that it took too much time to find the best route and the server could not find any routes from X to Y.

walletNotSupportingFromBlockchain

Description: A warning indicating that none of your wallets have the same blockchain as X asset.

error

Description: Error occurred during the operation.

errorCode

Description: Error code shows the type of error.

traceId

Description: Trace Id helps Rango support team to trace an issue.

Confirm Route
Confirm the desired route by the user and pass user's wallets for executing the route

Confirm Route API
After presenting the best route or all possible routes to the user, and once the user confirms the swap via one of the routes, you need to call this method using the user's selected wallets and the request ID of the chosen route. This will inform Rango that the user has confirmed this route and initiate the swap execution. You can also pass the destination field to set a custom destination for the final output, which can be different from the selected wallets.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const confimedRoute = await rango.confirmRoute({
    requestId: "33e0b996-da5e-4922-9fdc-f7206247fc34",
    selectedWallets: {
        "BSC": "0xeae6d42093eae057e770010ffd6f4445f7956613",
        "AVAX_CCHAIN": "0xeae6d42093eae057e770010ffd6f4445f7956613",
    },
    destination: "0x6f33bb1763eebead07cf8815a62fcd7b30311fa3",
})
Logo
Route Confirmation
rango-exchange
Route Confirmation Swagger
Confirm Route Request 
API Definition
SDK Models (Typescript)
requestId * String

Description: The unique ID for the selected route. (In the response of best route or best routes endpoints.)

selectedWallets *  Object

Description: The list of user's selected wallets for this swap. For a multi-step swap, we need to have wallet address of every blockchain in the route. (Blockchain to wallet address map)

destination String

Description: Custom wallet address destination for the final output of the route. (If you want to set a wallet address different than selected wallet addresses) 

Confirm Route Response 
API Definition
SDK Models (Typescript)
Sample Response
ok

Description: If true, route confirmation was successful and error message is null.

result

Description: The updated route.

error

Description: Error occurred during confirming the route.

errorCode

Description: Error code shows the type of error.

traceId

Description: Trace Id helps Rango support team to trace the issue.

Create Transaction
Create the transaction for current step

Create Transaction API
When a user starts swapping or when a step of swap succeeds, to get the transaction for the next step, this method should be called.

In multi-step routes, you should loop over the routeResponse.route array and call this method (createTransaction) per each step. 

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const transaction = await rango.createTransaction({
    requestId: "1978d8fa-335d-4915-a039-77f1a17315f5", // bestRoute.requestId
    step: 1,
    userSettings: {
        slippage: 3,
        infiniteApprove: false
    },
    validations: {
        balance: true,
        fee: true,
        approve: true
     },
})
Logo
Create TX
rango-exchange
Create Transaction Swagger
Create Transaction Request 
API Definition
SDK Models (Typescript)
requestId * String

Description: The unique ID which is generated in the best route endpoint.

step *  Number

Description: The current step number in a multi-step route, starting from 1.

Example: 1

userSettings * 

Description: User settings for the swap, including slippage and infinite approval.

validations *

Description: The validation checks we are interested to check by Rango before starting the swap.

Create Transaction Response
API Definition
SDK Models (Typescript)
Sample Response
ok

Description: If true, Rango has created a non-null transaction, and the error message is null.

transaction

Description: Transaction's raw data. It is one of the transaction possible interfaces: EvmTransaction, CosmosTransaction, TransferTransaction (for UTXO), SolanaTransaction, StarknetTransaction, TronTransaction or null. 

error

Description: Error message about the incident if ok == false.

errorCode

Description: Error code shows the type of error.

traceId

Description: Trace Id helps Rango support team to trace an issue.

Check Transaction Status
Track the status of the transaction for the current step

Check Status API
After the user signs a transaction in his wallet, you should periodically call this endpoint to check the status of the transaction.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const transaction = await rango.checkStatus({
    requestId: "b3a12c6d-86b8-4c21-97e4-809151dd4036", // bestRoute.requestId
    step: 1,
    txId: "0xfa88b705a5b4049adac7caff50c887d9600ef023ef1a937f8f8b6f44e90042b5"
})
Logo
Check TX Status
rango-exchange
Check Transaction Status Swagger
This endpoint is not suitable for checking approve transaction and it is only for the main  transaction. For checking approval transaction status, please check this section.

In on-chain transactions, you could also check transaction status by checking transaction receipt (via RPC) if you prefer. But in cross-chain swaps (e.g. bridges), you could use this method to make sure outbound transaction (transaction on destination chain) succeeds without any problem.

Check Transaction Status Request 
API Definition
SDK Models (Typescript)
requestId * String

Description: The unique ID which is generated in the best route endpoint.

Example: b3a12c6d-86b8-4c21-97e4-809151dd4036

step * Number

Description: The current step number in a multi-step route, starting from 1.

Example: 1

txId * String

Description: Transaction hash returned by wallet

Example: 0xfa88b705a5b4049adac7caff50c887d9600ef023ef1a937f8f8b6f44e90042b5

Check Transaction Status Response 
API Definition
SDK Models (Typescript)
Sample Response
status

Description: Status of the transaction, while the status is running or null, the client should retry until it turns into success or failed.

timestamp

Description: The timestamp of the executed transaction. Beware that timestamp can be null even if the status is successful or failed, e.g. 1690190660000

extraMessage

Description: A message in case of failure, that could be shown to the user.

outputAmount

Description: The human readable output amount for the transaction, e.g. 0.28.

outputToken

Description: The output token for this step.

newTx

Description: if a transaction needs more than one-step transaction to be signed by the user, the next step transaction will be returned in this field. 
It's only used for the Voyager bridge at the moment, and you could simply avoid swappers with this requirement by passing disableMultiStepTx equals to true in get best route method

diagnosisUrl

Description: In some special cases (e.g. Wormhole), the user should follow some steps outside Rango to get its assets back (to refund). You could show this link to the user to help him.
Sample value: https://rango.exchange/diagnosis/wormhole?iframe=1

explorerUrl

Description: List of explorer URLs for the transactions that happened in this step.

referrals

Description: List of referral reward for the dApp and Rango.

steps

Description: In certain special cases (specifically for the Wormhole Bridge), the user must sign multiple transactions for a step to be successful. In these instances, you can use the steps data to display the internal steps of a single swap to the user for informational purposes.

Check Approve Transaction Status
Check status of approve transaction

Check Approval Status API
When createTransaction returns an approval transaction (i.e. isApprovalfield is true in transaction), and the user signs that transaction, you could periodically call check-approval to see if the approval transaction is completed. After a successful check, you should call createTransaction again to receive the main transaction.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const transaction = await rango.checkApproval({
    requestId: "b3a12c6d-86b8-4c21-97e4-809151dd4036", // bestRoute.requestId
    txId: "0x7f17aaba51d1f24204cd8b02251001d3704add46d84840a5826b95ef49b8b74f" // optional
})
Logo
Check Approval TX Status
rango-exchange
Check Approve Transaction Status
For checking approval transaction status, you could check it directly from the RPC endpoint if you prefer and skip calling Rango API for this purpose.

Caution

It is important to use approve transaction data generated by Rango API and not hard-coding something on your client side for creating approve transaction, because for some protocols (some bridges), the contract that should be approved is dynamically generated via their API based on route.

You could stop checking approval method if:

Approval transaction succeeded. => isApproved === true

Approval transaction failed. => !isApproved && txStatus === 'failed'

Approval transaction succeeded but currentApprovedAmount is still less than requiredApprovedAmount (e.g. user changed transaction data in wallet and enter another approve amount in MetaMask instead of default approve amount proposed by Rango API) => !isApproved && txStatus === 'success'

Check Approval Request 
API Definition
SDK Models (Typescript)
requestId * 

Description: The unique ID which is generated in the best route endpoint.

Example: b3a12c6d-86b8-4c21-97e4-809151dd4036

txId

Description: Transaction hash returned by wallet

Example: 0x7f17aaba51d1f24204cd8b02251001d3704add46d84840a5826b95ef49b8b74f

Check Approval Response 
API Definition
SDK Models (Typescript)
Sample Response
isApproved

Description: A flag which indicates that the approve tx is done or not.

txStatus

Description: Status of approve transaction in blockchain (possible values are success, running and failed)

if isArppoved is false and txStatus is failed, it means that approve transaction is failed in the blockchain.

currentApprovedAmount

Description: Required amount to be approved by the user.

requiredApprovedAmount

Description: Current approved amount by the user.

Report Transaction Failure
Report failures on signing or sending the transaction

Report Failure API
Use it when the user rejects the transaction in the wallet or the wallet fails to handle the transaction. Calling this endpoint is not required, but is useful for reporting and we recommend calling it.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const transaction = await rango.reportFailure({
    requestId: "688b308e-a06b-4a4e-a837-220d458b8642", // bestRoute.requestId
    eventType: 'SEND_TX_FAILED',
    reason: "RPC Error"
})
Logo
Report Failed TX
rango-exchange
Report Failure Swagger
It's an optional action and does not affect the flow of swap, but it can help us improve our API if the data is informative enough

Report Failure Request 
API Definition
SDK Models (Typescript)
requestId * 

Description: The unique ID which is generated in the best route endpoint.

eventType * 

Description: Type of failure. possible values are:

FETCH_TX_FAILED, USER_REJECT, USER_CANCEL, CALL_WALLET_FAILED, SEND_TX_FAILED, CLIENT_UNEXPECTED_BEHAVIOUR, TX_EXPIRED, INSUFFICIENT_APPROVE 

reason

Description: Failure reason

tags

Description: An optional dictionary of pre-defined tags. Current allowed tags are wallet and errorCode.

Get Custom Token
Get metadata of a custom token

Custom Token API
Provides token details for a user-specified token that is not included in Rango's official list. Currently supports blockchains based on Solana and EVM.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const tokenResponse = await rango.getCustomToken({
    "blockchain": "SOLANA", 
    "address": "3yoMkf3X6bDxjks6YaWwNk4SAbuaysLg1a4BjQKToQAA"
})
Logo
Custom token
rango-exchange
Custom Token Swagger
Custom Token Request
API Definition
SDK Models (Typescript)
blockchain* String

Description: The blockchain which the token belongs to.

Example: SOLANA

address* String 

Description: Smart contract address of the token.

Example: 3yoMkf3X6bDxjks6YaWwNk4SAbuaysLg1a4BjQKToQAA

Custom Token Response
API Definition
SDK Models (Typescript)
Sample Response
token

Description: The token's metadata

error

Description: Error message if there was any problem

errorCode

Description: Error code if there was any problem

traceId

Description: Trace id help Rango support to resolve the issue

Get Address Token Balance
Get details of a list of wallets, including their explorer Url & balance

Get Wallets Details API
Use this method if you want to get all tokens of a list of wallet addresses for some desired blockchains. Note that this endpoint is slow since it queries for all tokens an address is holding and balance of each one. We recommend to call the RPC directly or use single token balance method whenever possible.

Typescript (SDK)
Node.js (Axios)
Bash (cURL)
Copy
const walletDetails = await rangoClient.getWalletsDetails({
    walletAddresses: [{
        blockchain: "BSC", 
        address: "0xeb2629a2734e272bcc07bda959863f316f4bd4cf"
    }]
})
Logo
Get Balance
rango-exchange
Wallets Details Request 
API Definition
SDK Models (Typescript)
walletAddresses * 

Description: List of user wallet addresses for desired blockchains.

Wallets Details Response 
API Definition
SDK Models (Typescript)
Sample Response
wallets

Description: List of wallets and their assets.

SDK Example
SDK Example for Integrating Rango Exchange

Overview
You could read this guide to understand the flow of integrating Rango-SDK. If you prefer to dive directly into the code and explore it there, you can use the links below.

Logo
rango-sdk/examples/main/node-evm at master · rango-exchange/rango-sdk
GitHub
EVM Example
Install TS SDK
If you decide not to use our TypeScript SDK and prefer integration in other programming languages, feel free to skip this step. 

To integrate Rango SDK inside your dApp or wallet, you need to install rango-sdk using npm or yarn.

Copy
npm install --save rango-sdk
# or 
yarn add rango-sdk
 Then you need to instantiate RangoClient and use it in the next steps.

Copy
import { RangoClient } from "rango-sdk"

const rango = new RangoClient(RANGO_API_KEY)
Get Tokens & Blockchains Data
To get the list of available blockchains, tokens, and protocols (dex or bridge) supported by Rango, you could use the getAllMetadata method like this:

Copy
const meta = await rango.getAllMetadata()
Routing
Get All Routes
Using information retrieved from the meta, you could implement your own SwapBox including your blockchain and token selector. The next step is to show the preview of the best route possible when the user selects the source and the destination tokens.

The blockchain and symbol names must be exactly what is fetched from Rango's Meta API.

Copy
// Converting 0.1 BSC BNB to AVAX_CCHAIN USDT.E 
const routingResponse = await rango.getAllRoutes({
  from: {
    "blockchain": "BSC", 
    "symbol": "BNB", 
    "address": null
  },
  to: {
    "blockchain": "AVAX_CCHAIN", 
    "symbol": "USDT.E", 
    "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"
  },
  amount: "0.1",
  slippage: "1.0",
})
You could call this method periodically to get the updated route before the user confirms the route. 

Confirm Route
Using the getAllRoutes method, you obtain a list of available routes. Once the user selects and confirms a route, you need to call the confirm method to notify Rango that the user has chosen this route for the next step and retrieve the final, updated route to display to the user.

To confirm the route, you must provide the selected route's request ID, the wallet addresses for all blockchains in the route, and optionally, a custom destination if the user wishes to send funds to a different wallet than the one specified for the related blockchain (in selectedWallets).

Copy
// user selects one of the routes
const selectedRoute = routingResponse.results[0]

const confirmResponse = await rango.confirmRoute({
  requestId: selectedRoute.requestId,
  selectedWallets: {
    'BSC': '0xeae6d42093eae057e770010ffd6f4445f7956613',
    'AVAX_CCHAIN': '0xeae6d42093eae057e770010ffd6f4445f7956613'
  },
  destination: '0x6f33bb1763eebead07cf8815a62fcd7b30311fa3'
})
At this stage, it is also possible to verify if the user has sufficient balance and fees for each step of the route in advance based on confirm response validation field. Also, you can compare the confirmed route with the route's output amount and alert the user if there is a significant difference.

Copy
// check if the route was okay
if (!confirmResponse.result || confirmResponse.error) {
  // there was a problem in confirming the route
} else {
  // everything was okay
  // you could compare confirmed route with the route output amount 
  // and warn the user if there is noticable difference
  // e.g. check if confirmed route output is 2% less than previous one
  const confirmedOutput = new BigNumber(routingResponse.results[selected]?.outputAmount)
  const finalOutput = new BigNumber(confirmResponse.result?.outputAmount)
  if (finalOutput.lt(confirmedOutput.multipliedBy(new BigNumber(0.98))) {
    // get double confirmation from the user
  } else {
    // proceed to executing the route  
  }
}
Route Execution
For every steps of the selected route, we need to repeat the next steps:

Creating Transaction
If the source blockchain for this step requires approval, such as EVM-based blockchains, Starknet, or Tron, and the user lacks sufficient approval, the Rango API will return an approval transaction in the response. The user must sign this transaction, and in the next createTransaction call for this step, the Rango API will provide the main transaction. Therefore, the createTransaction API response could either be an approval transaction (isApproval=true) or the main transaction (isApproval=false).

Copy
const request: CreateTransactionRequest = {
  requestId: confirmedRoute.requestId,
  step: 1, // 1, 2, 3, ...
  userSettings: {
    slippage: '1.0',
    infiniteApprove: false
  },
  validations: {
    approve: true,
    balance: false,
    fee: false,
  }
}
let createTransactionResponse = await rango.createTransaction(request)
let tx = createTransactionResponse.transaction
if (!tx) {
  throw new Error(`Error creating the transaction ${createTransactionResponse.error}`)
}
If you are verifying the balance and fee amount on your client side or you've already checked them in route confirmation step, it is advisable to set the balance and fee parameters to false to prevent duplicate checks or potential errors during validation.

Tracking Swap Status
After signing the transaction by the user and receiving transaction hash, you could periodically call Rango check-status API to track the transaction status. In Rango, each swap step could have 3 different states: running, failed and success. You only need to keep checking the status until you find out whether the transaction failed or succeeded.

Copy
const state = await rango.checkStatus({
    requestId: confirmedRoute.requestId,
    step: 1, // related step
    txId: '0xfa88b705a5b4049adac7caff50c887d9600ef023ef1a937f8f8b6f44e90042b5'
})

if (response.status) {
  // show latest status of the swap to the user
  if (response.status === TransactionStatus.SUCCESS) {
      // swap suceeded
  } else if (response.status === TransactionStatus.FAILED) {
      // swap failed
  } else {
      // swap is still running
      // we need to call check-status method again after a timeout (10s)
  }
}
Complete Code Flow
Logo
rango-sdk/examples/main/node-evm at master · rango-exchange/rango-sdk
GitHub
Node.JS Example
Copy
// run `node --import=tsx index.ts` in the terminal

import { CreateTransactionRequest, RangoClient, TransactionStatus, TransactionType } from "rango-sdk";
import { findToken } from '../shared/utils/meta.js'
import { TransactionRequest, ethers } from "ethers";
import { setTimeout } from 'timers/promises'

// setup wallet & RPC provider
// please change rpc provider url if you want to test another chain rather than BSC
const privateKey = 'YOUR_PRIVATE_KEY';
const wallet = new ethers.Wallet(privateKey);
const rpcProvider = new ethers.JsonRpcProvider('https://bsc-dataseed1.defibit.io');
const walletWithProvider = wallet.connect(rpcProvider);
const waleltAddress = walletWithProvider.address

// initiate sdk using your api key
const API_KEY = "c6381a79-2817-4602-83bf-6a641a409e32"
const rango = new RangoClient(API_KEY)

// get blockchains and tokens meta data
const meta = await rango.getAllMetadata()

// some example tokens for test purpose
const sourceBlockchain = "BSC"
const sourceTokenAddress = "0x55d398326f99059ff775485246999027b3197955"
const targetBlockchain = "BSC"
const targetTokenAddress = null
const amount = "0.001"

// find selected tokens in meta.tokens
const sourceToken = findToken(meta.tokens, sourceBlockchain, sourceTokenAddress)
const targetToken = findToken(meta.tokens, targetBlockchain, targetTokenAddress)

// get route
const routingRequest = {
  from: sourceToken,
  to: targetToken,
  amount,
  slippage: '1.0',
}
const routingResponse = await rango.getAllRoutes(routingRequest)
if (routingResponse.results.length === 0) {
  throw new Error(`There was no route! ${routingResponse.error}`)
}

// confirm one of the routes
const selectedRoute = routingResponse.results[0]

const selectedWallets = selectedRoute.swaps
  .flatMap(swap => [swap.from.blockchain, swap.to.blockchain])
  .filter((blockchain, index, self) => self.indexOf(blockchain) === index)
  .map(blockchain => ({ [blockchain]: waleltAddress }))
  .reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});

const confirmResponse = await rango.confirmRoute({
  requestId: selectedRoute.requestId,
  selectedWallets,
})

const confirmedRoute = confirmResponse.result

if (!confirmedRoute) {
  throw new Error(`Error in confirming route, ${confirmResponse.error}`)
}

let step = 1
const swapSteps = confirmedRoute.result?.swaps || []
for (const swap of swapSteps) {
  const request: CreateTransactionRequest = {
    requestId: confirmedRoute.requestId,
    step: step,
    userSettings: {
      slippage: '1.0',
      infiniteApprove: false
    },
    validations: {
      approve: true,
      balance: false,
      fee: false,
    }
  }
  let createTransactionResponse = await rango.createTransaction(request)
  let tx = createTransactionResponse.transaction
  if (!tx) {
    throw new Error(`Error creating the transaction ${createTransactionResponse.error}`)
  }

  if (tx.type === TransactionType.EVM) {
    if (tx.isApprovalTx) {
      // sign the approve transaction
      const approveTransaction: TransactionRequest = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
      }
      const { hash } = await walletWithProvider.sendTransaction(approveTransaction);

      // wait for approval
      while (true) {
        await setTimeout(5_000)
        const { isApproved, currentApprovedAmount, requiredApprovedAmount, txStatus } = await rango.checkApproval(confirmedRoute.requestId, hash)
        if (isApproved)
          break
        else if (txStatus === TransactionStatus.FAILED)
          throw new Error('Approve transaction failed in blockchain')
        else if (txStatus === TransactionStatus.SUCCESS)
          throw new Error(`Insufficient approve, current amount: ${currentApprovedAmount}, required amount: ${requiredApprovedAmount}`)
      }

      // create the main transaction if previous one was approval transaction
      createTransactionResponse = await rango.createTransaction(request)
      tx = createTransactionResponse.transaction
      if (!tx || tx.type !== TransactionType.EVM) {
        throw new Error(`Error creating the transaction ${createTransactionResponse.error}`)
      }
    }

    // sign the main transaction
    const mainTransaction: TransactionRequest = {
      from: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
    }
    const { hash } = await walletWithProvider.sendTransaction(mainTransaction);
    
    // track swap status
    while (true) {
      await setTimeout(10_000)
      const state = await rango.checkStatus({
        requestId: confirmedRoute.requestId,
        step,
        txId: hash
      })

      const status = state.status
      if (status === TransactionStatus.SUCCESS) {
        // we could proceed with the next step of the route
        step += 1;
        break
      } else if (status === TransactionStatus.FAILED) {
        throw new Error(`Swap failed on step ${step}`)
      }
    }
  }
}

Monetization
How to take fees from the users using Rango Main API?

How Rango affiliate system works?
💰
Monetization
How to set affiliate parameters?
In main api, it's enough to pass affiliate parameters only in routing methods e.g. in getBestRoute or getAllRoutes methods.

In these methods, several fields could be used for participating in the affiliate program: affiliateRef, affiliateWallets, affiliatePercent. You could use combination ofaffiliateRef and affiliatePercent, or affiliateWallets and affiliatePercent:

affiliateRef: The referral code you could generate on our Affiliate Program Page. If you use this, we will send the affiliate fees to the wallet that created this link.

affiliatePercent: The fee percentage you want to charge the users (1.5 means 1.5 percent). The maximum fee you could charge users is 3 percent. The default value is 0.1 percent or 10 bps.

affiliateWallets: A map of blockchains to wallet addresses, allowing you to specify which wallet you want to receive the fee.

Sample code for fetching the route preview:

Typescript
cURL
Copy
const bestRoute = await rango.getBestRoute({
    from: {"blockchain": "BSC", "symbol": "BNB", "address": null},
    to: {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"},    
    amount: "1",
    slippage: 1,
    checkPrerequisites: false,
    affiliatePercent: 0.3,
    affiliateWallets: {
        "BSC": "0x6f33bb1763eebead07cf8815a62fcd7b30311fa3"
    },
})
Example code for the moment the user confirms the route:

Typescript
cURL
Copy
const bestRoute = await rango.getBestRoute({
    from: {"blockchain": "BSC", "symbol": "BNB", "address": null},
    to: {"blockchain": "AVAX_CCHAIN", "symbol": "USDT.E", "address": "0xc7198437980c041c805a1edcba50c1ce5db95118"},    
    amount: "1",
    slippage: 1,
    checkPrerequisites: true,
    selectedWallets: {
        "BSC": "0xeae6d42093eae057e770010ffd6f4445f7956613",
        "AVAX_CCHAIN": "0xeae6d42093eae057e770010ffd6f4445f7956613",
    },
    affiliatePercent: 0.3,
    affiliateWallets: {
        "BSC": "0x6f33bb1763eebead07cf8815a62fcd7b30311fa3"
    },
})


Sample Transactions
Sample transactions for all types of transactions in main API

Overview
Here are some samples of the transaction object that is created in create transaction method. Rango currently returns 6 different types of transactions based on the blockchain that the transaction is happening on. This includes:

EVM: For all EVM-based blockchains, including Ethereum, Polygon, Avalanche, etc.

COSMOS: For all the cosmos-based networks, including the Cosmos itself, Osmosis, Akash, Thorchain, Maya and etc.

TRANSFER: For UTXO blockchains, including Bitcoin, Litecoin, Doge, etc.

SOLANA: For Solana transactions.

TRON: For Tron Transactions. 

STARKNET: For Starknet transactions.

Let's see some examples here.

EVM Sample Transaction: (Test)
Here is the structure of an EVM transaction in the code below.

If the user lacks sufficient approval for the transaction, the create transaction method will respond with an approval transaction. (isApproval field is true in this case.) The user must first sign this approval transaction to ensure they have the necessary approval. Then, they should call the create transaction method again to obtain and sign the main transaction. The fields and schema for the approval and main transactions are identical. 

For the gas price of the transaction, if the blockchain supports the new versions of gas price, such as maxPriorityFeePerGas and maxFeePerGas, these fields will be populated. However, for blockchains that have not yet updated their gas model, the gas price will be set in the gasPrice field as before. You can check the list of all chains that support the new gas price versions in the meta or blockchains methods. (There is an enableGasV2 field in the response body, included for each blockchain.)

Copy
"transaction": {
    "type": "EVM",
    "blockChain": "BSC",
    "isApprovalTx": true,
    "from": "0x7abac41d46857b0b6c4d67eb966b4a29ba69b4f3",
    "to": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    "data": "0x095ea7b300000000000000000000000069460570c93f9de5e2edbc3052bf10125f0ca22d000000000000000000000000000000000000000000000000000775f05a074000",
    "value": null,
    "gasLimit": "0x12284",
    "gasPrice": "1100000000",
    "maxPriorityFeePerGas": null,
    "maxFeePerGas": null,
    "nonce": null
}
Sample for non-approval:

Copy
"transaction": {
  "type": "EVM",
  "blockChain": "BSC",
  "isApprovalTx": false,
  "from": "0xccf3d872b01762aba74b41b1958a9a86ee8f34a2",
  "to": "0x69460570c93f9DE5E2edbC3052bf10125f0Ca22d",
  "data": "0xb17d0e6e000000000000000000000000000000002358d41a5a8f4afa87403e161e2955e900000000000000000000000055d398326f99059ff775485246999027b3197955000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000081fe9fae05d8094c0000000000000000000000000000000000000000000000000031fe30556285140000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000037f73c93f73fac000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000ccf3d872b01762aba74b41b1958a9a86ee8f34a3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000001b81d678ffb9c0263b24a97847620c99d213eb140000000000000000000000001b81d678ffb9c0263b24a97847620c99d213eb1400000000000000000000000055d398326f99059ff775485246999027b31979550000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000081fe9fae05d8094c00000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000264ac9650d800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000124c04b8d59000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000190ff9d543500000000000000000000000000000000000000000000000081fe9fae05d8094c0000000000000000000000000000000000000000000000000037f4872b410e24000000000000000000000000000000000000000000000000000000000000002b55d398326f99059ff775485246999027b31979550001f4bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c0000000000000000000000000000000000000000000000000037f73c93f73fac00000000000000000000000069460570c93f9de5e2edbc3052bf10125f0ca22d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "value": null,
  "gasLimit": "0x91bc6",
  "gasPrice": "1100000000",
  "maxPriorityFeePerGas": null,
  "maxFeePerGas": null,
  "nonce": null
}
COSMOS Sample Transaction:
For Cosmos based blockchains, we have two type of transactions based on signType field: AMINO and DIRECT. 

Cosmos Amino Sample Transaction: (Test)
Copy
{
  "type": "COSMOS",
  "fromWalletAddress": "osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl",
  "blockChain": "OSMOSIS",
  "data": {
    "chainId": "osmosis-1",
    "account_number": 102721,
    "sequence": "892",
    "msgs": [
      {
        "type": "wasm/MsgExecuteContract",
        "value": {
          "sender": "osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl",
          "contract": "osmo1clp46dz247hck0ns5jkv49hqzg8x0vh5hsx8yfvk6w87hnvc6hgs563ew3",
          "msg": {
            "swap_and_action": {
              "user_swap": {
                "swap_exact_asset_in": {
                  "swap_venue_name": "osmosis-poolmanager",
                  "operations": [
                    {
                      "pool": "1464",
                      "denom_in": "uosmo",
                      "denom_out": "ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4"
                    },
                    {
                      "pool": "1838",
                      "denom_in": "ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4",
                      "denom_out": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
                    }
                  ]
                }
              },
              "min_asset": {
                "native": {
                  "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                  "amount": "74944"
                }
              },
              "timeout_timestamp": 1722276105002000000,
              "post_swap_action": {
                "transfer": {
                  "to_address": "osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl"
                }
              },
              "affiliates": []
            }
          },
          "funds": [
            {
              "denom": "uosmo",
              "amount": "1000000"
            }
          ]
        }
      }
    ],
    "protoMsgs": [
      {
        "type_url": "/cosmwasm.wasm.v1.MsgExecuteContract",
        "value": [
          10,
          43,
          111,
          // ...
        ]
      }
    ],
    "memo": "",
    "source": null,
    "fee": {
      "gas": "2000000",
      "amount": [
        {
          "denom": "uosmo",
          "amount": "50000"
        }
      ]
    },
    // Sign type, could be AMINO or DIRECT
    "signType": "AMINO",
    "rpcUrl": "https://osmosis-rpc.polkachu.com"
  },
  // @deprecated An alternative to CosmosMessage object for the cosmos wallets 
  "rawTransfer": null
}
Cosmos Direct Sample Transaction: (Test)
This type is only used in limited swappers like WYNDDex (and Juno Blockchain) and we are going to deprecate support for Cosmos Direct transaction types whenever possible.  You could sign this type of transactions using Stargate Client library.

Copy
"transaction": {
  "type": "COSMOS",
  "fromWalletAddress": "juno1unf2rcytjxfpz8x8ar63h4qeftadptg54xrtf3",
  "blockChain": "JUNO",
  "data": {
    "chainId": "juno-1",
    "account_number": 125507,
    "sequence": "309",
    "msgs": [
      {
        "typeUrl": "/cosmwasm.wasm.v1.MsgExecuteContract",
        "value": {
          "sender": "juno1unf2rcytjxfpz8x8ar63h4qeftadptg54xrtf3",
          "contract": "juno1pctfpv9k03v0ff538pz8kkw5ujlptntzkwjg6c0lrtqv87s9k28qdtl50w",
          "msg": "eyJleGVjdXRlX3N3YXBfb3BlcmF0aW9ucyI6eyJvcGVyYXRpb25zIjpbeyJ3eW5kZXhfc3dhcCI6eyJhc2tfYXNzZXRfaW5mbyI6eyJuYXRpdmUiOiJpYmMvQzRDRkY0NkZENkRFMzVDQTRDRjRDRTAzMUU2NDNDOEZEQzlCQTRCOTlBRTU5OEU5QjBFRDk4RkUzQTIzMTlGOSJ9LCJvZmZlcl9hc3NldF9pbmZvIjp7Im5hdGl2ZSI6InVqdW5vIn19fV0sIm1heF9zcHJlYWQiOiIwLjAxIn19",
          "funds": [
            {
              "denom": "ujuno",
              "amount": "1000000"
            }
          ]
        }
      }
    ],
    "protoMsgs": [],
    "memo": "",
    "source": null,
    "fee": {
      "gas": "1000000",
      "amount": [
        {
          "denom": "ujuno",
          "amount": "2500"
        }
      ]
    },
    // Sign type, could be AMINO or DIRECT
    "signType": "DIRECT",
    "rpcUrl": "https://rpc-juno.itastakers.com:443/"
  },

  // @deprecated An alternative to CosmosMessage object for the cosmos wallets 
  "rawTransfer": null
}
Transfer Sample Transaction: (Test)
Here is the structure of an UTXO (Transfer) transaction: 

Copy
"transaction": {
  // This field equals to TRANSFER for all UTXO Transactions
  "type": "TRANSFER",

  // The method that should be passed to wallet including deposit, transfer
  "method": "transfer",

  // Source wallet address that can sign this transaction
  "fromWalletAddress": "qruy9zr8x9k335pkvqpfas3jsjfesq5gzu4nreyn4j",

  // Destination wallet address that the fund should be sent to
  "recipientAddress": "qzumtx6ufk3qu92slcsg5ajehujehzcquydmhaq0eh",

  // The memo of transaction, can be null
  "memo": "=:ETH.ETH:0x6f33bb1763eebead07cf8815a62fcd7b30311fa3:1080176077:rg:0",

  // The machine-readable amount of transaction
  "amount": "10000000000",

  // The decimals of the asset
  "decimals": 8,

  // An asset with its ticker
  "asset": {
    "blockchain": "BCH",
    "symbol": "BCH",
    "address": null,
    "ticker": "BCH"
  }
}
Tron Sample Transaction: (Test)
Here is the structure of a Tron transaction. Similar to EVM transactions, it can be either an approval transaction or a main transaction, depending on the isApproval field

Copy
{
  "type": "TRON",
  "blockChain": "TRON",
  "isApprovalTx": false,
  "raw_data": {
    "contract": [
      {
        "parameter": {
          "value": {
            "data": "b24ebddb000000000000000000000000000000000000000000000000000000000002091100000000000000000000000000000000000000000000000000000190ffaa951100000000000000000000000000000000000000000000000000000000000f4240",
            "owner_address": "413a51fc0bc19accbea62fac65bad2660bbcffd08a",
            "contract_address": "41a2726afbecbd8e936000ed684cef5e2f5cf43008",
            "call_value": 1000000
          },
          "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
        },
        "type": "TriggerSmartContract"
      }
    ],
    "ref_block_bytes": "af01",
    "ref_block_hash": "e4752a1cdaf3e944",
    "expiration": 1722276345000,
    "fee_limit": 1500000000,
    "timestamp": 1722276287817
  },
  "raw_data_hex": "0a02af012208e4752a1cdaf3e94440a8e9adfd8f325ad301081f12ce010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e74726163741298010a15413a51fc0bc19accbea62fac65bad2660bbcffd08a121541a2726afbecbd8e936000ed684cef5e2f5cf4300818c0843d2264b24ebddb000000000000000000000000000000000000000000000000000000000002091100000000000000000000000000000000000000000000000000000190ffaa951100000000000000000000000000000000000000000000000000000000000f424070c9aaaafd8f32900180dea0cb05",
  "externalTxId": null,
  "__payload__": {
    "owner_address": "413a51fc0bc19accbea62fac65bad2660bbcffd08a",
    "call_value": 1000000,
    "contract_address": "41a2726afbecbd8e936000ed684cef5e2f5cf43008",
    "fee_limit": 1500000000,
    "function_selector": "trxToTokenSwapInput(uint256,uint256,uint256)",
    "parameter": "000000000000000000000000000000000000000000000000000000000002091100000000000000000000000000000000000000000000000000000190ffaa951100000000000000000000000000000000000000000000000000000000000f4240",
    "chainType": 0
  },
  "txID": "10d1428e0ccc8870b9334d73da2313cfaff29ec27930e68a6947ea8bb1d6b181",
  "visible": false
}
Starknet Sample Transaction: (Test)
Here is the structure of a Starknet transaction. Like EVM transactions, it can be either an approval transaction or a main transaction, depending on the isApproval field. Whenever possible, in Starknet, we batch the approval and main transactions into a single transaction using the calls array, as shown in the example below.

Copy
"transaction": {
    "type": "STARKNET",
    "blockChain": "STARKNET",
    "calls": [
        {
            "contractAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "entrypoint": "approve",
            "calldata": [
                "0x4270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f",
                "0x00000000000000000ddb6275b03a4000",
                "0x00000000000000000000000000000000"
            ]
        },
        {
            "contractAddress": "0x4270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f",
            "entrypoint": "multi_route_swap",
            "calldata": [
                "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                "0xddb6275b03a4000",
                "0x0",
                // ...
            ]
        },
        {
            "contractAddress": "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            "entrypoint": "transfer",
            "calldata": [
                "0x01d8b73b49d8cb653570929260e8e01033278d6840f706faa421f08b992f8083",
                "0x00000000000000000005543df729c000",
                "0x00000000000000000000000000000000"
            ]
        }
    ],
    "maxFee": null,
    "isApprovalTx": false,
    "spender": null
}
Solana Sample Transaction: (Test)
Base64 Encoding

Remember to broadcast the signed transaction to Solana RPCs with base64 encoding. The base58 encoding is deprecated, but it is still the default method in Solana docs. 

Versioned vs Legacy

All supported routes for Solana are VERSIONED transactions except a special case of converting SOL to WSOL or vice versa via Solana Wrapper. (which you can ignore it.)

Sample for versioned transaction

Sample for legacy transaction

Copy
"transaction": {
     // This field equals to SOLANA for all SOLANA Transactions
    "type": "SOLANA",
    
    // Transaction blockchain
    "blockChain": "SOLANA",
    
    // Wallet address of transaction initiator
    "from": "3HsNMDtxPRUzwLpDJemmNVbasm11Ei5CGGCjktgHh27F",
    
    // Transaction identifier in case of retry
    "identifier": "Swap",
    
    // List of instructions
    "instructions": [ ],

    // Recent blockHash. Nullable. Filled only if message is already partially signed
    "recentBlockhash": null,
    
    // List of signatures. Filled only if message is already partially signed
    "signatures": [ ],
    
    // When serialized message appears, there is no need for other fields and you just sign and send it
    "serializedMessage": [1, 0, 95, 96, ..., 1, 253], 
    
    // Could be LEGACY or VERSIONED
    "txType": "VERSIONED"
  }


