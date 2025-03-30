import React, { useState, useEffect } from "react";
import "./expenses.css";
import { FaArrowDown } from "react-icons/fa";

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/getdebit");
      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
        const totalSpent = data.transactions.reduce((sum, tx) => sum + tx.amount, 0);
        setBalance(-totalSpent); // Since expenses are debits
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSubmit = async () => {
    if (!debitAmount || !description || !selectedDate) {
      setPopupMessage("All fields are required!");
      setTimeout(() => setPopupMessage(""), 2000);
      return;
    }

    try {
      const newTransaction = {
        id:Date.now(),
        payee: name.trim() || "NA",
        amount: parseFloat(debitAmount),
        description,
        date: selectedDate,
      };

      const response = await fetch("https://devionx-expensetracker.onrender.com/addexpenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();

      if (data.success) {
        setTransactions([data.transaction, ...transactions]);
        setBalance(balance - newTransaction.amount);

        setPopupMessage("Expense added successfully!");
        setTimeout(() => setPopupMessage(""), 2000);

        setName("");
        setDebitAmount("");
        setDescription("");
        setSelectedDate("");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      setPopupMessage("Failed to add expense!");
      setTimeout(() => setPopupMessage(""), 2000);
    }
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
        tx.payee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) =>
      sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

  const groupedTransactions = {};
  filteredTransactions.forEach((transaction) => {
    const monthYear = new Date(transaction.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!groupedTransactions[monthYear]) {
      groupedTransactions[monthYear] = [];
    }
    groupedTransactions[monthYear].push(transaction);
  });

  return (
    <div className="expenses-container">
      <div className="top">
        <h1 className="heading">Expense Tracker</h1>
      </div>

      {popupMessage && <div className="popup">{popupMessage}</div>}

      <h3>Total Expenses: ₹<span className="red-text">{Math.abs(balance).toFixed(2)}</span></h3>

      <div className="add-expense">
        <input
          type="text"
          placeholder="Name of Payee"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Debit Amount"
          value={debitAmount}
          onChange={(e) => setDebitAmount(e.target.value)}
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

      <button className="expense" onClick={handleSubmit}>Add Expense</button>

      <div className="filters">
        <input type="text" placeholder="Search by Payee, Date, or Description..." value={searchTerm} onChange={handleSearch} />
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
                  <tr key={tx._id}>
                    <td>{tx.payee}</td>
                    <td className="expense-amount">
                      ₹{tx.amount.toFixed(2)} <FaArrowDown className="expense-arrow" />
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

export default Expenses;
