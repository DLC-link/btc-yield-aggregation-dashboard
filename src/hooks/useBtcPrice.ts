import { useQuery } from '@tanstack/react-query';
import { QUERY_CONFIG } from '../constants/config';

async function fetchBtcPrice(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
}

export function useBtcPrice() {
    const { data: btcPrice, isLoading, isError, error } = useQuery<number>({
        queryKey: ['btcPrice'],
        queryFn: fetchBtcPrice,
        ...QUERY_CONFIG,
    });

    return {
        btcPrice: btcPrice || 0,
        isLoading,
        isError,
        error,
    };
} 
