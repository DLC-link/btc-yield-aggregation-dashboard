import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTopPools } from '../useTopPools';
import { useTopYieldPools } from '../useTopYieldPools';
import { useCharts } from '../useCharts';
import { useBtcPrice } from '../useBtcPrice';
import { Pool } from '../../types/pool';
import { PoolChartData } from '../../types/chart';

// Mock the hooks
vi.mock('../useTopPools');
vi.mock('../useTopYieldPools');
vi.mock('../useCharts');
vi.mock('../useBtcPrice');

describe('Hooks', () => {
    const mockPools: Pool[] = [
        {
            id: '1',
            chain: 'ethereum',
            project: 'project1',
            symbol: 'BTC-ETH',
            tvlUsd: 1000000,
            apy: 0.05,
            apyBase: 0.04,
            apyReward: 0.01,
            rewardTokens: ['TOKEN1'],
            pool: 'pool1',
            apyPct1D: 0.05,
            apyPct7D: 0.06,
            apyPct30D: 0.07,
            stablecoin: false,
            ilRisk: 'no',
            exposure: 'BTC',
            predictions: {
                predictedClass: 'HIGH',
                predictedProbability: 0.8,
                binnedConfidence: 0.9,
                apy: 0.05,
                tvl: 1000000
            },
            growthRate: 0.1,
            poolMeta: null,
            mu: 0.05,
            sigma: 0.01,
            count: 100,
            outlier: false,
            underlyingTokens: ['BTC', 'ETH'],
            il7d: null,
            apyBase7d: null,
            apyMean30d: 0.05,
            volumeUsd1d: null,
            volumeUsd7d: null,
            apyBaseInception: null
        }
    ];

    const mockChartData: PoolChartData[] = [
        {
            poolId: '1',
            project: 'project1',
            symbol: 'BTC-ETH',
            data: [
                { timestamp: '2024-01-01', tvlUsd: 1000000, apy: 0.05 },
                { timestamp: '2024-01-02', tvlUsd: 1100000, apy: 0.06 }
            ],
            growthRate: 0.1
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock implementations
        (useTopPools as any).mockReturnValue({
            topPools: mockPools,
            totalTVL: 1000000,
            isLoading: false,
            isError: false,
            error: null
        });

        (useTopYieldPools as any).mockReturnValue({
            topYieldPools: mockPools,
            totalTVL: 1000000,
            averageAPY: 0.05,
            isLoading: false,
            isError: false,
            error: null
        });

        (useCharts as any).mockReturnValue({
            chartData: mockChartData,
            isLoading: false,
            isError: false,
            error: null
        });

        (useBtcPrice as any).mockReturnValue({
            btcPrice: 50000,
            isLoading: false,
            isError: false,
            error: null
        });
    });

    describe('useTopPools', () => {
        it('should return all pools sorted by TVL', () => {
            const { result } = renderHook(() => useTopPools());
            expect(result.current.topPools).toEqual(mockPools);
            expect(result.current.totalTVL).toBe(1000000);
        });
    });

    describe('useTopYieldPools', () => {
        it('should return yield pools sorted by APY', () => {
            const { result } = renderHook(() => useTopYieldPools());
            expect(result.current.topYieldPools).toEqual(mockPools);
            expect(result.current.averageAPY).toBe(0.05);
        });
    });

    describe('useCharts', () => {
        it('should return chart data', () => {
            const { result } = renderHook(() => useCharts());
            expect(result.current.chartData).toEqual(mockChartData);
        });
    });

    describe('useBtcPrice', () => {
        it('should return current BTC price', () => {
            const { result } = renderHook(() => useBtcPrice());
            expect(result.current.btcPrice).toBe(50000);
        });
    });
}); 
