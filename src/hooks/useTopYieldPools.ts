import { usePools } from './use-pools';
import { Pool } from '../types/Pool';

const MIN_BTC_TVL = 50; // Minimum 50 BTC worth of TVL
const BTC_PRICE = 65000; // Approximate BTC price in USD
const MIN_TVL_USD = MIN_BTC_TVL * BTC_PRICE; // Minimum TVL in USD

export function useTopYieldPools() {
    const { pools, isLoading, isError, error } = usePools();

    const topYieldPools = pools
        // Filter pools with minimum TVL requirement
        .filter(pool => pool.tvlUsd >= MIN_TVL_USD)
        // Sort by APY in descending order
        .sort((a, b) => b.apy - a.apy)
        // Take top 5
        .slice(0, 5)
        .reduce((acc, pool) => {
            return {
                pools: [...acc.pools, pool],
                totalTVL: acc.totalTVL + pool.tvlUsd,
                averageAPY: acc.averageAPY + pool.apy,
            };
        }, { pools: [] as Pool[], totalTVL: 0, averageAPY: 0 });

    // Calculate the average APY for the top 5 pools
    const averageAPY = topYieldPools.pools.length > 0
        ? topYieldPools.averageAPY / topYieldPools.pools.length
        : 0;

    return {
        topYieldPools: topYieldPools.pools,
        totalTVL: topYieldPools.totalTVL,
        averageAPY,
        isLoading,
        isError,
        error,
    };
} 
