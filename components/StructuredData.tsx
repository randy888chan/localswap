'use client';

import { WebSite, Organization } from 'schema-dts';

const SITE_NAME = "Unified Crypto Exchange";
const SITE_URL = process.env.SITE_URL || "https://cryptoexchange.com";
const BASE_DESCRIPTION = "Secure cross-chain cryptocurrency trading platform with best rates across 50+ blockchain networks";

// Only include URLs that exist
const validSocialLinks = [
  'https://twitter.com/YourExchange',
  'https://github.com/YourExchange'
].filter(Boolean);

export default function StructuredData() {
  const websiteSchema: WebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "TradeAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/trade?from={fromCurrency}&to={toCurrency}`
      }
    }
  };

  const orgSchema: Organization = {
    "@context": "https://schema.org", 
    "@type": "Organization",
    "name": SITE_NAME,
    "logo": `${SITE_URL}/logo.svg`,
    "foundingDate": "2023-07-01", // Use actual date in YYYY-MM-DD
    "sameAs": validSocialLinks
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
    </>
  );
}
