import { useQuery } from '@tanstack/react-query';
import { Pool } from '../types/pool_temp';
import { PoolData } from '../types/chart';
import { fetchPools } from '../services/api';
import { QUERY_CONFIG } from '../constants/config';

export function usePools(): PoolData {
  const { data, isLoading, isError, error } = useQuery<Pool[]>({
    queryKey: ['pools'],
    queryFn: fetchPools,
    ...QUERY_CONFIG
  });

  return {
    pools: data || [],
    isLoading,
    isError,
    error
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
