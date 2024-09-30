// src/components/TransactionList.js (If you have one)
import React from 'react';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div>No transactions available</div>;
  }

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <strong>Hash:</strong> {tx.hash}<br />
            <strong>From:</strong> {tx.from}<br />
            <strong>To:</strong> {tx.to}<br />
            <strong>Gas Used:</strong> {tx.gasUsed && tx.gasUsed.toString()}<br />
            <strong>Gas Price:</strong> {tx.gasPrice && tx.gasPrice.toString()}<br />
            <strong>Value:</strong> {tx.value && tx.value.toString()} Ether
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
