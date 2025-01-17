import React from 'react';
import { GetServerSideProps } from 'next';
import { getOffers } from '../lib/localcoinswap';
import { Offer } from '../types/localcoinswap';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface P2PPageProps {
  offers: Offer[];
}

const P2PPage: React.FC<P2PPageProps> = ({ offers }) => {
  const { t } = useTranslation('common');
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('p2p.heading')}</h1>
      <p className="mb-4">
      {t('p2p.description')}
      </p>
      {/* Display offers */}
      <div className="bg-gray-100 p-4 rounded">
        {offers.length > 0 ? (
          <ul>
            {offers.map((offer) => (
              <li key={offer.uuid} className="mb-2">
                {offer.coin_currency.symbol} / {offer.fiat_currency.symbol} -{' '}
                {offer.trading_type.name} ({offer.payment_method.name})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">{t('p2p.noOffers')}</p>
        )}
      </div>
    </div>
  );
};

import { GetServerSideProps } from 'next';
import { getOffers } from '../lib/localcoinswap';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Offer } from '../types/localcoinswap';

interface P2PPageProps {
  offers: Offer[];
}

export const getServerSideProps: GetServerSideProps<P2PPageProps> = async ({ locale, locales, defaultLocale }) => {
  const offers = await getOffers();

  return {
    props: {
      offers,
      ...(await serverSideTranslations(locale as string, ['common'], null, locales)),
    },
  };
};

export default P2PPage;
