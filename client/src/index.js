// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStateProvider from './context/GlobalState';

console.log('Rendering index.js');

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider>
      <Router>
        <App />
      </Router>
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);