// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss'; // Import specific styles for Home page

const Home = () => {
  console.log('Home component rendered');
  return (
    <div className="home">
      <h1>Welcome to ArbGenie</h1>
      <p>Analyze Ethereum blocks and gas usage efficiently.</p>
      <Link to="/dashboard" className="btn">Go to Dashboard</Link>
    </div>
  );
};

export default Home;
