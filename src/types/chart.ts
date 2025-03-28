export interface Pool {
    chain: string
    project: string
    symbol: string
    tvlUsd: number
    apyBase: number
    apyReward: number | null
    apy: number
    rewardTokens: string[] | null
    pool: string
    apyPct1D: number
    apyPct7D: number
    apyPct30D: number
    stablecoin: boolean
    ilRisk: string
    exposure: string
    predictions: {
        predictedClass: string
        predictedProbability: number
        binnedConfidence: number
    }
    poolMeta: string | null
    mu: number
    sigma: number
    count: number
    outlier: boolean
    underlyingTokens: string[]
    il7d: number | null
    apyBase7d: number | null
    apyMean30d: number
    volumeUsd1d: number | null
    volumeUsd7d: number | null
    apyBaseInception: number | null
}

export interface ChartDataPoint {
    timestamp: string
    tvlUsd: number
    apy: number
}

export interface ChartResponse {
    data: ChartDataPoint[]
}

export interface PoolChartData {
    poolId: string
    project: string
    symbol: string
    data: ChartDataPoint[]
    growthRate: number
}

export interface ChartData {
    chartData: PoolChartData[]
    isLoading: boolean
    isError: boolean
    error: Error | null
}

export interface PoolData {
    pools: Pool[]
    isLoading: boolean
    isError: boolean
    error: Error | null
}

export interface TopPoolsData {
    topPools: Pool[]
    totalTVL: number
    isLoading: boolean
    isError: boolean
    error: Error | null
}

export interface TopYieldPoolsData {
    topYieldPools: Pool[]
    totalTVL: number
    averageAPY: number
    isLoading: boolean
    isError: boolean
    error: Error | null
} 
