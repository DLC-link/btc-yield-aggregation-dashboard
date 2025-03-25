import { usePoolsContext } from '../contexts/PoolsContext';

export function useTopYieldPools() {
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

  const minTvlUsd = 50 * 20000; // 50 BTC * current BTC price (approximated)

  const filteredPools = pools
    .filter(pool => pool.tvlUsd >= minTvlUsd)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 5);

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
