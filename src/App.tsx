import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TopPools } from './components/TopPools'
import { TopYieldPools } from './components/TopYieldPools'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="pools">
        <TopPools />
        <div className="section-divider" />
        <TopYieldPools />
      </div>
    </QueryClientProvider>
  )
}

export default App
