export interface Protocol {
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  methodology: string;
  slug: string;
  tvl: number;
  chainTvls: {
    [chainName: string]: number;
  };
  change_1h: number;
  change_1d: number;
  change_7d: number;
  tokenBreakdowns: Record<string, unknown>;
  mcap: number | null;
}
