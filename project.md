**Project: Unified Crypto Exchange (P2P, DEX, and Aggregator)**

**Step 1: Define the Project Requirements**

*   **Purpose of the Application:** A unified crypto exchange platform that combines P2P crypto-to-fiat trading (like LocalCoinSwap) with a cross-chain DEX and aggregator leveraging Thorchain for liquidity, ZetaChain for omnichain capabilities, and Particle Network for user wallets and authentication. The goal is to provide a seamless experience for users, eliminating the need to switch between multiple applications.
*   **Goals of the Application:**
    *   Simplify the user experience for buying, selling, and swapping cryptocurrencies.
    *   Reduce the complexity associated with cross-chain transactions.
    *   Increase user adoption by offering a one-stop solution.
*   **Target Audience:** Non-technical crypto users and new adopters who value simplicity and convenience.
*   **Features List:**
    *   **Landing Page:** A user-friendly landing page that guides users based on their needs (buy/sell crypto with fiat or swap between cryptocurrencies).
    *   **P2P Trading:** Integration of LocalCoinSwap's P2P functionality, allowing users to buy and sell crypto with fiat using various payment methods.
    *   **Cross-Chain DEX & Aggregator:** Integration of Thorchain (via XChainJS) for core cross-chain swaps and ZetaChain for advanced omnichain logic and ZRC-20 token management. User authentication and wallet interactions will be handled by Particle Network.
    *   **User Dashboard:** A dashboard for users to track their transaction history, balances, and other relevant information.
    *   **Dynamic Landing Pages:** Programmatically generated landing pages based on product offerings and user geography (for SEO and targeted marketing).
    *   **Multilingual Support:** Dynamic translation of content, potentially leveraging LLMs for content generation and translation, with caching for performance.
*   **Additional Considerations:**
    *   Integration of LLMs (e.g., for content generation, translation, or even customer support).
    *   Data caching using Cloudflare Workers or other caching mechanisms.
    *   Future expansion to include more payment options and blockchain integrations.

**Step 2: Choose the Right Technology Stack**

*   **Programming Language:** TypeScript (Excellent choice for its type safety and scalability).
*   **Framework:** Next.js (with Tailwind CSS) – Ideal for server-side rendering (SSR), static site generation (SSG), and building complex user interfaces. Also, it aligns well with your goal of dynamic landing pages.
*   **Database System:** Cloudflare Workers KV or D1 (for simple key-value storage or relational database needs, respectively). These are serverless databases that integrate seamlessly with Cloudflare's infrastructure and offer good performance and scalability. If more complex data relationships are required consider PostgreSQL, MySQL or other databases.
*   **Version Control, Testing, and Deployment:** GitHub (including GitHub Actions for CI/CD).

**Step 3: Set Up the Development Environment**

*   **IDE:** GitHub Codespaces (Excellent choice as it provides a consistent, cloud-based development environment).
*   **Version Control:** Git (already covered by using GitHub).
*   **Additional Tools:**
    *   **`Node.js` and `npm` or `yarn`:** Essential for managing JavaScript/TypeScript projects and dependencies.
    *   **`Prettier`:** For code formatting and maintaining consistency.
    *   **`ESLint`:** For identifying and fixing code style and quality issues.
    *   **Testing Framework:** `Vitest` (it have better typescript support) or `Jest` (for unit and integration testing) and `Cypress` (for end-to-end testing).
    *   **`wrangler`:** The Cloudflare Workers CLI for deploying and managing your application on Cloudflare.
    *   **`@langchain/cloudflare`:** for implementing AI functionality (if any).

**Step 4: Design the Application Architecture**

