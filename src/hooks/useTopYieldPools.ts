import { usePoolsContext } from '../contexts/PoolsContext';
import { Pool, TopYieldPoolsData } from '../types/chart';
import { MIN_TVL_USD, TOP_POOLS_COUNT } from '../constants/config';

export function useTopYieldPools(): TopYieldPoolsData {
  const { pools, isLoading, isError, error } = usePoolsContext();

  if (isLoading || isError) {
    return {
      topYieldPools: [],
      totalTVL: 0,
      averageAPY: 0,
      isLoading,
      isError,
      error,
    };
  }

  const filteredPools = pools
    .filter(pool => pool.tvlUsd >= MIN_TVL_USD)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, TOP_POOLS_COUNT);

  const totalTVL = filteredPools.reduce((sum, pool) => sum + pool.tvlUsd, 0);
  const averageAPY = filteredPools.reduce((sum, pool) => sum + pool.apy, 0) / filteredPools.length;

  return {
    topYieldPools: filteredPools,
    totalTVL,
    averageAPY,
    isLoading,
    isError,
    error,
  };
}
