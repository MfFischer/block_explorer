// src/components/GasAnalytics.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Import necessary components
import './GasAnalytics.scss'; // Import styles for GasAnalytics
import { BigNumber } from '@ethersproject/bignumber'; // Correct import for BigNumber
import { formatUnits } from '@ethersproject/units'; // Correct import for formatUnits

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GasAnalytics = ({ blockData }) => {
  if (!blockData || !blockData.blockData) {
    return <div>Loading or no gas data available...</div>;
  }

  const { transactions } = blockData.blockData;

  if (!transactions || transactions.length === 0) {
    return <div>No transaction data available for this block.</div>;
  }

  // Helper function to safely convert BigNumberish values to numbers
  const safeFormatUnits = (value, unit) => {
    try {
      // Check if value is a valid BigNumber object and format it
      return parseFloat(formatUnits(BigNumber.from(value), unit));
    } catch (error) {
      console.error("Invalid BigNumberish value:", value, error);
      return 0;
    }
  };

  // Process transaction data for visualization
  const transactionLabels = transactions.map((tx) => `${tx.hash.substring(0, 6)}...`);

  // Safely format gasUsed and gasPrice, fallback to 0 if value is null or invalid
  const gasUsedData = transactions.map((tx) =>
    tx.gasUsed ? safeFormatUnits(tx.gasUsed, 'gwei') : 0
  );
  const gasPriceData = transactions.map((tx) =>
    tx.gasPrice ? safeFormatUnits(tx.gasPrice, 'gwei') : 0
  );

  // Data for Gas Metrics Chart
  const gasMetricsData = {
    labels: transactionLabels,
    datasets: [
      {
        label: 'Gas Used (in Gwei)',
        data: gasUsedData,
        backgroundColor: '#66FCF1',
      },
      {
        label: 'Gas Price (in Gwei)',
        data: gasPriceData,
        backgroundColor: '#45A29E',
      },
    ],
  };

  // Options for Gas Metrics Chart
  const gasMetricsOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gas Usage and Prices for Transactions in the Block',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Transaction Hash (Shortened)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value (in Gwei)',
        },
      },
    },
  };

  return (
    <div className="gas-analytics">
      <h2>Gas Analysis of Transactions</h2>
      <div className="gas-chart">
        <Bar data={gasMetricsData} options={gasMetricsOptions} />
      </div>
    </div>
  );
};

export default GasAnalytics;