*   **Architecture Type:** I recommend a **hybrid approach**.
    *   **Frontend:** Primarily server-side rendered (SSR) using Next.js for the main application, including the landing pages, user dashboard, and core trading interfaces. This ensures good SEO and fast initial page loads. Use static site generation (SSG) for content-heavy pages where possible (e.g., blog, FAQ).
    *   **Backend:** Use a combination of Next.js API routes and Cloudflare Workers for different parts of the backend logic.
        *   Next.js API routes are good for handling requests directly related to the frontend (e.g., user authentication, fetching user-specific data).
        *   Cloudflare Workers can be used for:
            *   Proxying and transforming requests to the LocalCoinSwap API. Interactions with Thorchain, ZetaChain, and Particle Network might be direct from the frontend/Next.js backend or via specific workers as needed for security or complex orchestration.
            *   Implementing caching logic.
            *   Handling dynamic content generation (e.g., multilingual translations, programmatically generated landing pages).
            *   Running background tasks (if needed).
    *   **Microservices (eventually):** As the application grows and you add more features (e.g., more payment gateways, direct integrations with blockchains), consider breaking down the backend into smaller, independent microservices. This will improve maintainability and scalability.
*   **Database Schema Design:**
    *   **Users:** `user_id` (primary key), `email` (if not solely relying on Particle for this), `particle_uuid` (string, from Particle userInfo, if needed for mapping), `profile_data` (potentially managed/augmented by Particle Network), `registration_date`, `kyc_status` (if applicable). Note: `password_hash` may become less relevant if primary auth is social/email via Particle.
    *   **Transactions:** `transaction_id` (primary key), `user_id` (foreign key), `type` (buy, sell, swap_thorchain, swap_zetachain_zrc20, deposit_zetachain, cctx_zetachain), `input_asset_symbol`, `input_amount`, `output_asset_symbol`, `output_amount`, `status`, `timestamp`, `blockchain_tx_id_inbound` (string), `blockchain_tx_id_outbound` (string, if applicable), `thorchain_details` (JSON), `zetachain_details` (JSON), `particle_details` (JSON, e.g. for AA UserOps).
    *   **Landing Pages:** `page_id` (primary key), `url_slug`, `content` (JSON or HTML), `geo_target`, `product_focus`, `last_updated`
    *   **Translations:** `translation_id` (primary key), `language_code`, `original_text`, `translated_text`, `source_page_id` (if applicable), `context`
    *   **If needed (for P2P matching, order books, etc.):** You'll need additional tables specific to how you implement P2P trading features. This might involve tables for offers, orders, escrow, etc.
*   **API Endpoints:**
    *   `/api/auth/*` (Next.js API routes for user authentication, integrating with Particle Network SDKs. Particle handles much of this client-side, but backend routes may be needed for custom logic or JWT validation.)
    *   `/api/user/*` (Next.js API routes for user data: get profile, update profile, etc.)
    *   `/api/transactions/*` (Next.js API routes for transaction history)
    *   `/api/proxy/localcoinswap/*` (Cloudflare Worker to proxy requests to the LocalCoinSwap API, potentially adding caching or transformation logic)
    *   `/api/swap/thorchain/*` (For operations like getting quotes, initiating swaps via Thorchain/XChainJS)
    *   `/api/swap/zetachain/*` (For operations related to ZetaChain, like ZRC-20 interactions or triggering omnichain contract calls)
    *   `/api/landing-pages/*` (Cloudflare Worker to serve dynamically generated landing pages)
    *   `/api/translate` (Cloudflare Worker to handle dynamic translations)

**Step 5: Develop the Application**

*   **Coding Standards:**
    *   **TypeScript:** Follow the official TypeScript style guide and use strict type checking.
    *   **Next.js:** Adhere to Next.js best practices (file structure, API routes, data fetching).
    *   **Tailwind CSS:** Use utility-first principles and maintain consistency in styling.
    *   **General:**
        *   Meaningful variable and function names.
        *   Consistent indentation (2 spaces).
        *   Keep functions small and focused.
        *   Add comments to explain complex logic.
        *   Use `Prettier` to enforce code formatting automatically.
        *   Use `ESLint` with a strict configuration to catch potential errors and style violations.

