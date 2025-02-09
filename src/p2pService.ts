import { encrypt } from './encryption';
import axios from 'axios';
import { Psbt, networks, payments } from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const LCS_API = "https://api.localcoinswap.com/v2";
const ECPair = ECPairFactory(ecc);

interface P2POffer {
  id: string;
  cryptocurrency: string;
  fiatCurrency: string;
  minAmount: number;
  maxAmount: number;
  price: number;
  paymentMethods: string[];
}

export class P2PService {
  static async fetchOffers(params?: {
    coin?: string;
    type?: 'buy'|'sell';
  }): Promise<P2POffer[]> {
    const response = await axios.get(`${LCS_API}/p2p/offers/`, { params });
    return response.data.results.map((offer: any) => ({
      id: offer.id,
      cryptocurrency: offer.cryptocurrency,
      fiatCurrency: offer.fiat_currency,
      minAmount: parseFloat(offer.min_amount),
      maxAmount: parseFloat(offer.max_amount),
      price: parseFloat(offer.price),
      paymentMethods: offer.payment_methods
    }));
  }

  static async createCommitment(accountKey: string) {
    const keyPair = ECPair.makeRandom({ network: networks.bitcoin });
    const psbt = new Psbt({ network: networks.bitcoin });
    psbt.addOutput({ script: Buffer.from(''), value: 1000 })
       .signInput(0, keyPair);
    return psbt.toHex();
  }

  static async tradeCommitment(
    offerId: string, 
    accountKey: string,
    amount: number
  ) {
    const response = await axios.post(`${LCS_API}/p2p/trades/`, {
      offer: offerId,
      amount,
      commitment: await this.createCommitment(accountKey),
      encrypted_secret: encrypt(JSON.stringify({
        secret: crypto.randomUUID(),
        timestamp: Date.now()
      }), accountKey)
    }, {
      headers: {
        'Authorization': `Token ${accountKey}`,
        'X-Account-Key': accountKey
      }
    });

    return {
      ...response.data,
      secret: JSON.parse(decrypt(response.data.encrypted_secret, accountKey)).secret
    };
  }
}
