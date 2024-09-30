// src/services/blockService.js
require('dotenv').config();
const { ethers } = require('ethers');

// Initialize Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_NODE_URL);

// Function to fetch detailed block data
const fetchBlockData = async (blockNumber) => {
  try {
    // Fetch the block data with transactions
    const block = blockNumber === 'latest' 
      ? await provider.getBlockWithTransactions('latest') 
      : await provider.getBlockWithTransactions(parseInt(blockNumber, 10));

    if (!block) {
      throw new Error(`Block ${blockNumber} not found`);
    }

    // Convert gasLimit and gasUsed to human-readable strings
    block.gasLimit = ethers.utils.formatUnits(block.gasLimit, 'wei');
    block.gasUsed = ethers.utils.formatUnits(block.gasUsed, 'wei');

    // Log base fee details for analysis
    console.log(`Block Number: ${block.number}`);
    console.log(`Base Fee Per Gas: ${block.baseFeePerGas ? ethers.utils.formatUnits(block.baseFeePerGas, 'gwei') : 'N/A'}`);
    
    return block;
  } catch (error) {
    console.error('Error in fetchBlockData:', error);
    throw error;
  }
};

// Function to calculate detailed gas metrics including base fee and priority fees
const calculateGasMetrics = (blockData) => {
  // Determine if the block follows EIP-1559
  const isEIP1559 = !!blockData.baseFeePerGas;

  // Initialize variables for calculations
  const totalGasUsed = blockData.transactions.reduce((acc, tx) => {
    const gasUsed = tx.gasUsed ? ethers.BigNumber.from(tx.gasUsed.toString()) : ethers.BigNumber.from(0);
    return acc.add(gasUsed);
  }, ethers.BigNumber.from(0));
  
  const totalGasPrice = blockData.transactions.reduce((acc, tx) => {
    const gasPrice = tx.gasPrice ? ethers.BigNumber.from(tx.gasPrice.toString()) : ethers.BigNumber.from(0);
    return acc.add(gasPrice);
  }, ethers.BigNumber.from(0));

  const avgGasPrice = totalGasPrice.gt(0) ? totalGasPrice.div(blockData.transactions.length) : ethers.BigNumber.from(0);

  // Calculate total priority fees if available
  const totalPriorityFees = blockData.transactions.reduce((acc, tx) => 
    acc.add(tx.maxPriorityFeePerGas ? ethers.BigNumber.from(tx.maxPriorityFeePerGas.toString()) : ethers.BigNumber.from(0)), 
    ethers.BigNumber.from(0)
  );

  // Calculate base fee and average priority fee per gas
  const baseFeePerGas = blockData.baseFeePerGas || ethers.BigNumber.from(0);
  const avgPriorityFee = totalPriorityFees.gt(0) ? totalPriorityFees.div(blockData.transactions.length) : ethers.BigNumber.from(0);

  // Enhanced gas metrics with detailed transaction analysis
  const gasMetrics = {
    totalGasUsed: ethers.utils.formatUnits(totalGasUsed, 'gwei'),
    averageGasPrice: ethers.utils.formatUnits(avgGasPrice, 'gwei'),
    baseFeePerGas: isEIP1559 ? ethers.utils.formatUnits(baseFeePerGas, 'gwei') : 'N/A',
    averagePriorityFee: isEIP1559 ? ethers.utils.formatUnits(avgPriorityFee, 'gwei') : 'N/A',
    totalPriorityFees: ethers.utils.formatUnits(totalPriorityFees, 'gwei'),
    topSpenders: blockData.transactions
      .map((tx) => {
        const gasUsed = tx.gasUsed ? ethers.BigNumber.from(tx.gasUsed.toString()) : ethers.BigNumber.from(0);
        const gasPrice = tx.gasPrice ? ethers.BigNumber.from(tx.gasPrice.toString()) : ethers.BigNumber.from(0);
        return {
          from: tx.from,
          gasUsed: ethers.utils.formatUnits(gasUsed, 'gwei'),
          gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
          maxFeePerGas: ethers.utils.formatUnits(tx.maxFeePerGas ? ethers.BigNumber.from(tx.maxFeePerGas.toString()) : gasPrice, 'gwei'), // Post EIP-1559 max fee
          maxPriorityFeePerGas: ethers.utils.formatUnits(tx.maxPriorityFeePerGas ? ethers.BigNumber.from(tx.maxPriorityFeePerGas.toString()) : ethers.BigNumber.from(0), 'gwei'),
        };
      })
      .filter(tx => tx.gasUsed !== '0.0') // Filter out transactions with zero gas used
      .sort((a, b) => ethers.BigNumber.from(b.gasUsed).sub(ethers.BigNumber.from(a.gasUsed)))
      .slice(0, 5), // Top 5 gas spenders
  };

  // Log the gas metrics for verification
  console.log(`Calculated gas metrics for block ${blockData.number}:`, gasMetrics);

  return gasMetrics;
};

// Function to analyze transactions in pre-EIP-1559 blocks
const analyzePreEIP1559Block = (blockData) => {
  // Calculate total gas fees paid to the miner
  const totalTransactionFees = blockData.transactions.reduce((acc, tx) => {
    const gasUsed = tx.gasUsed ? ethers.BigNumber.from(tx.gasUsed.toString()) : ethers.BigNumber.from(0);
    const gasPrice = tx.gasPrice ? ethers.BigNumber.from(tx.gasPrice.toString()) : ethers.BigNumber.from(0);
    return acc.add(gasUsed.mul(gasPrice));
  }, ethers.BigNumber.from(0));

  // Calculate the miner reward for the block
  const blockReward = ethers.utils.parseEther("3"); // 3 ETH block reward before 2017-10-16
  const minerReward = blockReward.add(totalTransactionFees);

  // Calculate gas utilization efficiency
  const gasUsed = ethers.BigNumber.from(blockData.gasUsed.toString());
  const gasLimit = ethers.BigNumber.from(blockData.gasLimit.toString());
  const gasEfficiency = gasUsed.mul(100).div(gasLimit);

  // Transaction details summary
  const transactionSummary = blockData.transactions.map(tx => {
    const gasUsed = tx.gasUsed ? ethers.BigNumber.from(tx.gasUsed.toString()) : ethers.BigNumber.from(0);
    const gasPrice = tx.gasPrice ? ethers.BigNumber.from(tx.gasPrice.toString()) : ethers.BigNumber.from(0);
    const transactionFee = gasUsed.mul(gasPrice);
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.utils.formatEther(tx.value),
      gasUsed: ethers.utils.formatUnits(gasUsed, 'gwei'),
      gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
      transactionFee: ethers.utils.formatEther(transactionFee),
    };
  });

  // Log details for insights
  console.log('Pre-EIP-1559 Block Analysis:', {
    totalTransactionFees: ethers.utils.formatEther(totalTransactionFees),
    minerReward: ethers.utils.formatEther(minerReward),
    gasEfficiency: `${gasEfficiency.toString()}%`,
    transactionSummary: transactionSummary,
  });

  return {
    totalTransactionFees: ethers.utils.formatEther(totalTransactionFees),
    minerReward: ethers.utils.formatEther(minerReward),
    gasEfficiency: `${gasEfficiency.toString()}%`,
    transactionSummary: transactionSummary,
  };
};

module.exports = {
  fetchBlockData,
  calculateGasMetrics,
  analyzePreEIP1559Block, // Export the new function
};
