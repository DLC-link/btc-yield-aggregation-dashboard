export const API_BASE_URL = 'https://yields.llama.fi'

export const TOP_POOLS_COUNT = 5

export const CHART_DAYS = 7

export const CHART_COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEEAD',
    '#D4A5A5',
    '#9B59B6',
    '#3498DB',
    '#E67E22',
    '#2ECC71',
]

export const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
} as const 
