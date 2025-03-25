import { createContext, useContext, ReactNode } from 'react';
import { Pool } from '../types/Pool';
import { usePools } from '../hooks/usePools';

interface PoolsContextType {
  pools: Pool[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const PoolsContext = createContext<PoolsContextType | undefined>(undefined);

export function PoolsProvider({ children }: { children: ReactNode }) {
  const { pools, isLoading, isError, error } = usePools();

  return (
    <PoolsContext.Provider value={{ pools, isLoading, isError, error }}>
      {children}
    </PoolsContext.Provider>
  );
}

export function usePoolsContext() {
  const context = useContext(PoolsContext);
  if (context === undefined) {
    throw new Error('usePoolsContext must be used within a PoolsProvider');
  }
  return context;
}
