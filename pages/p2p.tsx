import { GetServerSideProps, NextPage } from 'next';
import { getOffers } from '../lib/localcoinswap';

interface Offer {
  id: string;
  type: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

interface Props {
  offers: Offer[];
}

const P2P: NextPage<Props> = ({ offers }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">P2P Crypto Exchange</h1>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id}>
            {offer.type} {offer.amount} {offer.currency} via {offer.paymentMethod}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const offers = await getOffers();
  return {
    props: {
      offers,
    },
  };
};

export default P2P;