*   **AI Tools Integration:**
    *   **`cline` or `aider`:**
        *   I recommend using **`aider`** for most of the code generation tasks, as it's designed specifically for code and has features like context awareness and version control integration.
        *   Use `cline` if you need more general text generation or for tasks where you want a more conversational interaction with the LLM.
    *   **Integration Strategy:**
        *   **Initial setup:** Start by letting `aider` generate the basic project structure, components, and API routes.
        *   **Feature development:** Break down each feature into small, well-defined tasks and use `aider` to generate the code for each task. Provide clear instructions, code examples, and context from the existing codebase.
        *   **Refactoring:** Use `aider` to refactor code, improve code quality, or add comments.
        *   **Documentation:** `aider` can assist in generating initial code documentation (e.g., JSDoc).
        *   **Content generation (with `cline` or `aider`):** Use the tools to help generate content for landing pages, translations, or marketing materials. You might need to experiment to see which tool produces better results for these tasks.

*   **Feature Development Strategy:**
    *   **Prioritize:**
        1. **Landing Page:** Start with a basic landing page that directs users to either the P2P or DEX/aggregator sections.
        2. **Core Trading Functionality:** Implement basic integration with LocalCoinSwap. For DEX functionality, integrate Particle Network for authentication and wallet management, then implement core swap features using Thorchain (via XChainJS). Begin foundational work for ZetaChain interactions.
        3. **User Dashboard:** Create a simple dashboard to display transaction history.
        4. **Dynamic Landing Pages and Multilingual Support:** Implement these features after the core functionality is working.
    *   **Modular Design:**
        *   Create reusable UI components (buttons, forms, cards, etc.).
        *   Separate API interaction logic into separate modules or services (e.g., `ParticleAuthService`, `ThorchainService`, `ZetaChainService`).
        *   Use a state management library (e.g., `Zustand` or `Redux Toolkit`) if needed for managing complex application state.
    *   **API Integration:**
        *   Use LocalCoinSwap API examples as a guide for P2P integration.
        *   Integrate Particle Network SDKs for user authentication (social, email) and wallet management (WaaS, external wallet connections).
        *   Utilize XChainJS libraries to interact with Thorchain for fetching quotes, constructing transactions, and tracking status. This will involve using various `xchain-client` packages for different blockchains.
        *   Use ZetaChain SDKs/APIs to interact with the ZetaChain network for ZRC-20 management and potential omnichain smart contract calls. This may involve deploying and interacting with custom smart contracts on ZetaChain's zEVM.
        *   Cloudflare Workers may be used to proxy requests to LocalCoinSwap. Thorchain, ZetaChain, and Particle Network interactions will primarily be managed through their respective SDKs on the client-side or Next.js backend, with workers used for specific backend logic or security layers if necessary.
        *   For faster go to market, P2P can rely on LocalCoinSwap's existing model. For DEX, Thorchain offers affiliate fee options.
    *   **Dynamic Landing Pages:**
        *   Use Next.js's `getStaticPaths` and `getStaticProps` to pre-render landing pages at build time whenever possible.
        *   For pages that need to be generated on-demand (e.g., based on user location or very specific product combinations), use a Cloudflare Worker to generate the content dynamically.
        *   Store the generated content in Cloudflare Workers KV for fast retrieval.
        *   Use a headless CMS or a database to manage the content and rules for generating landing pages.
    *   **Multilingual Support:**
        *   Use a library like `next-i18next` to manage translations in your Next.js application.
        *   Initially, you might translate the most important content manually or using a translation service.
        *   For dynamic content or less critical content, experiment with using an LLM (via Cloudflare AI or other APIs) to generate translations on-the-fly. Cache these translations aggressively.
        *   Consider allowing users to contribute translations or flag incorrect translations.

**Step 6: Implement Testing**

*   **Testing Strategy:**
    *   **Unit Tests:** Test individual functions, components, and modules in isolation using `Vitest` or `Jest`.
    *   **Integration Tests:** Test the interaction between different parts of your application (e.g., API routes, services, database interactions) using `Vitest` or `Jest`.
    *   **End-to-End (E2E) Tests:** Test the entire application flow from the user's perspective using `Cypress`. Simulate user interactions and verify that everything works as expected.
