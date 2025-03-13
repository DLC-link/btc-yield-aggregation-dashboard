import { Pool } from '../types/Pool'
import { usePools } from '../hooks/use-pools'

function formatTVL(tvl: number) {
    if (tvl >= 1e9) {
        return `$${(tvl / 1e9).toFixed(2)}B`
    }
    if (tvl >= 1e6) {
        return `$${(tvl / 1e6).toFixed(2)}M`
    }
    return `$${tvl.toLocaleString()}`
}

export function TopPools() {
    const { pools, isLoading, isError, error } = usePools()

    if (isLoading) {
        return <div>Loading top TVL pools...</div>
    }

    if (isError) {
        return <div>Error: {error?.message}</div>
    }

    const topTVLPools = pools
        .sort((a, b) => b.tvlUsd - a.tvlUsd)
        .slice(0, 5)
        .reduce((acc, pool) => ({
            pools: [...acc.pools, pool],
            totalTVL: acc.totalTVL + pool.tvlUsd
        }), { pools: [] as Pool[], totalTVL: 0 });

    return (
        <div className="top-pools">
            <h2>Top 5 BTC Pools by TVL</h2>
            <div className="total-tvl">
                <h3>Combined TVL: {formatTVL(topTVLPools.totalTVL)}</h3>
                <p className="tvl-share">
                    Market Share: {((topTVLPools.totalTVL / pools.reduce((sum, p) => sum + p.tvlUsd, 0)) * 100).toFixed(2)}%
                </p>
            </div>
            <div className="top-pools-grid">
                {topTVLPools.pools.map((pool: Pool, index: number) => (
                    <div key={pool.pool} className="top-pool-card">
                        <div className="rank">#{index + 1}</div>
                        <h3>{pool.project} - {pool.symbol}</h3>
                        <div className="pool-details">
                            <div className="tvl-info highlight">
                                <p className="tvl-value">TVL: {formatTVL(pool.tvlUsd)}</p>
                                <p className="tvl-percentage">
                                    {((pool.tvlUsd / topTVLPools.totalTVL) * 100).toFixed(2)}% of top 5
                                </p>
                            </div>
                            <div className="apy-info">
                                <p className="apy-value">APY: {pool.apy.toFixed(2)}%</p>
                                {pool.apyPct7D !== null && (
                                    <p className={`apy-change ${pool.apyPct7D >= 0 ? 'positive' : 'negative'}`}>
                                        7d: {pool.apyPct7D > 0 ? '+' : ''}{pool.apyPct7D.toFixed(2)}%
                                    </p>
                                )}
                            </div>
                            <div className="pool-meta">
                                <p>IL Risk: {pool.ilRisk}</p>
                                <p>Exposure: {pool.exposure}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 
