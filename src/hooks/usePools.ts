import { useQuery } from '@tanstack/react-query';
import { Pool } from '../types/Pool';

export function usePools() {
  const { data, isLoading, isError, error } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: async () => {
      const response = await fetch('https://yields.llama.fi/pools');
      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }
      const data = await response.json();
      const btcPools = data.data
        .filter((pool: Pool) => pool.symbol.includes('BTC'))
        .sort((a: Pool, b: Pool) => b.tvlUsd - a.tvlUsd);
      return btcPools;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  return {
    pools: data || [],
    isLoading,
    isError,
    error,
  };
}

// Keep the original function for backward compatibility
export function useProtocols() {
  const { pools, isLoading, isError, error } = usePools();
  return {
    protocols: pools,
    isLoading,
    isError,
    error,
  };
}
