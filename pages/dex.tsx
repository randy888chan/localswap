import React from 'react';
import { GetServerSideProps } from 'next';
import { getSwapQuote } from '../lib/rango';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface DEXPageProps {
  quote: any; // Replace 'any' with a more specific type later
}

const DEXPage: React.FC<DEXPageProps> = ({ quote }) => {
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('dex.heading')}</h1>
      <p className="mb-4">
      {t('dex.description')}
      </p>
      {/* Placeholder UI elements */}
      <div className="bg-gray-100 p-4 rounded">
        {quote ? (
          <div>
            <p>{t('dex.from')}: {quote.from.blockchain} {quote.from.symbol}</p>
            <p>{t('dex.to')}: {quote.to.blockchain} {quote.to.symbol}</p>
            <p>{t('dex.amount')}: {quote.requestAmount}</p>
            <p>{t('dex.estimatedOutput')}: {quote.result.outputAmount}</p>
            {/* Add more details from the quote as needed */}
          </div>
        ) : (
          <p className="text-gray-500">
            {t('dex.comingSoon')}
          </p>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { GetServerSideProps } from 'next';
import { getSwapQuote } from '../lib/rango';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface DEXPageProps {
  quote: any; // Replace 'any' with a more specific type later
}

export const getServerSideProps: GetServerSideProps<DEXPageProps> = async ({ locale, locales, defaultLocale }) => {
  // Fetch a mock swap quote for now
  const quote = await getSwapQuote('BSC', 'AVAX_CCHAIN', '1');

  return {
    props: {
      quote,
      ...(await serverSideTranslations(locale as string, ['common'], null, locales)),
    },
  };
};

export default DEXPage;
