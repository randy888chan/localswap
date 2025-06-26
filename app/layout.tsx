import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header"; // Import the Header component
import { ParticleAuthProvider } from "@/components/ParticleAuthContext"; // Import the Auth Provider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Config
const SITE_NAME = "Unified Crypto Exchange";
const SITE_URL = process.env.SITE_URL || "https://cryptoexchange.com";
const BASE_DESCRIPTION = "Secure cross-chain cryptocurrency trading platform with best rates across 50+ blockchain networks";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - P2P & Cross-Chain Trading Platform`,
  },
  description: BASE_DESCRIPTION,
  keywords: ["crypto exchange", "bitcoin trading", "cross-chain swap", "defi platform"],
  
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `${SITE_NAME} - P2P & Cross-Chain Trading Platform`,
    },
    description: BASE_DESCRIPTION,
    images: [{
      url: '/og-main.png',
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} Interface Preview`,
    }]
  },
  
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Top Security Crypto Exchange`,
    description: BASE_DESCRIPTION,
    images: ['/og-twitter.png'],
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ParticleAuthProvider> {/* Wrap with ParticleAuthProvider */}
          <Header />
          <main>{children}</main>
        </ParticleAuthProvider>
      </body>
    </html>
  );
}
