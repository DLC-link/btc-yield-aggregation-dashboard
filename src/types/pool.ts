export interface PoolPredictions {
  predictedClass: string;
  predictedProbability: number;
  binnedConfidence: number;
  apy: number;
  tvl: number;
}

export interface Pool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  rewardTokens: string[] | null;
  apyPct1D: number;
  apyPct7D: number;
  apyPct30D: number;
  stablecoin: boolean;
  ilRisk: 'yes' | 'no' | 'all';
  exposure: string;
  predictions: PoolPredictions;
  growthRate: number;
  poolMeta: string | null;
  mu: number;
  sigma: number;
  count: number;
  outlier: boolean;
  underlyingTokens: string[];
  il7d: number | null;
  apyBase7d: number | null;
  apyMean30d: number;

  volumeUsd1d: number | null;
  volumeUsd7d: number | null;

  apyBaseInception: number | null;
}


export interface FilterContextValue {
  filteredPoolIds: string[];
  setFilteredPoolIds: (id: string[]) => void;
}
