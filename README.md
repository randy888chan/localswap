# Unified Crypto Exchange

## Project Overview

The Unified Crypto Exchange is a platform that combines P2P crypto-to-fiat trading with a cross-chain DEX and aggregator. The goal is to provide a seamless experience for users, eliminating the need to switch between multiple applications.

## Features

- **Landing Page:** A user-friendly landing page that guides users based on their needs (buy/sell crypto with fiat or swap between cryptocurrencies).
- **P2P Trading:** Integration of LocalCoinSwap's P2P functionality, allowing users to buy and sell crypto with fiat using various payment methods.
- **Wallet & Authentication:** Utilizes Particle Network for seamless user onboarding with social/email logins (Wallet-as-a-Service) and connection to external wallets.
- **Cross-Chain DEX & Aggregator:** Enables token swaps across different blockchains, leveraging Thorchain for liquidity (via XChainJS) and ZetaChain for omnichain capabilities and ZRC-20 asset management.
- **User Dashboard:** A dashboard for users to track their transaction history, balances, and other relevant information.
- **Dynamic Landing Pages:** Programmatically generated landing pages based on product offerings and user geography (for SEO and targeted marketing).
- **Multilingual Support:** Dynamic translation of content, potentially leveraging LLMs for content generation and translation, with caching for performance.

## Technology Stack

- **Programming Language:** TypeScript
- **Framework:** Next.js (with Tailwind CSS)
- **Database System:** Cloudflare Workers KV or D1
- **Version Control, Testing, and Deployment:** GitHub (including GitHub Actions for CI/CD)

## Getting Started

### Prerequisites

- Node.js and npm or yarn
- Git

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/unified-crypto-exchange.git
    cd unified-crypto-exchange
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env.local` file (or `.env` for other environments) in the root directory and add the necessary environment variables. Refer to `.env.example` if provided, or use the following structure:

    ```env
    # LocalCoinSwap (P2P Trading)
    NEXT_PUBLIC_LOCALCOINSWAP_API_KEY=your_localcoinswap_api_key

    # Particle Network (Wallet & Authentication)
    NEXT_PUBLIC_PARTICLE_PROJECT_ID=your_particle_project_id
    NEXT_PUBLIC_PARTICLE_CLIENT_KEY=your_particle_client_key
    NEXT_PUBLIC_PARTICLE_APP_ID=your_particle_app_id

    # XChainJS - Etherscan/Ethplorer (Optional, for faster EVM transaction data & token balances for ThorchainService)
    # These are used by xchain-ethereum client if provided
    NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
    NEXT_PUBLIC_ETHPLORER_API_KEY=your_ethplorer_api_key
    # Add other XChainJS provider keys if needed (e.g., Blockcypher for BTC, BSCScan for BSC)

    # ZetaChain (if specific API keys are needed for services beyond the client toolkit)
    # NEXT_PUBLIC_ZETACHAIN_API_KEY=your_zetachain_service_api_key

    # Other application configurations
    # NEXT_PUBLIC_APP_ENV=development # Example: development, staging, production
    # NEXT_PUBLIC_THORCHAIN_NETWORK=mainnet # Example: mainnet, testnet (stagenet for THORChain)
    ```
    *Note: Prefix environment variables exposed to the browser with `NEXT_PUBLIC_`.*

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Security

All cryptographic operations are performed using hardened WebCrypto implementations. 
Private keys are never exposed to browser contexts and are managed exclusively in:

1. Cloudflare Workers (PSBT signing)
2. Hardware Security Modules (Key generation) 
3. Trusted Execution Environments (Key usage)

For auditing purposes, the entire signing process uses deterministic BitcoinJS templates.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
