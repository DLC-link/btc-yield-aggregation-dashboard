import { useState, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
  Tooltip,
  Button,
  Spinner,
  Flex,
  Input,
  FormControl,
  InputGroup,
  InputLeftAddon,
  Select,
  Collapse,
} from '@chakra-ui/react';
import { FiInfo, FiChevronUp, FiChevronDown, FiFilter, FiX } from 'react-icons/fi';
import { useTopYieldPools, SortField, SortDirection } from '../hooks/useTopYieldPools';
import { formatTVL } from '../utils/formatters';
import { SearchIcon } from '@chakra-ui/icons';

const INITIAL_DISPLAY_COUNT = 5;
const LOAD_MORE_COUNT = 10;

export function TopBtcPools() {
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('tvlUsd');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    poolName: '',
    assetName: '',
    minTvl: '',
    maxTvl: '',
    minApy: '',
    maxApy: '',
    risk: 'ALL',
  });

  // Fetch data
  const { topYieldPools, totalTVL, averageAPY, isLoading, isError, error } = useTopYieldPools(
    sortField,
    sortDirection
  );

  // Debug: Log the full data structure
  console.log('All Pools Data:', topYieldPools);

  // Log individual fields to see their exact values
  if (topYieldPools.length > 0) {
    const samplePool = topYieldPools[0];
    console.log('Sample Pool:', {
      pool: samplePool.pool,
      project: samplePool.project,
      symbol: samplePool.symbol,
      tvlUsd: samplePool.tvlUsd,
      apy: samplePool.apy,
      ilRisk: samplePool.ilRisk,
      ilRiskType: typeof samplePool.ilRisk,
      // Log other values that might be useful
    });
  }

  const tableRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Apply filters
  const filteredPools = topYieldPools.filter(pool => {
    // Skip filtering if no filters are set
    if (
      !filters.poolName &&
      !filters.assetName &&
      !filters.minTvl &&
      !filters.maxTvl &&
      !filters.minApy &&
      !filters.maxApy &&
      filters.risk === 'ALL'
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

    // Simplified risk check - direct comparison
    if (filters.risk !== 'ALL' && pool.ilRisk !== filters.risk.toLowerCase()) {
      return false;
    }

    return true;
  });

  const displayedPools = filteredPools.slice(0, displayCount);
  const hasMorePools = displayCount < filteredPools.length;

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredPools.length));
  };

  const handleShowLess = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending order when changing fields
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterReset = () => {
    setFilters({
      poolName: '',
      assetName: '',
      minTvl: '',
      maxTvl: '',
      minApy: '',
      maxApy: '',
      risk: 'ALL',
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" color="brand.primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">Error: {error?.message || 'Failed to load pools'}</Text>
      </Box>
    );
  }

  const filterPanel = (
    <Collapse in={isFilterOpen} animateOpacity>
      <Box
        mt={4}
        p={6}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        bg={bgColor}
        width="100%"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Filter Pools</Heading>
          <Button variant="ghost" onClick={handleFilterReset} leftIcon={<FiX />}>
            Reset Filters
          </Button>
        </Flex>

        <VStack spacing={6} align="stretch">
          {/* First row of filters */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            {/* Pool Name */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Pool Name
              </Text>
              <InputGroup>
                <InputLeftAddon pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftAddon>
                <Input
                  placeholder="Search pool name..."
                  value={filters.poolName}
                  onChange={e => handleFilterChange('poolName', e.target.value)}
                />
              </InputGroup>
            </Box>

            {/* Asset Name */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Asset Name
              </Text>
              <InputGroup>
                <InputLeftAddon pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftAddon>
                <Input
                  placeholder="Search asset..."
                  value={filters.assetName}
                  onChange={e => handleFilterChange('assetName', e.target.value)}
                />
              </InputGroup>
            </Box>
          </Flex>

          {/* Second row of filters */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            {/* Min TVL */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Min TVL ($)
              </Text>
              <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  placeholder="Minimum TVL"
                  value={filters.minTvl}
                  onChange={e => handleFilterChange('minTvl', e.target.value)}
                  type="number"
                />
              </InputGroup>
            </Box>

            {/* Max TVL */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Max TVL ($)
              </Text>
              <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <Input
                  placeholder="Maximum TVL"
                  value={filters.maxTvl}
                  onChange={e => handleFilterChange('maxTvl', e.target.value)}
                  type="number"
                />
              </InputGroup>
            </Box>
          </Flex>

          {/* Third row of filters */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            {/* Min APY */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Min APY (%)
              </Text>
              <InputGroup>
                <InputLeftAddon>%</InputLeftAddon>
                <Input
                  placeholder="Minimum APY"
                  value={filters.minApy}
                  onChange={e => handleFilterChange('minApy', e.target.value)}
                  type="number"
                />
              </InputGroup>
            </Box>

            {/* Max APY */}
            <Box flex="1">
              <Text mb={2} fontWeight="medium">
                Max APY (%)
              </Text>
              <InputGroup>
                <InputLeftAddon>%</InputLeftAddon>
                <Input
                  placeholder="Maximum APY"
                  value={filters.maxApy}
                  onChange={e => handleFilterChange('maxApy', e.target.value)}
                  type="number"
                />
              </InputGroup>
            </Box>
          </Flex>

          {/* Risk filter */}
          <FormControl>
            <Text mb={2} fontWeight="medium">
              Risk
            </Text>
            <Select value={filters.risk} onChange={e => handleFilterChange('risk', e.target.value)}>
              <option value="ALL">All</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </Select>
          </FormControl>

          {/* Results count */}
          <Flex justify="flex-end">
            <Text fontSize="sm" color="gray.600">
              Showing {filteredPools.length} of {topYieldPools.length} pools
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Collapse>
  );

  return (
    <VStack spacing="8" maxW="1400px" width="100%" mx="auto" px={4}>
      <HStack width="100%" justifyContent="space-between">
        <HStack spacing={2}>
          <Heading as="h2" size="lg" color="brand.accent">
            Top BTC Pools
          </Heading>
          <Tooltip label="Click on column headers to sort" hasArrow placement="right">
            <Box>
              <Icon as={FiInfo} color="brand.accent" cursor="help" />
            </Box>
          </Tooltip>
        </HStack>

        <Button
          leftIcon={<FiFilter />}
          onClick={handleFilterToggle}
          colorScheme="brand"
          variant={isFilterOpen ? 'solid' : 'outline'}
        >
          Filter
        </Button>
      </HStack>

      <Flex width="100%" justifyContent="space-between">
        <Box
          bg="brand.secondary"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="brand.accent"
          textAlign="center"
          width="48%"
        >
          <Heading as="h3" size="lg" color="brand.text" mb={2}>
            Combined TVL: {formatTVL(totalTVL)}
          </Heading>
        </Box>

        <Box
          bg="brand.secondary"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="brand.accent"
          textAlign="center"
          width="48%"
        >
          <Heading as="h3" size="lg" color="brand.text" mb={2}>
            Average APY: {averageAPY.toFixed(2)}%
          </Heading>
        </Box>
      </Flex>

      {filterPanel}

      <Box
        ref={tableRef}
        overflowX="auto"
        bg={bgColor}
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        width="100%"
      >
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th width="10%">Rank</Th>
              <Th width="40%">Pool</Th>
              <Th
                width="20%"
                textAlign="center"
                cursor="pointer"
                onClick={() => handleSort('tvlUsd')}
                position="relative"
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
                transition="all 0.2s"
                borderRadius="md"
              >
                <HStack justifyContent="center" spacing={1}>
                  <Text>TVL</Text>
                  <Box>
                    {getSortIcon('tvlUsd') || (
                      <Box opacity={0.5}>
                        <Icon as={FiChevronDown} />
                      </Box>
                    )}
                  </Box>
                </HStack>
                {sortField === 'tvlUsd' && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    height="2px"
                    bg="brand.accent"
                  />
                )}
              </Th>
              <Th
                width="20%"
                textAlign="center"
                cursor="pointer"
                onClick={() => handleSort('apy')}
                position="relative"
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
                transition="all 0.2s"
                borderRadius="md"
              >
                <HStack justifyContent="center" spacing={1}>
                  <Text>APY</Text>
                  <Box>
                    {getSortIcon('apy') || (
                      <Box opacity={0.5}>
                        <Icon as={FiChevronDown} />
                      </Box>
                    )}
                  </Box>
                </HStack>
                {sortField === 'apy' && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    height="2px"
                    bg="brand.accent"
                  />
                )}
              </Th>
              <Th width="10%" textAlign="center">
                Risk
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedPools.length > 0 ? (
              displayedPools.map((pool, index) => (
                <Tr
                  key={pool.pool}
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  transition="background-color 0.2s"
                >
                  <Td>
                    <Badge
                      bg="brand.accent"
                      color="white"
                      borderRadius="full"
                      w="36px"
                      h="36px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize={index + 1 >= 1000 ? 'xs' : index + 1 >= 100 ? 'sm' : 'lg'}
                      fontWeight="bold"
                    >
                      #{index + 1}
                    </Badge>
                  </Td>
                  <Td>
                    <Box>
                      <Box fontWeight="medium">{pool.project}</Box>
                      <Box fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                        {pool.symbol}
                      </Box>
                    </Box>
                  </Td>
                  <Td fontWeight="medium" textAlign="center">
                    {formatTVL(pool.tvlUsd)}
                  </Td>
                  <Td textAlign="center">
                    <Badge
                      colorScheme={pool.apy >= 5 ? 'green' : 'blue'}
                      fontSize="sm"
                      px={2}
                      py={1}
                      borderRadius="md"
                      minW="80px"
                      textAlign="center"
                      display="inline-block"
                    >
                      {pool.apy.toFixed(4)}%
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <Box
                      as="span"
                      display="inline-block"
                      px={2}
                      py={1}
                      borderRadius="md"
                      minW="80px"
                      textAlign="center"
                      fontSize="sm"
                      fontWeight="500"
                      backgroundColor={
                        pool.ilRisk.toLowerCase() === 'no'
                          ? 'rgba(154, 230, 180, 0.3)'
                          : 'rgba(254, 178, 178, 0.3)'
                      }
                      color={pool.ilRisk.toLowerCase() === 'no' ? '#276749' : '#9B2C2C'}
                      textTransform="uppercase"
                    >
                      {pool.ilRisk.toUpperCase()}
                    </Box>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" py={8}>
                  <Text>No pools match your filter criteria</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        {hasMorePools && (
          <Box textAlign="center" mt={4}>
            <Button onClick={handleShowMore} colorScheme="brand" variant="outline" size="sm">
              Show More
            </Button>
          </Box>
        )}

        {displayCount > INITIAL_DISPLAY_COUNT && filteredPools.length > INITIAL_DISPLAY_COUNT && (
          <Box textAlign="center" mt={2}>
            <Button onClick={handleShowLess} colorScheme="brand" variant="ghost" size="sm">
              Show Less
            </Button>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
