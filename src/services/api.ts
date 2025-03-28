import { API_BASE_URL } from '../constants/config'
import { ChartResponse, Pool } from '../types/chart'

export async function fetchPools(): Promise<Pool[]> {
    const response = await fetch(`${API_BASE_URL}/pools`)
    if (!response.ok) {
        throw new Error('Failed to fetch pools')
    }
    const data = await response.json()
    return data.data
}

export async function fetchPoolChart(poolId: string): Promise<ChartResponse> {
    const response = await fetch(`${API_BASE_URL}/chart/${poolId}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch chart data for pool ${poolId}`)
    }
    return response.json()
} 
