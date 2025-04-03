import { describe, it, expect } from 'vitest';

// Mock data for testing
const mockPools = [
    {
        pool: 'pool1',
        project: 'Project A',
        symbol: 'BTC-ETH',
        tvlUsd: 1000000,
        apy: 5.2,
        ilRisk: 'LOW',
        exposure: 'BTC',
        apyPct7D: 0.5,
        apyPct30D: 1.2
    },
    {
        pool: 'pool2',
        project: 'Project B',
        symbol: 'BTC-USDC',
        tvlUsd: 2000000,
        apy: 7.8,
        ilRisk: 'MEDIUM',
        exposure: 'BTC',
        apyPct7D: -0.3,
        apyPct30D: 0.8
    },
    {
        pool: 'pool3',
        project: 'Project C',
        symbol: 'ETH-USDC',
        tvlUsd: 1500000,
        apy: 4.5,
        ilRisk: 'LOW',
        exposure: 'ETH',
        apyPct7D: 0.2,
        apyPct30D: 0.5
    },
    {
        pool: 'pool4',
        project: 'Project D',
        symbol: 'BTC-DAI',
        tvlUsd: 3000000,
        apy: 9.1,
        ilRisk: 'HIGH',
        exposure: 'BTC',
        apyPct7D: 1.5,
        apyPct30D: 2.3
    },
    {
        pool: 'pool5',
        project: 'Project E',
        symbol: 'BTC-WBTC',
        tvlUsd: 500000,
        apy: 12.3,
        ilRisk: 'LOW',
        exposure: 'BTC',
        apyPct7D: 2.1,
        apyPct30D: 3.4
    }
];

// Mock chart data
const mockChartData = [
    {
        poolId: 'pool1',
        project: 'Project A',
        symbol: 'BTC-ETH',
        data: [
            { timestamp: '2023-01-01', tvlUsd: 950000, apy: 5.0 },
            { timestamp: '2023-01-02', tvlUsd: 960000, apy: 5.1 },
            { timestamp: '2023-01-03', tvlUsd: 970000, apy: 5.2 },
            { timestamp: '2023-01-04', tvlUsd: 980000, apy: 5.3 },
            { timestamp: '2023-01-05', tvlUsd: 990000, apy: 5.4 },
            { timestamp: '2023-01-06', tvlUsd: 995000, apy: 5.5 },
            { timestamp: '2023-01-07', tvlUsd: 1000000, apy: 5.2 }
        ],
        growthRate: 5.26
    },
    {
        poolId: 'pool2',
        project: 'Project B',
        symbol: 'BTC-USDC',
        data: [
            { timestamp: '2023-01-01', tvlUsd: 1900000, apy: 7.5 },
            { timestamp: '2023-01-02', tvlUsd: 1920000, apy: 7.6 },
            { timestamp: '2023-01-03', tvlUsd: 1940000, apy: 7.7 },
            { timestamp: '2023-01-04', tvlUsd: 1960000, apy: 7.8 },
            { timestamp: '2023-01-05', tvlUsd: 1980000, apy: 7.9 },
            { timestamp: '2023-01-06', tvlUsd: 1990000, apy: 8.0 },
            { timestamp: '2023-01-07', tvlUsd: 2000000, apy: 7.8 }
        ],
        growthRate: 5.26
    }
];

