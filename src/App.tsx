import { Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PoolChart } from './components/PoolChart';
import { PoolsProvider } from './contexts/PoolsContext';
import { TopBtcPools } from './components/TopBtcPools';
import FilterProvider from './hooks/useFilterContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <PoolsProvider>
          <Box py={8}>
            <Box height="2px" bg="brand.accent" my={8} opacity={0.3} />
            <TopBtcPools />
            <Box height="2px" bg="brand.accent" my={8} opacity={0.3} />
            <PoolChart />
          </Box>
        </PoolsProvider>
      </FilterProvider>
    </QueryClientProvider>
  );
}
