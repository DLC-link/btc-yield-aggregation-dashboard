export const API_BASE_URL = 'https://yields.llama.fi'

export const MIN_TVL_USD = 50 * 20000 // 50 BTC * approximate current BTC price
export const TOP_POOLS_COUNT = 5
export const CHART_DAYS = 7

export const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c']

export const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
} as const 