describe('Pool Filtering Logic', () => {
    it('should filter pools with BTC in symbol', () => {
        const btcPools = mockPools.filter(pool => pool.symbol.toUpperCase().includes('BTC'));
        expect(btcPools.length).toBe(4);
        expect(btcPools.every(pool => pool.symbol.includes('BTC'))).toBe(true);
    });

    it('should filter pools by minimum TVL threshold', () => {
        const btcPrice = 50000; // $50,000 per BTC
        const minTVLInBTC = 50; // 50 BTC minimum
        const minTVLInUSD = minTVLInBTC * btcPrice;

        const filteredPools = mockPools.filter(pool =>
            pool.tvlUsd >= minTVLInUSD &&
            pool.symbol.toUpperCase().includes('BTC')
        );

        // Only pool4 has TVL > 50 BTC * $50,000 = $2,500,000
        expect(filteredPools.length).toBe(1);
        expect(filteredPools[0].pool).toBe('pool4');
    });

    it('should sort pools by TVL in descending order', () => {
        const sortedPools = [...mockPools]
            .filter(pool => pool.symbol.toUpperCase().includes('BTC'))
            .sort((a, b) => b.tvlUsd - a.tvlUsd);

        expect(sortedPools[0].tvlUsd).toBe(3000000); // pool4
        expect(sortedPools[1].tvlUsd).toBe(2000000); // pool2
        expect(sortedPools[2].tvlUsd).toBe(1000000); // pool1
        expect(sortedPools[3].tvlUsd).toBe(500000);  // pool5
    });

    it('should sort pools by APY in descending order', () => {
        const sortedPools = [...mockPools]
            .filter(pool => pool.symbol.toUpperCase().includes('BTC'))
            .sort((a, b) => b.apy - a.apy);

        expect(sortedPools[0].apy).toBe(12.3); // pool5
        expect(sortedPools[1].apy).toBe(9.1);  // pool4
        expect(sortedPools[2].apy).toBe(7.8);  // pool2
        expect(sortedPools[3].apy).toBe(5.2);  // pool1
    });

    it('should select top 5 pools', () => {
        const topPools = [...mockPools]
            .filter(pool => pool.symbol.toUpperCase().includes('BTC'))
            .sort((a, b) => b.tvlUsd - a.tvlUsd)
            .slice(0, 5);

        expect(topPools.length).toBe(4); // Only 4 BTC pools in mock data
    });
});

describe('Metrics Calculation', () => {
    it('should calculate total TVL correctly', () => {
        const btcPools = mockPools.filter(pool => pool.symbol.toUpperCase().includes('BTC'));
        const totalTVL = btcPools.reduce((sum, pool) => sum + pool.tvlUsd, 0);

        expect(totalTVL).toBe(6500000); // 1000000 + 2000000 + 3000000 + 500000
    });

    it('should calculate average APY correctly', () => {
        const btcPools = mockPools.filter(pool => pool.symbol.toUpperCase().includes('BTC'));
        const averageAPY = btcPools.reduce((sum, pool) => sum + pool.apy, 0) / btcPools.length;

        // Use toBeCloseTo for floating-point comparison
        expect(averageAPY).toBeCloseTo(8.6, 1); // (5.2 + 7.8 + 9.1 + 12.3) / 4
    });

    it('should calculate growth rate correctly', () => {
        const pool = mockChartData[0];
        const firstTVL = pool.data[0].tvlUsd;
        const lastTVL = pool.data[pool.data.length - 1].tvlUsd;
        const growthRate = ((lastTVL - firstTVL) / firstTVL) * 100;

        // Use toBeCloseTo for floating-point comparison
        expect(growthRate).toBeCloseTo(5.26, 2); // ((1000000 - 950000) / 950000) * 100
    });
});

describe('Formatter Functions', () => {
    it('should format TVL correctly', () => {
        const formatTVL = (tvl: number) => {
            if (tvl >= 1e9) {
                return `$${(tvl / 1e9).toFixed(1)}B`;
            }
            if (tvl >= 1e6) {
                return `$${(tvl / 1e6).toFixed(1)}M`;
            }
            return `$${tvl.toLocaleString()}`;
        };

        expect(formatTVL(1000000000)).toBe('$1.0B');
        expect(formatTVL(1500000)).toBe('$1.5M');
        expect(formatTVL(50000)).toBe('$50,000');
    });

    it('should format Y-axis values correctly', () => {
        const formatYAxis = (value: number) => {
            if (value >= 1e9) {
                return `$${(value / 1e9).toFixed(1)}B`;
            } else if (value >= 1e6) {
                return `$${(value / 1e6).toFixed(1)}M`;
            } else if (value >= 1e3) {
                return `$${(value / 1e3).toFixed(1)}K`;
            } else {
                return `$${value.toFixed(2)}`;
            }
        };

        expect(formatYAxis(1000000000)).toBe('$1.0B');
        expect(formatYAxis(1500000)).toBe('$1.5M');
        expect(formatYAxis(50000)).toBe('$50.0K');
        expect(formatYAxis(500)).toBe('$500.00');
    });
}); 
