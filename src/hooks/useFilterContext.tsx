import { createContext, useContext, useState, ReactNode } from "react";
import { FilterContextValue } from "../types/pool";

const FilterContext = createContext<FilterContextValue | undefined>(undefined);


export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};


export function FilterProvider({ children }: { children: ReactNode }) {
    const [filteredPoolIds, setFilteredPoolIds] = useState<string[]>([]);
    const Provider = FilterContext.Provider;
  
    return (
      <Provider value={{ filteredPoolIds, setFilteredPoolIds }}>
        {children}
      </Provider>
    );
  }

  export default FilterProvider;
