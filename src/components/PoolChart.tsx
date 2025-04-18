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

Highcharts.setOptions({
  chart: {
    animation: false,
    style: { fontFamily: 'Inter, system-ui, sans-serif' },
  },
  plotOptions: {
    series: { animation: false },
  },
});

export function PoolChart() {
  const { chartData, isLoading, isError, error } = useCharts();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) return <Text>Loading chart data...</Text>;
  if (isError) return <Text color="red.500">Error: {error?.message}</Text>;

  const barOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: {
      text: 'TVL & APY Comparison',
      style: { color: useColorModeValue('#2D3748', '#E2E8F0') },
    },
    xAxis: {
      categories: chartData.map(p => `${p.project} - ${p.symbol}`),
      labels: {
        rotation: -15,
        align: 'right',
        style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
      },
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: 'TVL (USD)',
          style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
        },
        labels: {
          formatter() {
            return  formatYAxis(this.value as number);
          },
          style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
        },
        gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
      },
      {
        title: {
          text: 'APY (%)',
          style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
        },
        labels: {
          formatter() {
            return `${(this.value as number).toFixed(2)}%`;
          },
          style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
        },
        opposite: true,
        gridLineWidth: 0,
      },
    ],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter(this: any) {
        const header = `<b>${this.key}</b><br/>`;
        const lines = this.points.map((pt: any) => {
          const isApy = pt.series.userOptions.yAxis === 1;
          const val = isApy ? (pt.y * 1).toFixed(2) + '%' : '$' + pt.y.toLocaleString();
          return `<span style="color:${pt.color}">\u25CF</span> ${pt.series.name}: <b>${val}</b>`;
        });
        return header + lines.join('<br/>');
      },
      backgroundColor: useColorModeValue('white', 'gray.800'),
      style: { color: useColorModeValue('#2D3748', '#A0AEC0') },
    },

    plotOptions: {
      column: {
        pointPadding: 0.1,
        groupPadding: 0.1,
        borderWidth: 0,
        pointWidth: 20,
      },
    },
    series: [
      {
        name: 'TVL',
        type: 'column',
        data: chartData.map(p => p.data.slice(-1)[0]?.tvlUsd ?? 0),
        color: CHART_COLORS[0],
        yAxis: 0,
      },
      {
        name: 'APY',
        type: 'column',
        data: chartData.map(p => (p.data.slice(-1)[0]?.apy ?? 0) * 100),
        color: CHART_COLORS[1],
        yAxis: 1,
      },
    ],
  };

  const tvlOptions: Highcharts.Options = {
    chart: { type: 'line', height: 400, backgroundColor: 'transparent' },
    title: {
      text: 'Total Value Locked (TVL)',
      style: { color: useColorModeValue('#2D3748', '#E2E8F0') },
    },
    xAxis: {
      type: 'datetime',
      labels: { style: { color: useColorModeValue('#4A5568', '#A0AEC0') } },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    yAxis: {
      title: { text: 'TVL (USD)', style: { color: useColorModeValue('#4A5568', '#A0AEC0') } },
      labels: {
        formatter() {
          return formatYAxis(this.value as number);
        },
        style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
      },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>${point.y:,.0f}</b></td></tr>',
      footerFormat: '</table>',
      backgroundColor: useColorModeValue('white', 'gray.800'),
      style: { color: useColorModeValue('#2D3748', '#E2E8F0') },
    },
    plotOptions: { line: { marker: { enabled: true, radius: 4, symbol: 'circle' } } },
    series: chartData.map((pool, i) => ({
      type: 'line',
      name: `${pool.project} - ${pool.symbol}`,
      data: pool.data.map(pt => [new Date(pt.timestamp).getTime(), pt.tvlUsd]),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
  };

  // --- 折线图：APY ---
  const apyOptions: Highcharts.Options = {
    ...tvlOptions,
    title: {
      text: 'Annual Percentage Yield (APY)',
      style: { color: useColorModeValue('#2D3748', '#E2E8F0') },
    },
    yAxis: {
      title: { text: 'APY (%)', style: { color: useColorModeValue('#4A5568', '#A0AEC0') } },
      labels: {
        formatter() {
          return `${(this.value as number).toFixed(2)}%`;
        },
        style: { color: useColorModeValue('#4A5568', '#A0AEC0') },
      },
      gridLineColor: useColorModeValue('#E2E8F0', '#2D3748'),
    },
    tooltip: {
      ...tvlOptions.tooltip!,
      pointFormat:
        '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y:.2f}%</b></td></tr>',
    },
    series: chartData.map((pool, i) => ({
      type: 'line',
      name: `${pool.project} - ${pool.symbol}`,
      data: pool.data.map(pt => [new Date(pt.timestamp).getTime(), pt.apy * 100]),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
  };

  return (
    <Box width="100%" maxW="1200px" mx="auto" px={6}>
      <Box mb={6} bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <HighchartsReact highcharts={Highcharts} options={barOptions} />
      </Box>

      <HStack spacing={2} mb={4}>
        <Heading as="h2" size="lg" color="brand.accent">
          Pool Performance Charts
        </Heading>
        <Tooltip label="Click to switch charts." hasArrow>
          <Icon as={FiInfo} color="brand.accent" />
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

      {/* 3. Pool Details 表格 */}
      <Box
        overflowX="auto"
        bg={bgColor}
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        mb={8}
      >
        <Heading size="md" mb={4}>
          Pool Details
        </Heading>
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Pool</Th>
              <Th textAlign="center">TVL</Th>
              <Th textAlign="center">APY</Th>
              <Th textAlign="center">7D Growth</Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...chartData]
              .sort((a, b) => b.growthRate - a.growthRate)
              .map((pool, i) => {
                const last = pool.data.slice(-1)[0]!;
                return (
                  <Tr key={pool.pool} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td>
                      <HStack spacing={2}>
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                        <Box>
                          <Text fontWeight="medium">{pool.project}</Text>
                          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            {pool.symbol}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td textAlign="center">{formatTVL(last.tvlUsd)}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={last.apy >= 0.05 ? 'green' : 'blue'}>
                        {(last.apy * 100).toFixed(2)}%
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <HStack spacing={1} justify="center">
                        <Icon
                          as={pool.growthRate >= 0 ? FiTrendingUp : FiTrendingDown}
                          color={pool.growthRate >= 0 ? 'green.500' : 'red.500'}
                        />
                        <Badge colorScheme={pool.growthRate >= 0 ? 'green' : 'red'}>
                          {pool.growthRate >= 0 ? '+' : ''}
                          {pool.growthRate.toFixed(2)}%
                        </Badge>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
