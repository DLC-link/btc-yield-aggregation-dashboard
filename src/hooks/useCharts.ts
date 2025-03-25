import { useQuery } from '@tanstack/react-query';
import { usePoolsContext } from '../contexts/PoolsContext';

interface ChartDataPoint {
  timestamp: string;
  tvlUsd: number;
  apy: number;
}

interface ChartResponse {
  data: ChartDataPoint[];
}

interface PoolChartData {
  poolId: string;
  project: string;
  symbol: string;
  data: ChartDataPoint[];
  growthRate: number;
}

// Helper function to fetch data for a single pool
async function fetchPoolData(pool: {
  pool: string;
  project: string;
  symbol: string;
}): Promise<PoolChartData | null> {
  try {
    const response = await fetch(`https://yields.llama.fi/chart/${pool.pool}`);
    if (!response.ok) {
      return null;
    }
    const chartData: ChartResponse = await response.json();

    // Calculate growth rate (7-day)
    const sortedData = chartData.data
      .slice(-7) // Get last 7 entries
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

// Helper function to fetch data in batches
async function fetchPoolsInBatches(
  pools: Array<{ pool: string; project: string; symbol: string }>,
  batchSize: number = 5
) {
  const results: PoolChartData[] = [];

  const batch = pools.slice(0, batchSize);
  const batchPromises = batch.map(pool => fetchPoolData(pool));
  const batchResults = await Promise.all(batchPromises);

  // Filter out null results and add valid ones
  results.push(...batchResults.filter((result): result is PoolChartData => result !== null));

  return results;
}

export function useCharts() {
  const { pools, isLoading: isPoolsLoading } = usePoolsContext();

  const { data, isLoading, isError, error } = useQuery<PoolChartData[]>({
    queryKey: ['charts'],
    queryFn: async () => {
      if (!pools?.length) throw new Error('No pools available');

      // Pre-filter pools by TVL to get top 5
      const minTvlUsd = 50 * 20000; // 50 BTC * approximate current BTC price
      const topPools = pools
        .filter(pool => pool.tvlUsd >= minTvlUsd)
        .sort((a, b) => b.tvlUsd - a.tvlUsd)
        .slice(0, 5);

      const poolData = await fetchPoolsInBatches(topPools);

      if (poolData.length === 0) {
        throw new Error('Failed to fetch data for any pools');
      }

      return poolData;
    },
    enabled: !!pools?.length && !isPoolsLoading,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  return {
    chartData: data || [],
    isLoading: isLoading || isPoolsLoading,
    isError,
    error,
  };
}
