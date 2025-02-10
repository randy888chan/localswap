import { Metadata, ResolvingMetadata } from 'next';
import { fetchCoinData } from '@/lib/coin-api';
import CoinTradingWidget from '@/components/CoinTradingWidget';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const coin = await fetchCoinData(params.slug);
  
  return {
    title: `${coin.name} (${coin.symbol}) Trading | Buy/Sell ${coin.symbol} Securely`,
    description: `Best rates for ${coin.name} (${coin.symbol}) across centralized exchanges and DEX pools. Trade ${coin.symbol} with low fees.`,
    openGraph: {
      images: [coin.image.large],
    },
    alternates: {
      canonical: `${process.env.SITE_URL}/coins/${params.slug}`,
    },
  };
}

export default function CoinPage({ params }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CoinTradingWidget coinSlug={params.slug} />
    </div>
  );
}
