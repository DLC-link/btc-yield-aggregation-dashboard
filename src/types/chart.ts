import { Pool } from './pool_temp';

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
