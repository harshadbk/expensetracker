import React, { useEffect, useState } from "react";

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
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Total Income</h3>
          <p style={styles.income}>₹{balanceData.totalIncome}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Expenses</h3>
          <p style={styles.expense}>₹{balanceData.totalExpenses}</p>
        </div>
        <div style={styles.card}>
          <h3>Balance</h3>
          <p style={styles.balance}>₹{balanceData.balance}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "200px",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  income: {
    color: "green",
    fontSize: "20px",
    fontWeight: "bold",
  },
  expense: {
    color: "red",
    fontSize: "20px",
    fontWeight: "bold",
  },
  balance: {
    color: "#333",
    fontSize: "22px",
    fontWeight: "bold",
  },
};

export default Dashboards;
