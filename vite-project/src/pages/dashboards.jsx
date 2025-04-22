import React, { useEffect, useState } from "react";
import './dashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart
} from 'recharts';

const COLORS = ['#FF8C00', '#8B4513', '#2ECC71', '#3498DB', '#9B59B6', '#E74C3C'];

const COLORS2 = ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251'];


const Dashboards = () => {

  // for income summary 
  const [summaryPieData, setSummaryPieData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [monthlyIncomeData, setMonthlyIncomeData] = useState([]);
  const [balanceData, setBalanceData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [paymentTypeData, setPaymentTypeData] = useState([]);

  const fetchBalance = async () => {
    try {
      const res = await fetch("https://devionx-expensetracker.onrender.com/total-balance");
      const data = await res.json();
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

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://devionx-expensetracker.onrender.com/gettransactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);

        const years = new Set(
          data.transactions.map(txn => new Date(txn.date).getFullYear())
        );
        const sortedYears = Array.from(years).sort((a, b) => b - a);
        setAvailableYears(sortedYears);

        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);
        generateMonthlyIncome(data.transactions, currentYear);
        generatePaymentTypeData(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const generateMonthlyIncome = (transactions, year) => {
    const incomeMap = {};

    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      const txnYear = date.getFullYear();
      if (txn.type === "CREDIT" && txnYear === parseInt(year)) {
        const month = date.toLocaleString("default", { month: "short" });
        const label = `${month} ${txnYear}`;
        incomeMap[label] = (incomeMap[label] || 0) + txn.amount;
      }
    });

    const sortedData = Object.entries(incomeMap)
      .map(([monthYear, amount]) => {
        const [monthStr, yearStr] = monthYear.split(" ");
        const monthIndex = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
        const year = parseInt(yearStr);
        return { monthYear, amount, sortKey: year * 12 + monthIndex };
      })
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ monthYear, amount }) => ({
        month: monthYear,
        income: amount,
      }));

    setMonthlyIncomeData(sortedData);
  };

  const generatePaymentTypeData = (transactions) => {
    const typeMap = {};

    transactions.forEach((txn) => {
      const type = txn.paymentType || "Unknown";
      typeMap[type] = (typeMap[type] || 0) + txn.amount;
    });

    const result = Object.entries(typeMap).map(([type, amount]) => ({
      name: type,
      value: amount,
    }));

    setPaymentTypeData(result);
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);


  // for expense summary


  const [dtransactions, setdTransactions] = useState([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);


  const [dselectedYear, setdSelectedYear] = useState("");
  const [davailableYears, setdAvailableYears] = useState([]);
  const [dpaymentTypeData, setdPaymentTypeData] = useState([]);

  const fetchDebitTransactions = async () => {
    try {
      const res = await fetch("https://devionx-expensetracker.onrender.com/getdebit");
      const data = await res.json();
      if (data.success) {
        setdTransactions(data.transactions);

        const years = new Set(
          data.transactions.map(txn => new Date(txn.date).getFullYear())
        );
        const sortedYears = Array.from(years).sort((a, b) => b - a);
        setdAvailableYears(sortedYears);

        const currentYear = new Date().getFullYear();
        setdSelectedYear(currentYear);
        generateMonthlyExpense(data.transactions, currentYear);
        generatedPaymentTypeData(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const generateMonthlyExpense = (transactions, year) => {
    const map = {};
    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      if (txn.type === "DEBIT" && date.getFullYear() === parseInt(year)) {
        const label = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
        map[label] = (map[label] || 0) + txn.amount;
      }
    });

    const sorted = Object.entries(map).map(([monthYear, amount]) => {
      const [month, yearStr] = monthYear.split(" ");
      const sortKey = new Date(`${month} 1, ${yearStr}`).getTime();
      return { month: monthYear, expense: amount, sortKey };
    }).sort((a, b) => a.sortKey - b.sortKey);

    setMonthlyExpenseData(sorted);
  };

  const generatedPaymentTypeData = (transactions) => {
    const typeMap = {};

    transactions.forEach((txn) => {
      const type = txn.paymentType || "Unknown";
      typeMap[type] = (typeMap[type] || 0) + txn.amount;
    });

    const result = Object.entries(typeMap).map(([type, amount]) => ({
      name: type,
      value: amount,
    }));

    setdPaymentTypeData(result);
  };

  useEffect(() => {
    fetchBalance();
    fetchDebitTransactions();
  }, []);

  // for comparison

  useEffect(() => {
    const income = balanceData.totalIncome || 0;
    const expenses = balanceData.totalExpenses || 0;
    const balance = balanceData.balance || 0;
    const invoices = 5673;

    setSummaryPieData([
      { name: 'Income', value: income },
      { name: 'Expenses', value: expenses },
      { name: 'Balance', value: balance },
      { name: 'Invoices', value: invoices },
    ]);
  }, [balanceData, transactions]);


  return (
    <>
      <div className="maincont">

        {/* for income summary */}

        <h2 className="myheader">Income Summary</h2>
        <div className="row-1">
          <div className="bargraph">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="bargraph-heading">Income Per Month</h3>
              <div className="year-select-container">
                <label htmlFor="year-select" className="year-label">Select Year</label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    generateMonthlyIncome(transactions, e.target.value);
                  }}
                  className="year-dropdown"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyIncomeData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  height={60}
                  style={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis style={{ fontSize: 10 }} />
                <Tooltip />
                <Bar
                  dataKey="income"
                  animationDuration={1000}
                  barSize={25}
                  activeBar={{ fill: "#2ECC71" }}
                  fill="#8B4513"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="circle">
            <h3>Payment Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {paymentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* for expense summary */}

        <h2 className="myheader2">Expense Summary</h2>
        <div className="row-1">
          <div className="bargraph">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="bargraph-heading">Expense Per Month</h3>
              <div className="year-select-container">
                <label htmlFor="year-select" className="year-label">Select Year</label>
                <select
                  id="year-select"
                  value={dselectedYear}
                  onChange={(e) => {
                    setdSelectedYear(e.target.value);
                    generateMonthlyExpense(dtransactions, e.target.value);
                  }}
                  className="year-dropdown"
                >
                  {davailableYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyExpenseData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  height={60}
                  style={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis style={{ fontSize: 10 }} />
                <Tooltip />
                <Bar
                  dataKey="expense"
                  animationDuration={1000}
                  barSize={25}
                  activeBar={{ fill: "#E74C3C" }}
                  fill="#E74C3C"
                />

              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="circle">
            <h3>Payment Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dpaymentTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {paymentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison */}

        <h2 className="myheader2">Comparison Income vs Expense vs balance vs Invoices</h2>
        <div className="comparison">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={summaryPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {summaryPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
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
            <p className="invoices">₹5673</p>
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
