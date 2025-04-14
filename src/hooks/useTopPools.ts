import { useMemo } from 'react';
import { TopPoolsData } from '../types/chart';
import { usePoolsContext } from '../contexts/PoolsContext';
import { calculateTotalTVL } from '../utils/calculations';

export const useTopPools = (): TopPoolsData => {
  const { pools, isLoading, isError, error } = usePoolsContext();

  const topPools = useMemo(() => {
    // Filter pools with BTC in the symbol and sort by TVL
    return pools
      .filter(pool => pool.symbol.includes('BTC'))
      .sort((a, b) => b.tvlUsd - a.tvlUsd);
  }, [pools]);

  const totalTVL = useMemo(() => calculateTotalTVL(topPools), [topPools]);

  return {
    topPools,
    totalTVL,
    isLoading,
    isError,
    error
  };
};
