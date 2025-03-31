import React, { useState, useEffect } from "react";
import "./invoices.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [payee, setPayee] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Filters state
  const [filterDate, setFilterDate] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filterPayee, setFilterPayee] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterPaymentType, setFilterPaymentType] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/getinvoices");
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices);
        setFilteredInvoices(data.invoices);
      } else {
        throw new Error("Failed to fetch invoices");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleAddInvoice = async () => {
    if (!payee || !totalAmount || !amountPaid || !description || !selectedDate || !paymentType) {
      setPopupMessage("Please fill in all fields!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    if (parseFloat(amountPaid) > parseFloat(totalAmount)) {
      setPopupMessage("❌ Amount paid cannot be greater than total amount!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
      return;
    }

    const newInvoice = {
      payee,
      totalAmount: parseFloat(totalAmount),
      amountPaid: parseFloat(amountPaid),
      description,
      date: selectedDate,
      paymentType,
    };

    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/addinvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });

      const data = await response.json();
      if (data.success) {
        const updatedInvoices = [data.invoice, ...invoices];
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        
        setPayee("");
        setTotalAmount("");
        setAmountPaid("");
        setDescription("");
        setSelectedDate("");
        setPaymentType("");

        setPopupMessage("✅ Invoice added successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        throw new Error("Failed to add invoice");
      }
    } catch (err) {
      console.error("Error adding invoice:", err);
      setPopupMessage("❌ Error adding invoice!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  // ✅ Function to filter invoices
  const handleFilter = () => {
    let filteredData = invoices.filter((invoice) => {
      return (
        (filterDate === "" || invoice.date.includes(filterDate)) &&
        (filterId === "" || invoice.id.toString().includes(filterId)) &&
        (filterPayee === "" || invoice.payee.toLowerCase().includes(filterPayee.toLowerCase())) &&
        (filterDescription === "" || invoice.description.toLowerCase().includes(filterDescription.toLowerCase())) &&
        (filterPaymentType === "" || invoice.paymentType.includes(filterPaymentType))
      );
    });

    setFilteredInvoices(filteredData);
  };

  const ClearFilter = () => {
    setPayee("");
    setTotalAmount("");
    setAmountPaid("");
    setDescription("");
    setPaymentType("");
    setSelectedDate("");
    setFilterPayee("");
    setFilterDate("");
    setFilterDescription("");
    setFilterPaymentType("");
    setFilterId("");
    fetchInvoices();
  };  

  return (
    <div className="invoices-container">
      <h1 className="animated-heading">Invoices</h1>

      {showPopup && <div className="popup-message">{popupMessage}</div>}
      
      <div className="upperpart">
        <div className="add-invoice">
          <div className="input-row">
            <input type="text" placeholder="Payee Name" value={payee} onChange={(e) => setPayee(e.target.value)} />
            <input type="number" placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          </div>
          <div className="input-row">
            <input type="number" placeholder="Amount Paid" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="input-row">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <button className="add-invoice-btn" onClick={handleAddInvoice}>Add Invoice</button>
        </div>

        <div className="filter">
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} placeholder="Filter by Date" />
          <input type="text" value={filterId} onChange={(e) => setFilterId(e.target.value)} placeholder="Filter by ID" />
          <input type="text" value={filterPayee} onChange={(e) => setFilterPayee(e.target.value)} placeholder="Filter by Payee" />
          <input type="text" value={filterDescription} onChange={(e) => setFilterDescription(e.target.value)} placeholder="Filter by Description" />
          <select value={filterPaymentType} onChange={(e) => setFilterPaymentType(e.target.value)}>
            <option value="">All Payment Types</option>
            <option value="Cash">Cash</option>
            <option value="Online Payment">Online Payment</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select>
          <button className="afilter-btn" onClick={handleFilter}>Apply Filters</button>
          <button className="afilter-btn" onClick={ClearFilter}>Remove Filters</button>
        </div>
      </div>

      {/* ✅ Filtered Invoice Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Payee</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Remaining</th>
            <th>Description</th>
            <th>Payment Type</th>
            <th>Date</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice, index) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.payee}</td>
              <td>₹{invoice.totalAmount.toFixed(2)}</td>
              <td className="amount-paid">₹{invoice.amountPaid.toFixed(2)}</td>
              <td className="remaining-amount">₹{(invoice.totalAmount - invoice.amountPaid).toFixed(2)}</td>
              <td>{invoice.description}</td>
              <td>{invoice.paymentType}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td><button className="edit-btn">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
