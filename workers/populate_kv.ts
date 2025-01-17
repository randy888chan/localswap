import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  LANDING_PAGES: KVNamespace;
}

const landingPageData = [
  {
    "page_id": "p2p-buy-btc-usd-usa",
    "url_slug": "/p2p/buy-bitcoin-usd-usa",
    "title": "Buy Bitcoin (BTC) with USD in the USA | Unified Crypto Exchange",
    "description": "Instantly buy Bitcoin (BTC) with US Dollars (USD) in the USA using various payment methods on our secure and reliable P2P crypto exchange.",
    "h1": "Buy Bitcoin with USD in the USA",
    "content": {
      "hero": {
        "headline": "Buy Bitcoin with USD in the USA Instantly",
        "subheading": "Get the best rates and enjoy fast, secure transactions on our P2P crypto exchange.",
        "cta_text": "Start Trading",
        "cta_link": "/p2p"
      },
      "benefits": [
        {
          "heading": "Trade Directly with Other Users",
          "text": "Avoid high exchange fees by trading directly with other users on our P2P platform."
        },
        {
          "heading": "Secure Escrow Service",
          "text": "Your funds are protected by our secure escrow service until the transaction is complete."
        },
        {
          "heading": "Wide Range of Payment Methods",
          "text": "We support various payment methods, including bank transfer, PayPal, and more."
        }
      ],
      "faq": [
        {
          "question": "How long does it take to buy Bitcoin with USD?",
          "answer": "Transactions are usually completed within minutes, depending on the seller's responsiveness and the payment method used."
        },
        {
          "question": "What are the fees for buying Bitcoin on your platform?",
          "answer": "Our P2P platform charges a small fee, typically around 1%, which is lower than most traditional exchanges."
        }
      ]
    }
  },
  {
    "page_id": "dex-swap-eth-btc-ethereum",
    "url_slug": "/dex/swap-eth-btc-ethereum",
    "title": "Swap Ethereum (ETH) to Bitcoin (BTC) on Ethereum | Unified Crypto Exchange",
    "description": "Instantly swap Ethereum (ETH) to Bitcoin (BTC) on the Ethereum blockchain using our secure and reliable DEX aggregator.",
    "h1": "Swap Ethereum to Bitcoin on Ethereum",
    "content": {
      "hero": {
        "headline": "Swap Ethereum to Bitcoin on Ethereum Instantly",
        "subheading": "Get the best rates and enjoy fast, secure transactions on our DEX aggregator.",
        "cta_text": "Start Swapping",
        "cta_link": "/dex"
      },
      "benefits": [
        {
          "heading": "Cross-Chain Swaps",
          "text": "Swap tokens across different blockchains with ease."
        },
        {
          "heading": "Best Rates Guaranteed",
          "text": "Our aggregator finds the best rates for your swaps."
        },
        {
          "heading": "Secure and Reliable",
          "text": "Enjoy secure and reliable transactions on our platform."
        }
      ],
      "faq": [
        {
          "question": "How long does it take to swap ETH to BTC?",
          "answer": "Transactions are usually completed within minutes, depending on the network congestion."
        },
        {
          "question": "What are the fees for swapping tokens on your platform?",
          "answer": "Our DEX aggregator charges a small fee, typically around 0.1%, which is lower than most traditional exchanges."
        }
      ]
    }
  }
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'POST') {
      for (const page of landingPageData) {
        await env.LANDING_PAGES.put(page.page_id, JSON.stringify(page));
      }
      return new Response('Landing page data populated successfully!');
    } else {
      return new Response('Invalid request method', { status: 405 });
    }
  },
};
