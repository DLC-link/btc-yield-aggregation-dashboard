import { Box, Grid, Heading, Text, Stack, Badge, SimpleGrid } from '@chakra-ui/react'
import { Pool } from '../types/Pool'
import { usePools } from '../hooks/use-pools'

function formatTVL(tvl: number) {
    if (tvl >= 1e9) {
        return `$${(tvl / 1e9).toFixed(2)}B`
    }
    if (tvl >= 1e6) {
        return `$${(tvl / 1e6).toFixed(2)}M`
    }
    return `$${tvl.toLocaleString()}`
}

export function TopPools() {
    const { pools, isLoading, isError, error } = usePools()

    if (isLoading) {
        return <Text>Loading top TVL pools...</Text>
    }

    if (isError) {
        return <Text color="red.500">Error: {error?.message}</Text>
    }

    const topTVLPools = pools
        .sort((a, b) => b.tvlUsd - a.tvlUsd)
        .slice(0, 5)
        .reduce((acc, pool) => ({
            pools: [...acc.pools, pool],
            totalTVL: acc.totalTVL + pool.tvlUsd
        }), { pools: [] as Pool[], totalTVL: 0 });

    return (
        <Stack direction="column" spacing="8" width="100%">
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
            >
                <Heading as="h3" size="lg" color="brand.text" mb={2}>
                    Combined TVL: {formatTVL(topTVLPools.totalTVL)}
                </Heading>
                <Text color="brand.accent" fontSize="lg">
                    Market Share: {((topTVLPools.totalTVL / pools.reduce((sum, p) => sum + p.tvlUsd, 0)) * 100).toFixed(2)}%
                </Text>
            </Box>

            <SimpleGrid minChildWidth="250px" spacing="6">
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
                                    APY: {pool.apy.toFixed(2)}%
                                </Text>
                                {pool.apyPct7D !== null && (
                                    <Text
                                        color={pool.apyPct7D >= 0 ? "brand.accent" : "red.500"}
                                        fontSize="sm"
                                    >
                                        7d: {pool.apyPct7D > 0 ? '+' : ''}{pool.apyPct7D.toFixed(2)}%
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
        </Stack>
    )
} 
