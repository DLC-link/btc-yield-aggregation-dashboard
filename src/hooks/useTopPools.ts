import { usePools } from './usePools';
import { Pool, TopPoolsData } from '../types/chart';
import { TOP_POOLS_COUNT } from '../constants/config';

export function useTopPools(): TopPoolsData {
  const { pools, isLoading, isError, error } = usePools();

  const topPools = pools
    .slice(0, TOP_POOLS_COUNT)
    .reduce((acc, pool) => {
      return {
        pools: [...acc.pools, pool],
        totalTVL: acc.totalTVL + pool.tvlUsd,
      };
    }, { pools: [] as Pool[], totalTVL: 0 });

  return {
    topPools: topPools.pools,
    totalTVL: topPools.totalTVL,
    isLoading,
    isError,
    error,
  };
}
