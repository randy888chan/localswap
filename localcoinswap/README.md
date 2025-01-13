Build Error
Next.js (15.1.3) (Turbopack)
Failed to compile

./app/components/LocalCoinSwap.tsx:6:1
Module not found: Can't resolve '../../../javascript/config.js'
  4 | import axios from 'axios';
  5 | import CryptoJS from 'crypto-js';
> 6 | import { apiToken, exchangePassword } from '../../../javascript/config.js';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  7 |
  8 | const LocalCoinSwap = () => {
  9 |   const [data, setData] = useState<LocalCoinSwapData | null>(null);

https://nextjs.org/docs/messages/module-not-found
This error occurred during the build process and can only be dismissed by fixing the error.



## LocalCoinSwap API Examples

This is a simple demonstration of some of the functionality of the LocalCoinSwap API. You can our API to automate trades, or work with the private keys to your account.

This repository is updated with examples based only on requests from users of the API. If you are confused about how to do something with our API then raise a Github issue and we will add an example for you. Whatever your use-case, don't be afraid to raise an issue.

### Current examples

(Python)  
Decrypting mnemonic from encrypted blob endpoint  
Get wallet addresses from exchange

(Javascript)  
Decrypting mnemonic from encrypted blob endpoint

### Installation

Javascript:
```
cd javascript
touch .env
yarn install
```

Add your keys to your .env file so it looks something like:
```
API_TOKEN=<Token from exchange>
ACCOUNT_PASSWORD=<Password for exchange>
```

Run examples:
```
babel-node examples/decryptMnemonic.js
```

Python:
```
cd python
pyenv install 3.8.1
pyenv virtualenv 3.8.1 lcscrypto
pyenv local lcscrypto
pip3 install -r requirements.txt
```

Run examples:
```
python examples/decrypt_mnemonic.py
python examples/wallet_addresses.py
```
