import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./income.css";

const Income = () => {
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
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

    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://devionx-expensetracker.onrender.com/gettransactions", {
          headers: {
            "auth-token": token
          }
        });
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
          const totalBalance = data.transactions.reduce((acc, tx) => acc + tx.amount, 0);
          setBalance(totalBalance);
        } else {
          throw new Error("Failed to fetch transactions");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async () => {
    if (!creditAmount || !description || !selectedDate || !paymentType) {
      showPopup("All fields including Payment Type are required!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      payee: name.trim() || "NA",
      amount: parseFloat(creditAmount),
      description,
      date: selectedDate,
      paymentType,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://devionx-expensetracker.onrender.com/addtransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await response.json();
      if (data.success) {
        setTransactions([data.transaction, ...transactions]);
        setBalance(balance + newTransaction.amount);
        showPopup("Transaction added successfully!");

        setName("");
        setCreditAmount("");
        setDescription("");
        setSelectedDate("");
        setPaymentType("");
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage("");
    }, 3000);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredTransactions = transactions
    .filter((tx) =>
      [tx.description, tx.date, tx.id.toString(), tx.payee, tx.paymentType]
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => (sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));

  const groupedTransactions = filteredTransactions.reduce((acc, tx) => {
    const monthYear = new Date(tx.date).toLocaleString("default", { month: "long", year: "numeric" });
    acc[monthYear] = acc[monthYear] || [];
    acc[monthYear].push(tx);
    return acc;
  }, {});

  if (!isAuthenticated) {
    return (
      <div className="income-container">
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access the income tracker.</h2>
      </div>
    );
  }

  return (
    <div className="income-container">
      {popupMessage && <div className="popup-message">{popupMessage}</div>}

      <div className="top">
        <h1 className="heading">Income Tracker</h1>
      </div>

      <h3>Total Income: ₹<span className="green-text">{balance.toFixed(2)}</span></h3>

      <div className="add-income">
        <input type="text" placeholder="Name of Payee" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Credit Amount" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required>
          <option value="" disabled>Payment Type</option>
          <option value="Cash">Cash</option>
          <option value="Online Payment">Online Payment</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <button className="income" onClick={handleSubmit}>Add Income</button>

      <div className="filters">
        <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={handleSearch} />
        <button onClick={handleSort}>Sort by Date ({sortOrder.toUpperCase()})</button>
      </div>

      <div className="transactions">
        <div className="income-divcontainer">
          <div className="income-scrollarea">
        {Object.keys(groupedTransactions).map((monthYear) => (
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
                {groupedTransactions[monthYear].map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.payee}</td>
                    <td className="income-amount">
                      ₹{tx.amount.toFixed(2)} <FaArrowUp className="income-arrow" />
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

export default Income;
