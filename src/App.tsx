import { Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopPools } from './components/TopPools';
import { TopYieldPools } from './components/TopYieldPools';
import { PoolChart } from './components/PoolChart';
import { PoolsProvider } from './contexts/PoolsContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PoolsProvider>
        <Box py={8}>
          <TopPools />
          <Box height="2px" bg="brand.accent" my={8} opacity={0.3} />
          <TopYieldPools />
          <Box height="2px" bg="brand.accent" my={8} opacity={0.3} />
          <PoolChart />
        </Box>
      </PoolsProvider>
    </QueryClientProvider>
  );
}
