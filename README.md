# BTC Yield Farming Dashboard

A comprehensive dashboard for tracking and analyzing Bitcoin (BTC) yield farming opportunities across various liquidity pools. The application provides real-time data visualization, performance metrics, and detailed analytics for BTC liquidity pools.

## Features

- **Top TVL Pools**: View the top 5 BTC pools by Total Value Locked (TVL)
- **Top Yield Pools**: Discover the highest yielding BTC pools sorted by APY
- **Performance Charts**: Interactive charts showing TVL and APY trends over time
- **Pool Details**: Comprehensive information about each pool including TVL, APY, growth rates, and risk metrics
- **Dynamic Filtering**: Automatic filtering based on current BTC price and TVL thresholds
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Frontend
- **React**: UI framework (v19.0.0)
- **TypeScript**: Type-safe JavaScript
- **Chakra UI**: Component library for consistent design
- **Highcharts**: Interactive charting library
- **React Icons**: Icon library
- **React Query**: Data fetching and caching

### Data Processing
- **BTC Price API**: Real-time Bitcoin price data
- **Pool Data API**: Liquidity pool information
- **Custom Hooks**: Data processing and filtering logic

### Testing
- **Vitest**: Testing framework
- **React Testing Library**: Component testing utilities
- **Jest DOM**: DOM testing utilities

## Data Processing Logic

### Pool Filtering
1. Filter pools to include only those with "BTC" in their symbol
2. Calculate minimum TVL threshold: 50 BTC * current BTC price
3. Filter pools with TVL ≥ minimum threshold
4. Sort pools by TVL (for TVL view) or APY (for yield view)
5. Select top 5 pools

### Metrics Calculation
- **TVL**: Total Value Locked in USD
- **APY**: Annual Percentage Yield
- **Growth Rate**: 7-day percentage change in TVL
- **Risk Assessment**: Based on impermanent loss risk and exposure metrics

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/btc-yield-dashboard.git
   cd btc-yield-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Running Tests

To run the tests:

```
npm test
```

or

```
yarn test
```

For watch mode during development:

```
npm run test:watch
```

or

```
yarn test:watch
```

## Project Structure

```
src/
├── components/         # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── test/               # Test setup and utilities
```

## Key Components

- **TopPools**: Displays top 5 BTC pools by TVL
- **TopYieldPools**: Shows top 5 BTC pools by APY
- **PoolChart**: Interactive charts for TVL and APY trends
- **PoolCard**: Individual pool information display

## Data Sources

The application fetches data from:
- Bitcoin price API for current BTC value
- Liquidity pool API for pool metrics and historical data

## Testing

The application includes comprehensive tests for:

1. **Data Processing Logic**:
   - Pool filtering by BTC symbol
   - TVL threshold calculations
   - Sorting by TVL and APY
   - Top pool selection

2. **Metrics Calculation**:
   - Total TVL calculation
   - Average APY calculation
   - Growth rate calculation

3. **Formatter Functions**:
   - TVL formatting
   - Y-axis value formatting

4. **Custom Hooks**:
   - useTopPools
   - useTopYieldPools
   - useCharts
   - useBtcPrice

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by [Your Data Source]
- Icons from React Icons
- Charts powered by Highcharts
