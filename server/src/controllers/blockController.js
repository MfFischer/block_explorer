// src/controllers/blockController.js
const { fetchBlockData, calculateGasMetrics, analyzePreEIP1559Block } = require('../services/blockService');
const { ethers } = require('ethers'); // Import ethers library

const getBlockData = async (req, res) => {
  let { blockNumber } = req.params;

  // Sanitize and validate the block number input
  blockNumber = blockNumber.trim();

  // Check if blockNumber is a valid positive integer or 'latest'
  if (blockNumber !== 'latest' && !/^\d+$/.test(blockNumber)) {
    return res.status(400).json({ error: 'Invalid block number format. Please enter a valid block number or "latest".' });
  }

  try {
    // Fetch block data using the service
    const blockData = await fetchBlockData(blockNumber);

    // Check if the block number is pre-EIP-1559
    if (!blockData.baseFeePerGas) {
      // Analyze pre-EIP-1559 block and generate insights
      const preEIP1559Insights = analyzePreEIP1559Block(blockData);
      return res.status(200).json({
        message: 'This is a pre-EIP-1559 block, base fee per gas is not available.',
        blockData: {
          number: blockData.number,
          miner: blockData.miner,
          gasUsed: ethers.utils.formatUnits(blockData.gasUsed, 'gwei'),
          gasLimit: ethers.utils.formatUnits(blockData.gasLimit, 'gwei'),
          transactions: blockData.transactions.length,
        },
        insights: preEIP1559Insights, // Include insights in the response
      });
    }

    // Calculate detailed gas-related metrics for post-EIP-1559 blocks
    const gasMetrics = calculateGasMetrics(blockData);

    // Respond with block data and gas metrics
    return res.json({ blockData, gasMetrics });
  } catch (error) {
    console.error('Error fetching block data:', error);
    if (error.message.includes('higher than the latest block')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBlockData,
};
