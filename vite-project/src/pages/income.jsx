import React, { useState, useEffect } from "react";
import "./income.css";
import { FaArrowUp } from "react-icons/fa";

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");  // Added Payee Name
  const [creditAmount, setCreditAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const storedBalance = JSON.parse(localStorage.getItem("balance")) || 0;
    setTransactions(storedTransactions);
    setBalance(storedBalance);
  }, []);

  const handleSubmit = () => {
    if (!creditAmount || !description || !selectedDate) return;

    const newTransaction = {
      id: Date.now(),
      payee: name.trim() || "NA",
      amount: parseFloat(creditAmount),
      description,
      date: selectedDate, 
    };

    const updatedTransactions = [newTransaction, ...transactions];
    const newBalance = balance + newTransaction.amount;

    setTransactions(updatedTransactions);
    setBalance(newBalance);

    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    localStorage.setItem("balance", JSON.stringify(newBalance));

    setName("");
    setCreditAmount("");
    setDescription("");
    setSelectedDate("");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      return (
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.date.includes(searchTerm) ||
        tx.id.toString().includes(searchTerm) ||
        tx.payee.toLowerCase().includes(searchTerm.toLowerCase()) // Search by Payee Name
      );
    })
    .sort((a, b) => (sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));

  // Group transactions by month
  const groupedTransactions = {};
  filteredTransactions.forEach((transaction) => {
    const monthYear = new Date(transaction.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!groupedTransactions[monthYear]) {
      groupedTransactions[monthYear] = [];
    }
    groupedTransactions[monthYear].push(transaction);
  });

  return (
    <div className="income-container">
      <div className="top">
      <h1 className="heading">Income Tracker</h1>
      </div>
      <h3>Total Balance: ₹<span className="green-text">{balance.toFixed(2)}</span></h3>
      
      <div className="add-income">
        <input
          type="text"
          placeholder="Name of Payee"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Credit Amount"
          value={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <button className="income" onClick={handleSubmit}>Add Income</button>

      <div className="filters">
        <input type="text" placeholder="Search by ID, Date, Payee, or Description..." value={searchTerm} onChange={handleSearch} />
        <button onClick={handleSort}>Sort by Date ({sortOrder.toUpperCase()})</button>
      </div>

      <div className="transactions">
        {Object.keys(groupedTransactions).map((monthYear) => (
          <div key={monthYear} className="transaction-month">
            <h2>{monthYear}</h2>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Payee</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {groupedTransactions[monthYear].map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.payee}</td>  {/* Display Payee Name */}
                    <td className="income-amount">
                      ₹{tx.amount.toFixed(2)} <FaArrowUp className="income-arrow" />
                    </td>
                    <td>{tx.description}</td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;
