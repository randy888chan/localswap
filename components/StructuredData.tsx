'use client';

import { WebSite, Organization } from 'schema-dts';

const SITE_NAME = "Unified Crypto Exchange";
const SITE_URL = process.env.SITE_URL || "https://cryptoexchange.com";
const BASE_DESCRIPTION = "Secure cross-chain cryptocurrency trading platform with best rates across 50+ blockchain networks";

export default function StructuredData() {
  const schema: WebSite & Organization = {
    '@context': 'https://schema.org',
    '@type': ['WebSite', 'Organization'],
    name: SITE_NAME,
    alternateName: process.env.SITE_NAME_ALT,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: BASE_DESCRIPTION,
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/YourExchange',
      'https://github.com/YourExchange'
    ],
    potentialAction: {
      '@type': 'TradeAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/trade?from={fromCurrency}&to={toCurrency}`,
        'inLanguage': 'eng'
      }
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
