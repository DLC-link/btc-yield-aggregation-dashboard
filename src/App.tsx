import { Box, Container } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TopPools } from './components/TopPools'
import { TopYieldPools } from './components/TopYieldPools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxW="1200px" py={8}>
        <TopPools />
        <Box
          h="2px"
          my={12}
          bgGradient="linear(to-r, transparent, brand.accent, transparent)"
          opacity={0.3}
        />
        <TopYieldPools />
      </Container>
    </QueryClientProvider>
  )
}

export default App
