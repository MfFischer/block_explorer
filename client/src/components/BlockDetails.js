// src/components/BlockDetails.js
import React from 'react';
import './BlockDetails.scss'; // Import styles for BlockDetails

const BlockDetails = ({ blockData }) => {
  if (!blockData || !blockData.blockData) {
    return <div>Loading or no data available...</div>;
  }

  // Verify data structure with console log
  console.log('blockData.blockData:', blockData.blockData);

  // Destructure block and gas metric data from the response
  const { number, timestamp, miner, transactions, gasLimit, gasUsed } = blockData.blockData;
  const { totalGasUsed, averageGasPrice, baseFeePerGas, averagePriorityFee, totalPriorityFees } = blockData.gasMetrics || {};

  // Check if gasLimit and gasUsed are objects and convert to strings if necessary
  const formattedGasLimit = typeof gasLimit === 'object' ? JSON.stringify(gasLimit) : gasLimit;
  const formattedGasUsed = typeof gasUsed === 'object' ? JSON.stringify(gasUsed) : gasUsed;
  
  // Additional formatting for transactions if necessary
  const formattedTransactions = Array.isArray(transactions) ? transactions.length : transactions;

  return (
    <div className="block-details">
      <h2>Block Details</h2>
      <ul>
        <li><strong>Block Number:</strong> {number}</li>
        <li><strong>Timestamp:</strong> {new Date(timestamp * 1000).toLocaleString()}</li>
        <li><strong>Miner:</strong> {miner}</li>
        <li><strong>Number of Transactions:</strong> {formattedTransactions}</li>
        <li><strong>Gas Limit:</strong> {formattedGasLimit}</li>
        <li><strong>Gas Used:</strong> {formattedGasUsed}</li>
      </ul>
      <h2>Gas Metrics</h2>
      <ul>
        <li><strong>Total Gas Used:</strong> {totalGasUsed || 'N/A'}</li>
        <li><strong>Average Gas Price:</strong> {averageGasPrice || 'N/A'} Gwei</li>
        <li><strong>Base Fee Per Gas:</strong> {baseFeePerGas || 'N/A'} Gwei</li>
        <li><strong>Average Priority Fee:</strong> {averagePriorityFee || 'N/A'} Gwei</li>
        <li><strong>Total Priority Fees:</strong> {totalPriorityFees || 'N/A'} Gwei</li>
      </ul>
    </div>
  );
};

export default BlockDetails;
