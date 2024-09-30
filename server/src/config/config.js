// src/config/config.js
require('dotenv').config();
const { ethers } = require('ethers');

const network = process.env.ETHEREUM_NETWORK;
const provider = new ethers.providers.InfuraProvider(network, {
  projectId: process.env.INFURA_PROJECT_ID,
  projectSecret: process.env.INFURA_PROJECT_SECRET,
});

module.exports = {
  provider,
  port: process.env.PORT || 4000,
};
