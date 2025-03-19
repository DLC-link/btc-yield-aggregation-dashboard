import { Box, VStack} from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TopPools } from './components/TopPools'
import { TopYieldPools } from './components/TopYieldPools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VStack w="100%" py={8} alignItems="center">
        <TopPools />
        <Box
          h="2px"
          my={12}
          bgGradient="linear(to-r, transparent, brand.accent, transparent)"
          opacity={0.3}
        />
        <TopYieldPools />
      </VStack>
    </QueryClientProvider>
  )
}

export default App
