import React, { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./expenses.css";

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [balance, setBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [popupMessage, setPopupMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      showPopup("Please log in to access the system!");
      return;
    }

    const fetchExpenses = async () => {
      try {
        const response = await fetch("https://devionx-expensetracker.onrender.com/getdebit", {
          headers: {
            "auth-token": token,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
          const total = data.transactions.reduce((sum, tx) => sum + tx.amount, 0);
          setBalance(-total);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        showPopup("Failed to load expenses!");
      }
    };

    fetchExpenses();
  }, []);

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleSubmit = async () => {
    if (!debitAmount || !description || !selectedDate || !paymentType) {
      showPopup("All fields including Payment Type are required!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      payee: name.trim() || "NA",
      amount: parseFloat(debitAmount),
      description,
      date: selectedDate,
      paymentType,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://devionx-expensetracker.onrender.com/addexpenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();
      if (data.success) {
        setTransactions([data.transaction, ...transactions]);
        setBalance(balance - newTransaction.amount);
        showPopup("Expense added successfully!");
        setName("");
        setDebitAmount("");
        setDescription("");
        setSelectedDate("");
        setPaymentType("");
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      showPopup("Failed to add expense!");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredTransactions = transactions
    .filter((tx) =>
      [tx.description, tx.date, tx.id?.toString(), tx.payee, tx.paymentType]
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );

  const groupedTransactions = {};
  filteredTransactions.forEach((tx) => {
    const monthYear = new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" });
    if (!groupedTransactions[monthYear]) groupedTransactions[monthYear] = [];
    groupedTransactions[monthYear].push(tx);
  });

  if (!isAuthenticated) {
    return (
      <div className="expenses-container">
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access the income tracker.</h2>
      </div>
    );
  }

  return (
    <div className="expenses-container">
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
      <h1 className="heading">Expense Tracker</h1>
      <h3>
        Total Expenses: ₹<span className="red-text">{Math.abs(balance).toFixed(2)}</span>
      </h3>

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
        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
          <option value="">Payment Type</option>
          <option value="Cash">Cash</option>
          <option value="Online Payment">Online Payment</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <button className="expense" onClick={handleSubmit}>
        Add Expense
      </button>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by Payee, Date, or Description..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSort}>Sort by Date ({sortOrder.toUpperCase()})</button>
      </div>

      <div className="transactions">
        <div className="expense-data">
          <div className="expense-scoll">
        {Object.entries(groupedTransactions).map(([monthYear, txs]) => (
          <div key={monthYear} className="transaction-month">
            <h2>{monthYear}</h2>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Payee</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Payment Type</th>
                  <th>Date</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => (
                  <tr key={tx._id || tx.id}>
                    <td>{tx.payee}</td>
                    <td className="expense-amount">
                      ₹{tx.amount.toFixed(2)} <FaArrowDown className="expense-arrow" />
                    </td>
                    <td>{tx.description}</td>
                    <td>{tx.paymentType}</td>
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
      </div>
    </div>
  );
};

export default Expenses;
