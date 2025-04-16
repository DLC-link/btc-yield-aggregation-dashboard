import { usePoolsContext } from '../contexts/PoolsContext';
import { TopYieldPoolsData } from '../types/chart';
import { useBtcPrice } from './useBtcPrice';

export type SortField = 'tvlUsd' | 'apy';
export type SortDirection = 'asc' | 'desc';

export function useTopYieldPools(
  sortField: SortField = 'apy',
  sortDirection: SortDirection = 'desc'
): TopYieldPoolsData {
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
    );
    
  // Sort the pools based on the provided sort field and direction
  const sortedPools = [...filteredPools].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (sortDirection === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  const totalTVL = filteredPools.reduce((sum, pool) => sum + pool.tvlUsd, 0);
  const averageAPY = filteredPools.reduce((sum, pool) => sum + pool.apy, 0) / filteredPools.length;

  return {
    topYieldPools: sortedPools,
    totalTVL,
    averageAPY,
    isLoading,
    isError,
    error,
  };
}
