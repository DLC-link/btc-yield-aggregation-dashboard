export function formatTVL(tvl: number | undefined | null) {
    if (tvl === undefined || tvl === null) return 'N/A'

    if (tvl >= 1e9) {
        return `$${(tvl / 1e9).toFixed(1)}B`
    }
    if (tvl >= 1e6) {
        return `$${(tvl / 1e6).toFixed(1)}M`
    }
    return `$${tvl.toLocaleString()}`
}

export function formatYAxis(value: number) {
    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(1)}M`
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(1)}K`
    } else {
        return `$${value.toFixed(2)}`
    }
} 
