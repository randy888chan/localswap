export interface Offer {
  trading_type: {
    slug: string;
    name: string;
    opposite_name: string;
  };
  uuid: string;
  coin_currency: {
    title: string;
    symbol: string;
    symbol_filename: string;
    is_crypto: boolean;
  };
  fiat_currency: {
    title: string;
    symbol: string;
    symbol_filename: string | null;
    is_crypto: boolean;
  };
  payment_method: {
    name: string;
    slug: string;
  };
  country_code: string;
  min_trade_size: number;
  max_trade_size: number;
  trading_conditions: string;
  headline: string;
  hidden: boolean;
  enforced_sizes: string;
  automatic_cancel_time: number;
  sms_required: boolean;
  minimum_feedback: number;
  custodial_type: number;
}
