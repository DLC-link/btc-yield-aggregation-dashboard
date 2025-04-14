import { useState, useRef } from 'react';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, VStack, useColorModeValue, Badge, HStack, Icon, Tooltip, Button, Spinner } from '@chakra-ui/react';

import { useTopPools } from '../hooks/useTopPools';
import { formatTVL } from '../utils/formatters';
import { FiInfo } from 'react-icons/fi';

const INITIAL_DISPLAY_COUNT = 5;
const LOAD_MORE_COUNT = 10;

export function TopPools() {
  const { topPools, totalTVL, isLoading, isError, error } = useTopPools();
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const tableRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const displayedPools = topPools.slice(0, displayCount);
  const hasMorePools = displayCount < topPools.length;

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, topPools.length));
  };

  const handleShowLess = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <VStack spacing="8" maxW="1400px" width="100%" mx="auto" px={4}>
      <HStack spacing={2}>
        <Heading as="h2" size="lg" textAlign="center" color="brand.accent">
          Top BTC Pools by TVL
        </Heading>
        <Tooltip 
          label={
            <Box>
              <Text mb={2}>Data Processing Steps:</Text>
              <Text>1. Filter pools with "BTC" in symbol</Text>
              <Text>2. Calculate minimum TVL threshold (50 BTC * current BTC price)</Text>
              <Text>3. Filter pools with TVL ≥ threshold</Text>
              <Text>4. Sort by TVL (descending)</Text>
              <Text>5. Select top 5 pools</Text>
              <Text mt={2}>Combined TVL shows total value locked in filtered pools.</Text>
            </Box>
          }
          hasArrow
          placement="right"
        >
          <Box>
            <Icon as={FiInfo} color="brand.accent" cursor="help" />
          </Box>
        </Tooltip>
      </HStack>

      <Box
        bg="brand.secondary"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="brand.accent"
        textAlign="center"
        width="100%"
      >
        <Heading as="h3" size="lg" color="brand.text" mb={2}>
          Combined TVL: {formatTVL(totalTVL)}
        </Heading>
      </Box>

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
              <Th width="20%" textAlign="center">TVL</Th>
              <Th width="20%" textAlign="center">APY</Th>
              <Th width="10%" textAlign="center">Risk</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedPools.map((pool, index) => (
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
                    fontSize="lg"
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
                  <Badge
                    colorScheme={pool.ilRisk === 'LOW' ? 'green' : pool.ilRisk === 'MEDIUM' ? 'yellow' : 'red'}
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="md"
                    minW="80px"
                    textAlign="center"
                    display="inline-block"
                  >
                    {pool.ilRisk}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {hasMorePools && (
          <Box textAlign="center" mt={4}>
            <Button
              onClick={handleShowMore}
              colorScheme="brand"
              variant="outline"
              size="sm"
            >
              Show More
            </Button>
          </Box>
        )}
        {displayCount > INITIAL_DISPLAY_COUNT && (
          <Box textAlign="center" mt={2}>
            <Button
              onClick={handleShowLess}
              colorScheme="brand"
              variant="ghost"
              size="sm"
            >
              Show Less
            </Button>
          </Box>
        )}
      </Box>
    </VStack>
  );
}
