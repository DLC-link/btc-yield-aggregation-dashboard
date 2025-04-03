import { Pool } from '../types/pool';

export const calculateTotalTVL = (pools: Pool[]): number => {
    return pools.reduce((total, pool) => total + pool.tvlUsd, 0);
};

export const calculateAverageAPY = (pools: Pool[]): number => {
    if (pools.length === 0) return 0;
    const totalAPY = pools.reduce((sum, pool) => sum + pool.apy, 0);
    return totalAPY / pools.length;
};

export const calculateGrowthRate = (pools: Pool[]): number => {
    if (pools.length === 0) return 0;
    const totalGrowth = pools.reduce((sum, pool) => sum + pool.growthRate, 0);
    return totalGrowth / pools.length;
}; 
