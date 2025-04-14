import React, { useEffect, useState } from "react";
import './dashboard.css';

const Dashboards = () => {
  const [balanceData, setBalanceData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const fetchBalance = async () => {
    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/total-balance");
      const data = await response.json();
      if (data.success) {
        setBalanceData({
          totalIncome: data.totalIncome,
          totalExpenses: data.totalExpenses,
          balance: data.balance,
        });
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <>
    <div className="maincont">
      <div className="row-1">
          <div className="bargraph">
          </div>
      </div>
      
    </div>
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="card-container">
        <div className="card">
          <h3>Total Income</h3>
          <p className="incomes">₹{balanceData.totalIncome}</p>
        </div>
        <div className="card">
          <h3>Income By Invoices</h3>
          <p className="invoices">₹{balanceData.totalIncome}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="expenses">₹{balanceData.totalExpenses}</p>
        </div>
        <div className="card">
          <h3>Balance</h3>
          <p className="balance">₹{balanceData.balance}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboards;
