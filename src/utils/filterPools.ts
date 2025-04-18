import { FilterOptions } from '../types/chart';
import { Pool } from '../types/pool';

export function filterPools(pools: Pool[], filters: FilterOptions): Pool[] {
  return pools.filter(pool => {
    // Skip filtering if no filters are set
    if (
      !filters.poolName &&
      !filters.assetName &&
      !filters.minTvl &&
      !filters.maxTvl &&
      !filters.minApy &&
      !filters.maxApy &&
      (filters.risk === 'all')
    ) {
      return true;
    }

    // Check pool name
    if (filters.poolName) {
      const searchTerm = filters.poolName.toLowerCase();
      const poolNameLower = pool.project.toLowerCase();
      const symbolLower = pool.symbol.toLowerCase();
      if (!poolNameLower.includes(searchTerm) && !symbolLower.includes(searchTerm)) {
        return false;
      }
    }

    // Check asset name
    if (filters.assetName) {
      const searchTerm = filters.assetName.toLowerCase();
      const assetNameLower = pool.symbol.toLowerCase();
      if (!assetNameLower.includes(searchTerm)) {
        return false;
      }
    }

    // Check minimum TVL
    if (filters.minTvl && pool.tvlUsd < parseFloat(filters.minTvl)) {
      return false;
    }

    // Check maximum TVL
    if (filters.maxTvl && pool.tvlUsd > parseFloat(filters.maxTvl)) {
      return false;
    }

    // Check minimum APY
    if (filters.minApy && pool.apy < parseFloat(filters.minApy)) {
      return false;
    }

    // Check maximum APY
    if (filters.maxApy && pool.apy > parseFloat(filters.maxApy)) {
      return false;
    }

    // Case-insensitive risk check
    if (filters.risk !== 'all') {
      const riskFilter = filters.risk.toLowerCase();
      const poolRisk = pool.ilRisk.toLowerCase();
      if (poolRisk !== riskFilter) {
        return false;
      }
    }

    return true;
  });
}
