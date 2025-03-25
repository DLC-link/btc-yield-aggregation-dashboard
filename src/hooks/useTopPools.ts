import { usePools } from './usePools';
import { Pool } from '../types/Pool';

export function useTopPools() {
  const { pools, isLoading, isError, error } = usePools();

  const topPools = pools.slice(0, 5).reduce(
    (acc, pool) => {
      return {
        pools: [...acc.pools, pool],
        totalTVL: acc.totalTVL + pool.tvlUsd,
      };
    },
    { pools: [] as Pool[], totalTVL: 0 }
  );

  return {
    topPools: topPools.pools,
    topPoolsTotalTVL: topPools.totalTVL,
    isLoading,
    isError,
    error,
  };
}
