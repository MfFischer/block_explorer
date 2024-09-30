// src/context/GlobalState.js
import React, { createContext, useState } from 'react';

export const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  const [blockData, setBlockData] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ blockData, setBlockData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;

