// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 

export const getBlockData = async (blockNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/block/${blockNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching block data:', error);
    throw error;
  }
};
