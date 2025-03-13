import { Pool } from '../types/Pool'
import { useTopYieldPools } from '../hooks/useTopYieldPools'

function formatTVL(tvl: number) {
    if (tvl >= 1e9) {
        return `$${(tvl / 1e9).toFixed(2)}B`
    }
    if (tvl >= 1e6) {
        return `$${(tvl / 1e6).toFixed(2)}M`
    }
    return `$${tvl.toLocaleString()}`
}

export function TopYieldPools() {
    const { topYieldPools, totalTVL, averageAPY, isLoading, isError, error } = useTopYieldPools()

    if (isLoading) {
        return <div>Loading high yield pools...</div>
    }

    if (isError) {
        return <div>Error: {error?.message}</div>
    }

    return (
        <div className="top-pools">
            <h2>Top 5 Highest Yield BTC Pools</h2>
            <div className="total-tvl">
                <h3>Combined TVL: {formatTVL(totalTVL)}</h3>
                <p className="average-apy">Average APY: {averageAPY.toFixed(2)}%</p>
            </div>
            <div className="top-pools-grid">
                {topYieldPools.map((pool: Pool, index: number) => (
                    <div key={pool.pool} className="top-pool-card">
                        <div className="rank">#{index + 1}</div>
                        <h3>{pool.project} - {pool.symbol}</h3>
                        <div className="pool-details">
                            <div className="apy-info highlight">
                                <p className="apy-value">APY: {pool.apy.toFixed(2)}%</p>
                                {pool.apyPct7D !== null && (
                                    <p className={`apy-change ${pool.apyPct7D >= 0 ? 'positive' : 'negative'}`}>
                                        7d: {pool.apyPct7D > 0 ? '+' : ''}{pool.apyPct7D.toFixed(2)}%
                                    </p>
                                )}
                            </div>
                            <div className="tvl-info">
                                <p className="tvl-value">TVL: {formatTVL(pool.tvlUsd)}</p>
                                <p className="tvl-percentage">
                                    {((pool.tvlUsd / totalTVL) * 100).toFixed(2)}% of filtered total
                                </p>
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
