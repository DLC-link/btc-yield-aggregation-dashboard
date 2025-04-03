import { usePoolsContext } from '../contexts/PoolsContext';
import { Pool, TopYieldPoolsData } from '../types/chart';
import { TOP_POOLS_COUNT } from '../constants/config';
import { useBtcPrice } from './useBtcPrice';

export function useTopYieldPools(): TopYieldPoolsData {
  const { pools, isLoading: isPoolsLoading, isError: isPoolsError, error: poolsError } = usePoolsContext();
  const { btcPrice, isLoading: isPriceLoading } = useBtcPrice();

  const isLoading = isPoolsLoading || isPriceLoading;
  const isError = isPoolsError;
  const error = poolsError;

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

  const minTVLInBTC = 50; // 50 BTC minimum
  const minTVLInUSD = minTVLInBTC * btcPrice;

  const filteredPools = pools
    .filter(pool =>
      pool.tvlUsd >= minTVLInUSD &&
      pool.symbol.toUpperCase().includes('BTC')
    )
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