*   **Testing Tools:**
    *   **`Vitest`** or **`Jest`:** For unit and integration testing.
    *   **`Cypress`:** For E2E testing.
    *   **`@testing-library/react`:** For testing React components in a way that resembles how users interact with them.

**Step 7: Set Up CI/CD Pipeline**

*   **CI/CD Tool:** GitHub Actions (since you're already using GitHub).
*   **Automation:**
    *   **Testing:** Automatically run unit, integration, and E2E tests on every push or pull request.
    *   **Linting:** Run `ESLint` and `Prettier` to enforce code style and quality.
    *   **Deployment:**
        *   **Staging:** Automatically deploy to a staging environment on Cloudflare on every push to the `main` branch (or a dedicated staging branch).
        *   **Production:** Deploy to production on Cloudflare after a manual approval or a specific trigger (e.g., creating a release tag on GitHub).

**Step 8: Prepare for Deployment**

*   **Environment Configuration:**
    *   Use environment variables to configure different settings for development, staging, and production (e.g., API keys, database credentials, feature flags).
    *   GitHub Actions allows you to define environment variables for each environment.
    *   Cloudflare also supports environment variables for Workers.
*   **Performance Optimization:**
    *   **Code Splitting:** Next.js automatically performs code splitting, which helps reduce the initial bundle size.
    *   **Image Optimization:** Use Next.js's `Image` component for automatic image optimization.
    *   **Caching:**
        *   Use Cloudflare Workers KV to cache API responses, dynamic content, and translations.
        *   Configure appropriate caching headers for static assets.
        *   Use browser caching where possible.
    *   **Lazy Loading:** Load components and data only when they are needed.
    *   **Minification:** Minify your JavaScript, CSS, and HTML. (Next.js does this automatically in production builds).

**Step 9: Deploy the Application**

*   **Hosting Provider:** Cloudflare (Pages for the frontend, Workers for the backend).
*   **Containerization:** Not necessary for this project since you're using serverless technologies.
*   **Load Balancing and Scalability:** Cloudflare handles load balancing and scaling automatically. Your application will be distributed across Cloudflare's global network of data centers.

**Step 10: Monitor and Maintain the App**

*   **Monitoring Tools:**
    *   **Cloudflare Analytics:** Provides insights into traffic, performance, and security.
    *   **GitHub Issues:** Track bugs, feature requests, and other issues.
    *   **Sentry (optional):** For real-time error tracking and monitoring.
*   **Alerting Mechanisms:**
    *   Cloudflare can send email notifications for certain events (e.g., security alerts, worker errors).
    *   Sentry can also be configured to send alerts.
    *   You can create custom alerting mechanisms using Cloudflare Workers (e.g., based on metrics or logs).
*   **Maintenance Plan:**
    *   Regularly update dependencies to their latest versions.
    *   Monitor for security vulnerabilities and apply patches promptly.
    *   Review and refactor code periodically to improve maintainability.
    *   Address user feedback and iterate on existing features.
    *   Plan for future expansion (more payment methods, blockchain integrations, etc.).

**Step 11: Ensure Security**

*   **Secure Coding Practices:**
    *   **Input Validation:** Validate all user inputs on both the client-side and server-side to prevent injection attacks.
    *   **Output Encoding:** Encode all data rendered on the client-side to prevent cross-site scripting (XSS) attacks.
    *   **Authentication and Authorization:** Use secure authentication mechanisms (e.g., JWT, OAuth 2.0) and implement proper authorization to restrict access to sensitive data and functionality.
    *   **Data Protection:** Encrypt sensitive data at rest and in transit (Cloudflare provides HTTPS automatically).
    *   **Dependency Management:** Regularly update dependencies to patch known vulnerabilities. Use tools like `npm audit` or `yarn audit` to check for vulnerabilities.
    *   **Least Privilege:** Grant users and services only the minimum necessary permissions.
    *   **OWASP Top 10:** Familiarize yourself with the OWASP Top 10 web application security risks and take steps to mitigate them.
    *   **Specific Technology Considerations:**
        *   **Particle Network:** Understand the security model of Wallet-as-a-Service, master password, payment password, and social recovery mechanisms. Securely handle any client-side SDK configurations.
        *   **Thorchain/XChainJS:** Ensure correct memo construction for all transactions to avoid fund loss. Validate inputs thoroughly before interacting with XChainJS clients. Manage private keys/phrases securely if not using Particle's WaaS exclusively for signing.
        *   **ZetaChain:** If deploying custom zEVM smart contracts, follow Solidity security best practices (e.g., OpenZeppelin contracts, reentrancy guards, thorough testing, audits). Validate all inputs and outputs for CCTX interactions.
*   **Data Privacy Compliance:**
    *   **GDPR:**
        *   Obtain explicit consent for collecting and processing user data.
        *   Provide users with the ability to access, rectify, and erase their data.
        *   Implement data minimization principles (collect only the data you need).
        *   Have a clear privacy policy that explains how you collect, use, and protect user data.
    *   **Other Regulations:** Be aware of other data privacy regulations that may apply to your target audience (e.g., CCPA in California).
*   **Security Testing:**
    *   **Static Code Analysis:** Use tools like `SonarQube` or `GitHub's built-in code scanning` to automatically analyze your code for security vulnerabilities.
    *   **Penetration Testing:** Consider hiring a security professional to perform penetration testing to identify vulnerabilities that automated tools might miss.
    *   **Dynamic Application Security Testing (DAST):** Use tools like `OWASP ZAP` to scan your running application for vulnerabilities.

**Step 12: Gather User Feedback and Iterate**

*   **Feedback Collection:**
    *   **In-App Feedback Form:** Integrate a simple feedback form or widget into your application.
    *   **Surveys:** Send out occasional surveys to gather more detailed feedback.
    *   **User Forums or Communities:** Create a forum or community where users can discuss the application and provide feedback.
    *   **Social Media Monitoring:** Monitor social media for mentions of your application.
*   **Continuous Improvement:**
    *   Use a project management tool (e.g., GitHub Projects, Jira) to track feedback and prioritize improvements.
    *   Regularly review user feedback and identify common themes or pain points.
    *   Iterate on existing features and add new features based on user feedback and market trends.
    *   Use A/B testing to experiment with different approaches and optimize the user experience.

**Step 13: Documentation**

*   **Code Documentation:**
    *   Use JSDoc to document your TypeScript code.
    *   Generate API documentation from your JSDoc comments using a tool like `Typedoc`.
    *   `aider` can help you generate initial JSDoc comments.
*   **Deployment Documentation:**
    *   Create a `README.md` file in your GitHub repository that explains how to build, test, and deploy the application.
    *   Document the environment variables and configuration settings required for each environment.
    *   Document the CI/CD pipeline and any manual steps involved in deployment.
*   **User Documentation:**
    *   Create a separate website or section within your application for user documentation (using Next.js, you can easily create static pages for this).
    *   Provide clear and concise instructions on how to use the different features of the application.
    *   Include screenshots or videos to illustrate key concepts.
    *   Create an FAQ section to address common questions.
    *   Use the provided LocalCoinSwap FAQs and create new FAQs relevant to Particle Network wallet usage, Thorchain swaps, and any ZetaChain functionalities.

**Step 14: Compliance and Legal Considerations**

*   **Legal Agreements:**
    *   **Terms of Service:** Based on the provided links, create a Terms of Service agreement that covers the usage of your platform, including both P2P and DEX/aggregator functionalities. Address disclaimers, limitations of liability, user responsibilities, and dispute resolution.
    *   **Privacy Policy:** Create a comprehensive Privacy Policy that explains how you collect, use, store, and protect user data. Be transparent about your data practices and comply with relevant regulations (e.g., GDPR, CCPA).
*   **Open Source Licensing:**
    *   Use a tool like `FOSSA` or `Snyk` to scan your dependencies and identify their licenses.
    *   Ensure that you comply with the terms of all open-source licenses used in your project.
    *   If you release any of your own code as open source, choose an appropriate license (e.g., MIT, Apache 2.0).

**Step 15: Scale and Optimize**

*   **Scalability Strategy:**
    *   **Horizontal Scaling:** Cloudflare's infrastructure automatically handles horizontal scaling by distributing traffic across multiple servers.
    *   **Vertical Scaling:** For Cloudflare Workers, you can increase the memory limit if needed. For databases, you might need to choose a more powerful plan or use read replicas.
*   **Caching Mechanisms:**
    *   **Cloudflare Workers KV:** Use it to cache API responses, dynamic content (e.g., generated landing pages, translations), and frequently accessed data.
    *   **Cloudflare Cache:** Configure Cloudflare's caching rules to cache static assets (e.g., images, CSS, JavaScript).
    *   **Browser Caching:** Set appropriate caching headers to allow browsers to cache content.
*   **Content Delivery Network (CDN):** Cloudflare acts as a CDN, so you don't need to set up a separate CDN.

**Prompt Chain Examples (using `aider`)**

*Note: The following prompt chain examples are illustrative and were based on the previous Rango Exchange integration. They will need to be significantly updated or replaced to reflect the new technology stack: Particle Network, Thorchain/XChainJS, and ZetaChain. New prompt chains will be developed as these features are implemented in later plan steps.*

**Chain 1: Initial Project Setup**

1. **Prompt:**

    ```
    Create a new Next.js project using TypeScript and Tailwind CSS. 
    The project should be called "unified-crypto-exchange."
    /file  package.json
    ```
2. **Prompt:**

    ```
    /add  pages/index.tsx
    Create a basic landing page component in `pages/index.tsx`. 
    The page should have a title "Unified Crypto Exchange" and a brief description of the platform.
    Use Tailwind CSS for styling.
    ```
3. **Prompt:**

    ```
    /add  pages/api/hello.ts
    Create a simple Next.js API route in `pages/api/hello.ts` that returns a JSON response: `{ "message": "Hello from the API!" }`
    ```

**Chain 2: P2P Trading Feature (Basic)**

1. **Prompt:**

    ```
    /add  pages/p2p.tsx
    Create a new page component in `pages/p2p.tsx` for the P2P trading section. 
    Add a heading "P2P Crypto Exchange" and a placeholder message "P2P trading coming soon..."
    ```
2. **Prompt:**

    ```
    /add lib/localcoinswap.ts
    Create a file `lib/localcoinswap.ts` to interact with the LocalCoinSwap API.
    Add a function `getOffers()` that fetches a list of offers from the API endpoint `/api/offers`.
    Assume the API key is stored in an environment variable `LOCALCOINSWAP_API_KEY`.
    Use the `fetch` API for making HTTP requests.
    ```
3. **Prompt:**

    ```
    Modify `pages/p2p.tsx` to fetch offers using the `getOffers()` function from `lib/localcoinswap.ts` on the server-side (using `getServerSideProps`).
    Display the fetched offers in a simple list format.
    ```

**Chain 3: User Dashboard**

1. **Prompt:**

    ```
    /add pages/dashboard.tsx
    Create a new page component in `pages/dashboard.tsx` for the user dashboard.
    Add a heading "User Dashboard" and a placeholder message "User dashboard coming soon..."
    ```
2. **Prompt:**

    ```
    /add lib/db.ts
    Create a file `lib/db.ts` to interact with the database.
    Add a function `getUserTransactions(userId: string)` that retrieves a list of transactions for a given user ID from the "transactions" table.
    Assume you are using Cloudflare Workers KV for now and the data is stored in JSON format.
    ```
3. **Prompt:**

    ```
    Modify `pages/dashboard.tsx` to fetch the user's transactions using the `getUserTransactions()` function from `lib/db.ts` on the server-side (using `getServerSideProps`).
    Display the transactions in a table format.
    Assume the user ID is passed as a query parameter or is available from the authentication context.
    ```

**Chain 4: Dynamic Landing Page**

1. **Prompt:**

    ```
    /add lib/landingPages.ts
    Create a file `lib/landingPages.ts` to handle dynamic landing page generation.
    Add a function `getLandingPage(slug: string)` that retrieves the content for a landing page based on its URL slug from the "landing_pages" table (in Cloudflare Workers KV).
    If the landing page is not found, return a default landing page content.
    ```
2. **Prompt:**

    ```
    /add pages/landing/[slug].tsx
    Create a dynamic route in `pages/landing/[slug].tsx` that uses `getStaticPaths` to pre-render a list of landing pages at build time (fetch the list of slugs from the database).
    Use `getStaticProps` to fetch the landing page content using the `getLandingPage()` function for each slug.
    Render the content in a suitable layout.
    ```
3. **Prompt:**

    ```
    Create a Cloudflare Worker (in a separate file, e.g., `workers/landingPageWorker.ts`) that handles requests for landing pages that were not pre-rendered.
    The worker should:
      - Extract the slug from the request URL.
      - Call the `getLandingPage()` function to retrieve the content.
      - If the content is found, return it with appropriate caching headers.
      - If the content is not found, either return a 404 error or redirect to a default landing page.
    Deploy this worker and configure it to handle requests to `/landing/*`.
    ```

**Chain 5: Multilingual Support**

1. **Prompt:**

    ```
    Integrate `next-i18next` into the project for multilingual support.
    Add translation files for English (`en`) and at least one other language (e.g., Spanish `es`) in the `public/locales` directory.
    Translate the title and description on the main landing page (`pages/index.tsx`).
    ```
2. **Prompt:**

    ```
    /add lib/translate.ts
    Create a file `lib/translate.ts` to handle dynamic translations using an LLM.
    Add a function `translateText(text: string, targetLanguage: string)` that sends a request to an LLM API (e.g., Cloudflare AI) to translate the given text to the target language.
    ```
3. **Prompt:**

    ```
    Create a Cloudflare Worker (e.g., `workers/translateWorker.ts`) that exposes an API endpoint `/api/translate`.
    The worker should:
      - Accept POST requests with a JSON body containing the text to translate and the target language.
      - Call the `translateText()` function to perform the translation.
      - Cache the translated text in Workers KV to avoid redundant translations.
      - Return the translated text in the response.
    ```

**Example of a full prompt for creating a component (using `aider`)**

```
/add components/TradeForm.tsx
Create a React functional component called 'TradeForm' that allows users to place buy or sell orders on the P2P exchange.

Follow these conventions:
- Use functional components with hooks.
- Use camelCase for variable and function names.
- Indent with 2 spaces.
- Include a brief comment explaining the component's purpose.
- Use Tailwind CSS for styling.

The component should have the following input fields:
- Order Type: A dropdown to select "Buy" or "Sell".
- Cryptocurrency: A dropdown to select the cryptocurrency (e.g., BTC, ETH).
- Amount: A number input for the amount of cryptocurrency to trade.
- Payment Method: A dropdown to select the payment method (e.g., Bank Transfer, PayPal).
- Price: A number input for the desired price (only shown for limit orders).
- Order Type: A radio button to choose between "Market" or "Limit" orders.

The component should also have a "Place Order" button.

When the "Place Order" button is clicked, the component should:
- Validate the input fields.
- If the input is valid, call a function `placeOrder` (which you can assume is defined elsewhere) with the order details.
- Display a success message if the order is placed successfully.
- Display an error message if there is an error.

Use appropriate state management (e.g., `useState` or a state management library like `Zustand`) to manage the form data and the order placement status.
```

**Important Considerations:**

*   **Security:** This is a high-level overview. Security is paramount in a crypto exchange. You'll need to thoroughly research and implement robust security measures throughout the application.
*   **Regulations:** Be aware of the legal and regulatory requirements for operating a crypto exchange in your jurisdiction.
*   **Scalability:** While Cloudflare provides good scalability, you should design your application with scalability in mind. Consider using a message queue (e.g., Cloudflare Queues) for asynchronous tasks and a database that can handle a large volume of transactions.
*   **Testing:** Write comprehensive tests at all levels (unit, integration, E2E) to ensure the application works correctly and securely.