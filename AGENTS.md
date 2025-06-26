# AGENTS.md - Unified Crypto Exchange

This document provides guidance for AI agents working on the Unified Crypto Exchange project. The project's primary goal is to create a user-friendly platform combining P2P crypto-to-fiat trading with a cross-chain DEX aggregator.

**Attention: Significant Technology Stack Change**

The project is undergoing a major change in its cross-chain DEX aggregation component and user wallet management:

*   **Previous DEX Aggregator:** Rango Exchange
*   **New DEX Aggregator Approach:**
    *   **ZetaChain:** For omnichain smart contract capabilities and cross-chain messaging.
    *   **Thorchain (via XChainJS):** As a primary source of cross-chain liquidity.
*   **New Wallet & Authentication:**
    *   **Particle Network:** For Wallet-as-a-Service (WaaS), social logins, email logins, and potentially Account Abstraction (AA) features (e.g., gasless transactions, session keys).

Refer to `project.md` for the original full project requirements, `progress.md` for the development status before this change, and `dependency.md` for links to the documentation of the new technologies.

## Core Project Principles to Maintain:

*   **User-Centricity:** Prioritize simplicity and ease of use for non-technical crypto users.
*   **Unified Experience:** Seamlessly integrate P2P (LocalCoinSwap) and DEX functionalities.
*   **Security:** Maintain the highest security standards for all operations, especially handling user funds and transactions.
*   **Modularity:** Continue to build reusable components and services.
*   **Test Coverage:** Ensure comprehensive unit, integration, and E2E tests for all new and modified functionalities.

## Strategic Approach for Integrating New Technologies:

1.  **Deep Dive & Familiarization:**
    *   Thoroughly study the documentation for ZetaChain, Thorchain, XChainJS, and Particle Network (see `dependency.md`).
    *   Understand their APIs, SDKs, security models, and best practices.
    *   Experiment with example code and basic operations for each new component.

2.  **Particle Network Integration (Wallet & Auth):**
    *   **Priority:** This is a foundational change affecting user onboarding and interaction.
    *   Implement Particle Auth for social/email logins.
    *   Integrate Particle Connect to support both WaaS (embedded wallets) and connections to external wallets (MetaMask, WalletConnect, etc.).
    *   Replace existing wallet connection logic (previously for Rango) with Particle Network's solutions.
    *   Design the UI/UX for the new login and wallet management flows.
    *   Explore and plan for the potential use of Particle's AA features (Smart Wallet-as-a-Service, Bundler, Paymaster) to enhance UX (e.g., gas sponsorship, batched transactions).

3.  **Thorchain Integration (via XChainJS for Core Swaps):**
    *   Utilize `xchain-js` libraries, particularly `xchain-thorchain-amm` and `xchain-thorchain-query`.
    *   Implement functionality to fetch quotes for swaps directly from Thorchain.
    *   Develop logic to construct and broadcast swap transactions to Thorchain using `xchain-js` client packages for various chains (BTC, ETH, AVAX, BSC, Cosmos Hub, etc.).
    *   Handle Thorchain memo requirements carefully.
    *   Integrate transaction status tracking using `xchain-thorchain-query` or by querying Thorchain nodes/Midgard.
    *   Adapt the existing swap UI to display quotes and facilitate transactions via Thorchain.

4.  **ZetaChain Integration (Omnichain Logic & ZRC-20 Management):**
    *   **Identify Use Cases:** Determine where ZetaChain's omnichain smart contracts and messaging provide unique advantages. Examples:
        *   Orchestrating complex multi-step swaps that might involve interactions beyond Thorchain.
        *   Managing ZRC-20 versions of assets (wrapped tokens on ZetaChain) for unified liquidity or interactions.
        *   Facilitating cross-chain calls initiated from one connected chain to another through ZetaChain.
    *   **Smart Contracts (zEVM):** If custom omnichain logic is needed, develop, test, and deploy smart contracts on ZetaChain.
    *   **CCTX (Cross-Chain Transactions):** Utilize ZetaChain's CCTX mechanisms for sending messages and value across chains.
    *   **SDK/API:** Use ZetaChain's SDKs/APIs for frontend/backend interaction with its network and contracts.
    *   **Consider:** How ZetaChain can complement Thorchain. For direct swaps supported by Thorchain, XChainJS might be sufficient. ZetaChain might be layered on top for more advanced scenarios or to interact with chains/protocols Thorchain doesn't directly support.

5.  **Refactor and Adapt Existing Code:**
    *   **P2P Integration:** Ensure the LocalCoinSwap integration remains functional and integrates smoothly with the new wallet system.
    *   **DEX Aggregator UI/Logic:** Substantial parts of the Rango-specific UI and backend logic will need to be refactored to work with Thorchain/XChainJS and potentially ZetaChain. This includes how swap routes are displayed, how transactions are initiated, and how statuses are tracked.
    *   **User Dashboard:** Update to reflect transactions made through the new swap mechanism and integrate with Particle Network's user data if applicable.
    *   **Queue Manager:** The existing queue manager (from Rango integration) might need to be adapted or re-evaluated for its role with the new stack, especially for managing asynchronous cross-chain operations via ZetaChain or Thorchain.

## Key Development Considerations:

*   **Security First:**
    *   All smart contracts (especially on ZetaChain) MUST undergo rigorous testing and ideally professional audits before handling mainnet funds.
    *   Follow security best practices for private key management (even with WaaS, understand the security model), API key handling, and input validation.
    *   Be mindful of Thorchain's memo requirements to prevent fund loss.
*   **Error Handling & State Management:** Cross-chain operations are complex. Implement robust error handling, retry mechanisms, and clear state management for transactions that may involve multiple steps across different chains.
*   **Gas Optimization:** Be mindful of gas costs, especially for multi-step operations. Explore Particle Network's AA features for potential gas sponsoring or abstraction.
*   **User Experience (UX):**
    *   Abstract the complexity of the underlying cross-chain mechanisms from the user.
    *   Provide clear feedback on transaction status, potential delays, and fees.
    *   The transition to Particle Network for login/wallet should significantly improve onboarding.
*   **Testing:**
    *   Write comprehensive unit tests for individual functions and modules (e.g., XChainJS interactions, ZetaChain contract calls).
    *   Develop integration tests for flows involving multiple components (e.g., Particle auth + XChainJS swap).
    *   Update/create E2E tests to cover the new swap and authentication flows.
    *   Utilize testnets for ZetaChain, Thorchain, and connected chains extensively.
*   **Modularity:** Design new components (e.g., Thorchain service, ZetaChain service, ParticleAuth service) in a modular way for better maintainability and testability.
*   **Incremental Rollout (If Possible):** Consider if parts of the new system can be rolled out incrementally to mitigate risks.

## Code and Workflow Guidelines:

*   **Branching Strategy:** Use feature branches for each significant piece of work (e.g., `feat/particle-auth`, `feat/thorchain-swap-btc-eth`).
*   **Commit Messages:** Follow conventional commit message formats.
*   **Pull Requests:** Ensure PRs are reviewed and include descriptions of changes and testing performed.
*   **Dependency Management:** Carefully manage dependencies related to XChainJS, ZetaChain SDKs, and Particle Network SDKs.
*   **Refer to `project.md`:** For overall architecture, UI/UX guidelines, and feature specifications not directly impacted by this technology change.

This AGENTS.md should serve as a living document. Update it as new insights are gained or if the strategy needs refinement during development. Good luck!
