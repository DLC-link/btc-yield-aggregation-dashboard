import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Heading, HStack, VStack, SimpleGrid, Tabs, TabList, TabPanels, TabPanel, Tab, TableContainer, Icon } from '@chakra-ui/react'
import { useCharts } from '../hooks/useCharts'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { formatTVL, formatYAxis } from '../utils/formatters'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c']

export function PoolChart() {
    const { chartData, isLoading, isError, error } = useCharts()

    if (isLoading) {
        return <Text>Loading chart data...</Text>
    }

    if (isError) {
        return <Text color="red.500">Error: {error?.message}</Text>
    }

    // Prepare data for the chart
    const chartDataFormatted = chartData.map(pool => ({
        ...pool,
        data: pool.data.map(point => ({
            ...point,
            date: new Date(point.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
            tvlFormatted: point.tvlUsd,
            [`${pool.project}-${pool.symbol}-TVL`]: point.tvlUsd,
            [`${pool.project}-${pool.symbol}-APY`]: point.apy
        }))
    }))

    // Combine data points for all pools
    const combinedData = chartDataFormatted[0]?.data.map((point, index) => {
        const combinedPoint: any = { date: point.date }
        chartDataFormatted.forEach(pool => {
            const poolPoint = pool.data[index]
            if (poolPoint) {
                combinedPoint[`${pool.project}-${pool.symbol}-TVL`] = poolPoint.tvlFormatted
                combinedPoint[`${pool.project}-${pool.symbol}-APY`] = poolPoint.apy
            }
        })
        return combinedPoint
    }) || []

    return (
        <Box width="100%" maxW="1200px" mx="auto" px={6}>
            <Heading as="h3" size="md" mb={4} color="brand.accent">
                Top 5 BTC Pools by TVL - Last 7 Days Performance
            </Heading>

            {/* Growth Rate Section */}
            <Box mb={8} bg="white" p={4} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200">
                <Text fontSize="sm" color="gray.600" mb={3}>Growth Rate (7 Days)</Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
                    {chartData.map((pool, index) => (
                        <Box 
                            key={pool.poolId}
                            p={3}
                            borderRadius="md"
                            bg={index === 0 ? "green.50" : "gray.50"}
                            border="1px"
                            borderColor={index === 0 ? "green.200" : "gray.200"}
                        >
                            <VStack align="start" spacing={1}>
                                <HStack spacing={2}>
                                    <Box 
                                        w={3} 
                                        h={3} 
                                        bg={COLORS[index % COLORS.length]} 
                                        borderRadius="sm"
                                    />
                                    <Text fontSize="sm" fontWeight="medium">{pool.symbol}</Text>
                                </HStack>
                                <Text fontSize="xs" color="gray.600">{pool.project}</Text>
                                <HStack spacing={1}>
                                    <Text 
                                        fontSize="sm" 
                                        fontWeight="bold" 
                                        color={pool.growthRate >= 0 ? "green.500" : "red.500"}
                                    >
                                        {pool.growthRate >= 0 ? "+" : ""}{pool.growthRate.toFixed(2)}%
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">growth</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Charts Section */}
            <Tabs variant="enclosed" mb={8}>
                <TabList>
                    <Tab>TVL Chart</Tab>
                    <Tab>APY Chart</Tab>
                </TabList>

                <TabPanels>
                    {/* TVL Chart Panel */}
                    <TabPanel>
                        <Box height="400px" position="relative" bg="white" p={4} borderRadius="lg" boxShadow="sm">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={combinedData}
                                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis 
                                        dataKey="date" 
                                        padding={{ left: 10, right: 10 }}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis 
                                        tickFormatter={formatYAxis}
                                        width={80}
                                        scale="log"
                                        domain={['auto', 'auto']}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        formatter={(value: number, name: string) => [formatYAxis(value), name]}
                                        labelStyle={{ fontSize: 12 }}
                                        contentStyle={{ fontSize: 12 }}
                                    />
                                    {chartData.map((pool, index) => (
                                        <Line 
                                            key={`${pool.poolId}-tvl`}
                                            type="monotone" 
                                            dataKey={`${pool.project}-${pool.symbol}-TVL`}
                                            stroke={COLORS[index % COLORS.length]} 
                                            name={`${pool.project} - ${pool.symbol}`}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </TabPanel>

                    {/* APY Chart Panel */}
                    <TabPanel>
                        <Box height="400px" position="relative" bg="white" p={4} borderRadius="lg" boxShadow="sm">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={combinedData}
                                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis 
                                        dataKey="date" 
                                        padding={{ left: 10, right: 10 }}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `${value.toFixed(2)}%`}
                                        width={80}
                                        domain={[0, 'auto']}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                                        labelStyle={{ fontSize: 12 }}
                                        contentStyle={{ fontSize: 12 }}
                                    />
                                    {chartData.map((pool, index) => (
                                        <Line 
                                            key={`${pool.poolId}-apy`}
                                            type="monotone" 
                                            dataKey={`${pool.project}-${pool.symbol}-APY`}
                                            stroke={COLORS[index % COLORS.length]} 
                                            name={`${pool.project} - ${pool.symbol}`}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Legend */}
            <Box mb={8} bg="white" p={4} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.200">
                <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                    {chartData.map((pool, index) => (
                        <HStack key={pool.poolId} spacing={2}>
                            <Box 
                                w={3} 
                                h={3} 
                                bg={COLORS[index % COLORS.length]} 
                                borderRadius="sm"
                            />
                            <Text fontSize="sm">{pool.project} - {pool.symbol}</Text>
                        </HStack>
                    ))}
                </SimpleGrid>
            </Box>

            {/* Table Section */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                <Text fontSize="lg" fontWeight="bold" mb={4}>Pool Details</Text>
                <TableContainer>
                    <Table variant="simple" size="md">
                        <Thead>
                            <Tr>
                                <Th>Pool</Th>
                                <Th isNumeric>TVL</Th>
                                <Th isNumeric>APY</Th>
                                <Th isNumeric>7D Growth</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {[...chartData]
                                .sort((a, b) => b.growthRate - a.growthRate)
                                .map((pool, index) => (
                                <Tr key={pool.poolId}>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Box
                                                w={3}
                                                h={3}
                                                borderRadius="full"
                                                bg={COLORS[index % COLORS.length]}
                                            />
                                            <Text fontWeight="medium">
                                                {pool.project} - {pool.symbol}
                                            </Text>
                                        </HStack>
                                    </Td>
                                    <Td isNumeric fontWeight="medium">
                                        {formatTVL(pool.data[pool.data.length - 1].tvlUsd)}
                                    </Td>
                                    <Td isNumeric fontWeight="medium">
                                        {pool.data[pool.data.length - 1].apy.toFixed(2)}%
                                    </Td>
                                    <Td isNumeric>
                                        <HStack spacing={1} justify="flex-end">
                                            <Text
                                                color={pool.growthRate >= 0 ? 'green.500' : 'red.500'}
                                                fontWeight="medium"
                                            >
                                                {pool.growthRate >= 0 ? '+' : ''}{pool.growthRate.toFixed(2)}%
                                            </Text>
                                            <Icon
                                                as={pool.growthRate >= 0 ? FiTrendingUp : FiTrendingDown}
                                                color={pool.growthRate >= 0 ? 'green.500' : 'red.500'}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
