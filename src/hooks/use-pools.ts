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
            // Filter pools that contain 'BTC' in their symbol
            const btcPools = data.data.filter((pool: Pool) =>
                pool.symbol.toUpperCase().includes('BTC')
            );
            // Sort by TVL in descending order
            return btcPools.sort((a: Pool, b: Pool) => b.tvlUsd - a.tvlUsd);
        },
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
