import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCharts } from '../hooks/useCharts';
import { formatTVL, formatYAxis } from '../utils/formatters';
import { CHART_COLORS } from '../constants/config';
import { FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';

// Initialize Highcharts with dark mode support
if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  });
}

export function PoolChart() {
  const { chartData, isLoading, isError, error } = useCharts();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return <Text>Loading chart data...</Text>;
  }

  if (isError) {
    return <Text color="red.500">Error: {error?.message}</Text>;
  }

  const tvlOptions: Highcharts.Options = {
    chart: {
      type: 'line',
      height: 400,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      width: null,
      spacingLeft: 10,
      spacingRight: 10,
      spacingBottom: 10,
      spacingTop: 10,
    },
    title: {
      text: 'Total Value Locked (TVL)',
      style: {
        color: useColorModeValue('#2D3748', '#E2E8F0'),
      },
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: useColorModeValue('#4A5568', '#A0AEC0'),
        },
      },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    yAxis: {
      title: {
        text: 'TVL (USD)',
        style: {
          color: useColorModeValue('#4A5568', '#A0AEC0'),
        },
      },
      labels: {
        formatter: function () {
          return formatYAxis(this.value as number);
        },
        style: {
          color: useColorModeValue('#4A5568', '#A0AEC0'),
        },
      },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y:,.0f}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 0,
      valuePrefix: '$',
      backgroundColor: useColorModeValue('white', 'gray.800'),
      style: {
        color: useColorModeValue('#2D3748', '#E2E8F0'),
      },
    },
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      x: -10,
      y: 100,
      itemStyle: {
        color: useColorModeValue('#4A5568', '#A0AEC0'),
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle',
        },
      },
    },
    series: chartData.map((pool, index) => ({
      type: 'line',
      name: `${pool.project} - ${pool.symbol}`,
      data: pool.data.map(point => ({
        x: new Date(point.timestamp).getTime(),
        y: point.tvlUsd,
      })),
      color: CHART_COLORS[index % CHART_COLORS.length],
    })),
  };

  const apyOptions: Highcharts.Options = {
    ...tvlOptions,
    title: {
      text: 'Annual Percentage Yield (APY)',
      style: {
        color: useColorModeValue('#2D3748', '#E2E8F0'),
      },
    },
    yAxis: {
      title: {
        text: 'APY (%)',
        style: {
          color: useColorModeValue('#4A5568', '#A0AEC0'),
        },
      },
      labels: {
        formatter: function () {
          return `${(this.value as number).toFixed(2)}%`;
        },
        style: {
          color: useColorModeValue('#4A5568', '#A0AEC0'),
        },
      },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    tooltip: {
      ...tvlOptions.tooltip,
      valueDecimals: 2,
      valueSuffix: '%',
      valuePrefix: '',
    },
    series: chartData.map((pool, index) => ({
      type: 'line',
      name: `${pool.project} - ${pool.symbol}`,
      data: pool.data.map(point => ({
        x: new Date(point.timestamp).getTime(),
        y: point.apy,
      })),
      color: CHART_COLORS[index % CHART_COLORS.length],
    })),
  };

  return (
    <Box width="100%" maxW="1200px" mx="auto" px={6}>
      <HStack spacing={2}>
        <Heading as="h2" size="lg" textAlign="center" color="brand.accent">
          Pool Performance Charts
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
              <Text>6. Calculate 7-day growth rates</Text>
              <Text mt={2}>Charts show TVL and APY trends over time for filtered pools.</Text>
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

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>TVL Chart</Tab>
          <Tab>APY Chart</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <HighchartsReact highcharts={Highcharts} options={tvlOptions} />
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <HighchartsReact highcharts={Highcharts} options={apyOptions} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box
        overflowX="auto"
        bg={bgColor}
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4}>
          Pool Details
        </Heading>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th width="40%">Pool</Th>
              <Th width="20%" textAlign="center">
                TVL
              </Th>
              <Th width="20%" textAlign="center">
                APY
              </Th>
              <Th width="20%" textAlign="center">
                7D Growth
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...chartData]
              .sort((a, b) => b.growthRate - a.growthRate)
              .map((pool, index) => (
                <Tr
                  key={pool.poolId}
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  transition="background-color 0.2s"
                >
                  <Td>
                    <HStack spacing={2}>
                      <Box
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                      <Box>
                        <Box fontWeight="medium">{pool.project}</Box>
                        <Box fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                          {pool.symbol}
                        </Box>
                      </Box>
                    </HStack>
                  </Td>
                  <Td fontWeight="medium" textAlign="center">
                    {formatTVL(pool.data[pool.data.length - 1]?.tvlUsd || 0)}
                  </Td>
                  <Td textAlign="center">
                    <Badge
                      colorScheme={pool.data[pool.data.length - 1]?.apy >= 5 ? 'green' : 'blue'}
                      fontSize="sm"
                      px={2}
                      py={1}
                      borderRadius="md"
                      minW="80px"
                      textAlign="center"
                      display="inline-block"
                    >
                      {(pool.data[pool.data.length - 1]?.apy || 0).toFixed(2)}%
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <HStack spacing={1} justify="center">
                      <Icon
                        as={pool.growthRate >= 0 ? FiTrendingUp : FiTrendingDown}
                        color={pool.growthRate >= 0 ? 'green.500' : 'red.500'}
                        boxSize={4}
                      />
                      <Badge
                        colorScheme={pool.growthRate >= 0 ? 'green' : 'red'}
                        fontSize="sm"
                        px={2}
                        py={1}
                        borderRadius="md"
                        minW="80px"
                        textAlign="center"
                        display="inline-block"
                      >
                        {pool.growthRate >= 0 ? '+' : ''}
                        {pool.growthRate.toFixed(2)}%
                      </Badge>
                    </HStack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
