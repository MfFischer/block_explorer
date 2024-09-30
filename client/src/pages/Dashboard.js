// src/pages/Dashboard.js
import React, { useState } from 'react';
import BlockForm from '../components/BlockForm';
import BlockDetails from '../components/BlockDetails';
import GasAnalytics from '../components/GasAnalytics';
import './Dashboard.scss';

const Dashboard = () => {
  const [blockData, setBlockData] = useState(null);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <BlockForm setBlockData={setBlockData} />
      {blockData && <BlockDetails blockData={blockData} />}
      {blockData && blockData.gasMetrics && <GasAnalytics blockData={blockData} />}
    </div>
  );
};

export default Dashboard;
