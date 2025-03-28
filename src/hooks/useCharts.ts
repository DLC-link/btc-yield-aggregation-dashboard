import { useQuery } from '@tanstack/react-query';
import { usePoolsContext } from '../contexts/PoolsContext';
import { Pool, PoolChartData, ChartData } from '../types/chart';
import { fetchPoolChart } from '../services/api';
import { MIN_TVL_USD, TOP_POOLS_COUNT, CHART_DAYS, QUERY_CONFIG } from '../constants/config';

async function fetchPoolData(pool: { pool: string; project: string; symbol: string }): Promise<PoolChartData | null> {
  try {
    const chartData = await fetchPoolChart(pool.pool);
    const sortedData = chartData.data
      .slice(-CHART_DAYS)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const firstTVL = sortedData[0]?.tvlUsd || 0;
    const lastTVL = sortedData[sortedData.length - 1]?.tvlUsd || 0;
    const growthRate = firstTVL > 0 ? ((lastTVL - firstTVL) / firstTVL) * 100 : 0;

    return {
      poolId: pool.pool,
      project: pool.project,
      symbol: pool.symbol,
      data: sortedData,
      growthRate,
    };
  } catch (error) {
    return null;
  }
}

async function fetchPoolsInBatches(
  pools: Array<{ pool: string; project: string; symbol: string }>,
  batchSize: number = TOP_POOLS_COUNT
) {
  const results: PoolChartData[] = [];
  const batch = pools.slice(0, batchSize);
  const batchPromises = batch.map(pool => fetchPoolData(pool));
  const batchResults = await Promise.all(batchPromises);
  results.push(...batchResults.filter((result): result is PoolChartData => result !== null));
  return results;
}

export function useCharts(): ChartData {
  const { pools, isLoading: isPoolsLoading } = usePoolsContext();

  const { data, isLoading, isError, error } = useQuery<PoolChartData[]>({
    queryKey: ['charts'],
    queryFn: async () => {
      if (!pools?.length) throw new Error('No pools available');

      const topPools = pools
        .filter(pool => pool.tvlUsd >= MIN_TVL_USD)
        .sort((a, b) => b.tvlUsd - a.tvlUsd)
        .slice(0, TOP_POOLS_COUNT);

      const poolData = await fetchPoolsInBatches(topPools);

      if (poolData.length === 0) {
        throw new Error('Failed to fetch data for any pools');
      }

      return poolData;
    },
    enabled: !!pools?.length && !isPoolsLoading,
    ...QUERY_CONFIG,
  });

  return {
    chartData: data || [],
    isLoading: isLoading || isPoolsLoading,
    isError,
    error,
  };
}
