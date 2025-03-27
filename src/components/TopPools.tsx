import { Box, Grid, Heading, Text, Stack, Badge, SimpleGrid, VStack } from '@chakra-ui/react';
import { Pool } from '../types/Pool';
import { usePoolsContext } from '../contexts/PoolsContext';
import { formatTVL } from '../utils/formatters';

export function TopPools() {
  const { pools, isLoading, isError, error } = usePoolsContext();

  if (isLoading) {
    return <Text>Loading top TVL pools...</Text>;
  }

  if (isError) {
    return <Text color="red.500">Error: {error?.message}</Text>;
  }

  const topTVLPools = pools
    .sort((a, b) => b.tvlUsd - a.tvlUsd)
    .slice(0, 5)
    .reduce(
      (acc, pool) => ({
        pools: [...acc.pools, pool],
        totalTVL: acc.totalTVL + pool.tvlUsd,
      }),
      { pools: [] as Pool[], totalTVL: 0 }
    );

  return (
    <VStack spacing="8" maxW="1400px" width="100%" mx="auto" px={4}>
      <Heading as="h2" size="lg" textAlign="center" color="brand.accent">
        Top 5 BTC Pools by TVL
      </Heading>

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
          Combined TVL: {formatTVL(topTVLPools.totalTVL)}
        </Heading>
        <Text color="brand.accent" fontSize="lg">
          Market Share:{' '}
          {((topTVLPools.totalTVL / pools.reduce((sum, p) => sum + p.tvlUsd, 0)) * 100).toFixed(2)}%
        </Text>
      </Box>

      <Box display="flex" justifyContent="center" width="100%">
        <SimpleGrid
          templateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
          spacing="6"
          maxW="1200px"
          width="100%"
          justifyItems="center"
        >
          {topTVLPools.pools.map((pool: Pool, index: number) => (
            <Box
              key={pool.pool}
              bg="brand.secondary"
              p={6}
              borderRadius="lg"
              position="relative"
              transition="transform 0.3s"
              _hover={{ transform: 'translateY(-5px)' }}
              boxShadow="md"
            >
              <Badge
                position="absolute"
                top="-3"
                left="-3"
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
                boxShadow="md"
              >
                #{index + 1}
              </Badge>

              <Heading as="h3" size="md" color="brand.accent" mb={4}>
                {pool.project} - {pool.symbol}
              </Heading>

              <Stack direction="column" spacing="4">
                <Box
                  w="100%"
                  bg="white"
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor="brand.accent"
                >
                  <Text fontSize="lg" fontWeight="bold" color="brand.accent">
                    TVL: {formatTVL(pool.tvlUsd)}
                  </Text>
                  <Text color="brand.accent" fontSize="sm">
                    {((pool.tvlUsd / topTVLPools.totalTVL) * 100).toFixed(2)}% of top 5
                  </Text>
                </Box>

                <Box
                  w="100%"
                  bg="white"
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor="brand.secondary"
                >
                  <Text fontSize="lg" fontWeight="bold" color="brand.accent">
                    APY: {pool.apy}%
                  </Text>
                  {pool.apyPct7D !== null && (
                    <Text color={pool.apyPct7D >= 0 ? 'brand.accent' : 'red.500'} fontSize="sm">
                      7d: {pool.apyPct7D > 0 ? '+' : ''}
                      {pool.apyPct7D}%
                    </Text>
                  )}
                  {pool.apyPct30D !== null && (
                    <Text color={pool.apyPct30D >= 0 ? 'brand.accent' : 'red.500'} fontSize="sm">
                      30d: {pool.apyPct30D > 0 ? '+' : ''}
                      {pool.apyPct30D}%
                    </Text>
                  )}
                </Box>

                <Grid
                  w="100%"
                  templateColumns="1fr 1fr"
                  gap={4}
                  bg="brand.secondary"
                  p={4}
                  borderRadius="md"
                >
                  <Text color="brand.text">IL Risk: {pool.ilRisk}</Text>
                  <Text color="brand.text">Exposure: {pool.exposure}</Text>
                </Grid>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
