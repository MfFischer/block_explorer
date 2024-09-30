// src/components/BlockForm.js
import React, { useState } from 'react';
import { getBlockData } from '../services/api'; // Import API function

const BlockForm = ({ setBlockData }) => {
  const [blockNumber, setBlockNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!blockNumber) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBlockData(blockNumber); // Use API function
      setBlockData(data);
    } catch (err) {
      setError('Error fetching block data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block-form">
      <h2>Enter Block Number</h2>
      <input
        type="text"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        placeholder="Block Number"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Analyze Block'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default BlockForm;
