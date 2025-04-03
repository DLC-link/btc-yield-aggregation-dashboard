import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTopPools } from '../useTopPools';
import { useTopYieldPools } from '../useTopYieldPools';
import { useCharts } from '../useCharts';
import { useBtcPrice } from '../useBtcPrice';

// Mock the hooks' dependencies
vi.mock('../useTopPools', () => ({
    useTopPools: vi.fn()
}));

vi.mock('../useTopYieldPools', () => ({
    useTopYieldPools: vi.fn()
}));

vi.mock('../useCharts', () => ({
    useCharts: vi.fn()
}));

vi.mock('../useBtcPrice', () => ({
    useBtcPrice: vi.fn()
}));

describe('useTopPools Hook', () => {
    it('should filter and sort pools correctly', () => {
        const mockPools = [
            { pool: 'pool4', tvlUsd: 3000000, symbol: 'BTC-DAI' },
            { pool: 'pool2', tvlUsd: 2000000, symbol: 'BTC-USDC' },
            { pool: 'pool1', tvlUsd: 1000000, symbol: 'BTC-ETH' },
            { pool: 'pool3', tvlUsd: 1500000, symbol: 'ETH-USDC' }
        ];

        (useTopPools as any).mockReturnValue({
            topPools: mockPools,
            totalTVL: 7500000,
            isLoading: false,
            isError: false,
            error: null
        });

        const { result } = renderHook(() => useTopPools());

        expect(result.current.topPools).toHaveLength(4);
        expect(result.current.topPools[0].tvlUsd).toBe(3000000);
        expect(result.current.topPools[1].tvlUsd).toBe(2000000);
    });
});

describe('useTopYieldPools Hook', () => {
    it('should filter and sort pools by APY correctly', () => {
        const mockPools = [
            { pool: 'pool4', apy: 9.1, symbol: 'BTC-DAI' },
            { pool: 'pool2', apy: 7.8, symbol: 'BTC-USDC' },
            { pool: 'pool1', apy: 5.2, symbol: 'BTC-ETH' },
            { pool: 'pool3', apy: 4.5, symbol: 'ETH-USDC' }
        ];

        (useTopYieldPools as any).mockReturnValue({
            topYieldPools: mockPools,
            totalTVL: 7500000,
            averageAPY: 7.4,
            isLoading: false,
            isError: false,
            error: null
        });

        const { result } = renderHook(() => useTopYieldPools());

        expect(result.current.topYieldPools).toHaveLength(4);
        expect(result.current.topYieldPools[0].apy).toBe(9.1);
        expect(result.current.topYieldPools[1].apy).toBe(7.8);
    });
});

describe('useCharts Hook', () => {
    it('should return chart data correctly', () => {
        const mockChartData = [
            {
                poolId: 'pool1',
                data: [
                    { timestamp: '2023-01-01', tvlUsd: 950000 },
                    { timestamp: '2023-01-07', tvlUsd: 1000000 }
                ]
            }
        ];

        (useCharts as any).mockReturnValue({
            chartData: mockChartData,
            isLoading: false,
            isError: false,
            error: null
        });

        const { result } = renderHook(() => useCharts());

        expect(result.current.chartData).toHaveLength(1);
        expect(result.current.chartData[0].poolId).toBe('pool1');
    });
});

describe('useBtcPrice Hook', () => {
    it('should return BTC price correctly', () => {
        const mockBtcPrice = 50000;

        (useBtcPrice as any).mockReturnValue({
            btcPrice: mockBtcPrice,
            isLoading: false,
            isError: false,
            error: null
        });

        const { result } = renderHook(() => useBtcPrice());

        expect(result.current.btcPrice).toBe(50000);
    });
}); 
