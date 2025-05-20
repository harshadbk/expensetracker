import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./invoices.css";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [payee, setPayee] = useState("");
  const [raddrress, setraddrress] = useState("");
  const [rphone, setrphone] = useState("");
  const [remail, setremail] = useState("");
  const [description, setDescription] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [Duedate, setDuedate] = useState("");

  const [filterDuedate, setFilterDuedate] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filterPayee, setFilterPayee] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [filterPaymentType, setFilterPaymentType] = useState("");

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [editingInvoice, setEditingInvoice] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      showPopupMessage("❌ Please log in to access the invoice system.");
      return;
    }
    fetchInvoices();
  }, []);

  const showPopupMessage = (message, duration = 3000) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), duration);
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "https://devionx-expensetracker.onrender.com/getinvoices"
      );
      const data = await response.json();
      if (data.success) {
        setInvoices(data.invoices);
        setFilteredInvoices(data.invoices);
      } else {
        throw new Error("Failed to fetch invoices");
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      showPopupMessage("❌ Failed to fetch invoices");
    }
  };

  const handleAddInvoice = async () => {
    if (
      !payee ||
      !raddrress ||
      !rphone ||
      !description ||
      !Duedate ||
      !paymentType ||
      !remail
    ) {
      showPopupMessage("❌ Please fill in all fields!");
      return;
    }

    const newInvoice = {
      payee,
      raddrress,
      rphone,
      remail,
      description,
      Duedate,
      paymentType,
    };

    try {
      const response = await fetch(
        "https://devionx-expensetracker.onrender.com/addinvoice",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newInvoice),
        }
      );

      const data = await response.json();
      if (data.success) {
        const updatedInvoices = [data.invoice, ...invoices];
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);

        setPayee("");
        setraddrress("");
        setrphone("");
        setremail("");
        setDescription("");
        setDuedate("");
        setPaymentType("");

        showPopupMessage("Invoice added successfully!", 4000);
      } else {
        throw new Error("Failed to add invoice");
      }
    } catch (err) {
      console.error("Error adding invoice:", err);
      showPopupMessage("❌ Error adding invoice!");
    }
  };

  const handleEditClick = (invoice) => {
    setEditingInvoice({ ...invoice });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditedInvoice = async () => {
    try {
      const originalInvoice = invoices.find(
        (inv) => inv.id === editingInvoice.id
      );

      if (!originalInvoice) {
        showPopupMessage("❌ Original invoice not found!");
        return;
      }

      if (
        parseFloat(editingInvoice.amountPaid) <
        parseFloat(originalInvoice.amountPaid)
      ) {
        showPopupMessage(
          "⚠️ Amount paid must be greater than the previous amount!"
        );
        return;
      }

      if (
        parseFloat(editingInvoice.amountPaid) >
        parseFloat(editingInvoice.totalAmount)
      ) {
        showPopupMessage("⚠️ Amount paid cannot exceed the total amount!");
        return;
      }

      const response = await fetch(
        `https://devionx-expensetracker.onrender.com/updateinvoice/${editingInvoice.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingInvoice),
        }
      );

      const data = await response.json();
      if (data.success) {
        const updatedList = invoices.map((inv) =>
          inv.id === editingInvoice.id ? data.updatedInvoice : inv
        );
        setInvoices(updatedList);
        setFilteredInvoices(updatedList);
        setEditingInvoice(null);
        showPopupMessage("Invoice updated successfully!");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Error updating invoice:", err);
      showPopupMessage("Error updating invoice!");
    }
  };

  const handleFilter = () => {
    const filtered = invoices.filter((invoice) => {
      const formattedDueDate = (() => {
        if (!invoice.Duedate) return "";
        const [year, month, day] = invoice.Duedate.split("-");
        return `${day}-${month}-${year}`;
      })();

      const formattedFilterDate = (() => {
        if (!filterDuedate) return "";
        const [year, month, day] = filterDuedate.split("-");
        return `${day}-${month}-${year}`;
      })();

      return (
        (formattedFilterDate === "" ||
          formattedDueDate === formattedFilterDate) &&
        (filterId === "" || invoice.id.toString().includes(filterId)) &&
        (filterPayee === "" ||
          invoice.payee?.toLowerCase().includes(filterPayee.toLowerCase())) &&
        (filterDescription === "" ||
          invoice.description
            ?.toLowerCase()
            .includes(filterDescription.toLowerCase())) &&
        (filterPaymentType === "" ||
          invoice.paymentType?.includes(filterPaymentType))
      );
    });

    setFilteredInvoices(filtered);
  };

  const clearFilters = () => {
    setFilterDuedate("");
    setFilterId("");
    setFilterPayee("");
    setFilterDescription("");
    setFilterPaymentType("");
    fetchInvoices();
  };

  const groupInvoicesByMonth = (invoices) => {
    return invoices.reduce((acc, invoice) => {
      const parsedDate = new Date(invoice.Duedate);

      if (isNaN(parsedDate)) {
        console.warn(`Invalid date for invoice: ${invoice.Duedate}`);
        return acc;
      }

      const monthYear = parsedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(invoice);

      return acc;
    }, {});
  };

  if (!isAuthenticated) {
    return (
      <div className="income-container">
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access the invoice tracker.</h2>
      </div>
    );
  }

  const groupedInvoices = groupInvoicesByMonth(filteredInvoices);

  const remove = async (_id, customId) => {
    try {
      const res = await fetch(
        `https://devionx-expensetracker.onrender.com/deleteinvoice/${_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(`Invoice deleted successfully: ${customId}`);
        fetchInvoices();
      } else {
        alert("Failed to delete invoice");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div className="invoices-container">
      <h1 className="animated-heading">Invoices</h1>
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      {editingInvoice && (
        <div className="custom-modal-overlay">
          <div className="custom-modal animated-fade">
            <h2>Edit Invoice Id = {editingInvoice.id}</h2>
            <input
              name="payee"
              placeholder="Payee"
              value={editingInvoice.payee}
              onChange={handleEditChange}
            />
            <input
              name="totalAmount"
              type="number"
              placeholder="Total Amount"
              value={editingInvoice.totalAmount}
              onChange={handleEditChange}
              disabled={true}
            />
            <input
              name="amountPaid"
              type="number"
              placeholder="Amount Paid"
              value={editingInvoice.amountPaid}
              onChange={handleEditChange}
            />
            <input
              name="description"
              placeholder="Description"
              value={editingInvoice.description}
              onChange={handleEditChange}
            />
            <input
              name="date"
              type="date"
              value={editingInvoice.date.slice(0, 10)}
              onChange={handleEditChange}
            />
            <select
              name="paymentType"
              value={editingInvoice.paymentType}
              onChange={handleEditChange}
            >
              <option value="Cash">Cash</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
            <div className="modal-buttons">
              <button className="save-btn" onClick={saveEditedInvoice}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditingInvoice(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="upperpart">
        <div className="add-invoice">
          <div className="input-row">
            <input
              type="text"
              placeholder="RECIPIENT Name"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />
            <input
              type="text"
              placeholder="RECIPIENT Address"
              value={raddrress}
              onChange={(e) => {
                setraddrress(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="RECIPIENT Phone No"
              value={rphone}
              onChange={(e) => {
                setrphone(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="RECIPIENT Email"
              value={remail}
              onChange={(e) => {
                setremail(e.target.value);
              }}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Description About Invoice"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              type="date"
              placeholder="Due Date"
              value={Duedate}
              onChange={(e) => setDuedate(e.target.value)}
            />
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="">Select Payment Type</option>
              <option value="Cash">Cash</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <button className="add-invoice-btn" onClick={handleAddInvoice}>
            ➕ Add Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="filter">
          <input
            type="date"
            value={filterDuedate}
            onChange={(e) => setFilterDuedate(e.target.value)}
          />
          <input
            type="text"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            placeholder="Filter by ID"
          />
          <input
            type="text"
            value={filterPayee}
            onChange={(e) => setFilterPayee(e.target.value)}
            placeholder="Filter by Payee"
          />
          <input
            type="text"
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            placeholder="Filter by Description"
          />
          <select
            value={filterPaymentType}
            onChange={(e) => setFilterPaymentType(e.target.value)}
          >
            <option value="">All Payment Types</option>
            <option value="Cash">Cash</option>
            <option value="Online Payment">Online Payment</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select>
          <button className="afilter-btn" onClick={handleFilter}>
            Apply Filters
          </button>
          <button className="afilter-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Invoice Tables */}
      <div className="invoice-container">
        <div className="invoice-scroll-area">
          {Object.keys(groupedInvoices).map((monthYear) => (
            <div key={monthYear} className="invoice-group">
              <h3>{monthYear}</h3>
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Payee</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Duedate</th>
                    <th>payment type</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedInvoices[monthYear].map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="invoice-row"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{invoice.id}</td>
                      <td>{invoice.payee}</td>
                      <td>{invoice.raddrress}</td>
                      <td>{invoice.rphone}</td>
                      <td>{invoice.remail}</td>
                      <td>{invoice.Date}</td>
                      <td>{invoice.description}</td>
                      <td>{invoice.Duedate}</td>
                      <td>{invoice.paymentType}</td>
                      {/* <td>
                        <button
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(invoice);
                          }}
                        >
                          Edit
                        </button>
                      </td> */}
                      {/* <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(invoice._id, invoice.id);
                          }}
                        >
                          Remove
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
