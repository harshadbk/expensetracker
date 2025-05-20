import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import "./invoicedetails.css";
import Company_logo from "../assets/devon.png";

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchInvoiceAndServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const invoiceRes = await fetch(
          "https://devionx-expensetracker.onrender.com/getinvoices"
        );
        if (!invoiceRes.ok) throw new Error("Failed to fetch invoices");

        const invoiceData = await invoiceRes.json();
        const allInvoices = Array.isArray(invoiceData)
          ? invoiceData
          : invoiceData.invoices;

        const matchingInvoice = allInvoices.find(
          (inv) => Number(inv.id) === Number(id)
        );
        if (!matchingInvoice) throw new Error(`Invoice ID ${id} not found`);

        setInvoice(matchingInvoice);

        const serviceRes = await fetch(
          `https://devionx-expensetracker.onrender.com/getservices?invoice_id=${id}`
        );

        const allServices = await serviceRes.json();
        const relatedServices = Array.isArray(allServices)
          ? allServices.filter((s) => Number(s.invoice_id) === Number(id))
          : [];

        const formatted = relatedServices.map((s) => ({
          id: s._id || s.id,
          description: s.description || "",
          service: s.service || "",
          rate: Number(s.hourly_rate) || 0,
          hours: Number(s.total_hour) || 0,
          isSaved: true,
        }));

        setItems(formatted);
      } catch (err) {
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceAndServices();
  }, [id]);

  const handleAddItemClick = () => {
    setItems([
      ...items,
      {
        id: null,
        description: "",
        service: "",
        rate: 0,
        hours: 0,
        isSaved: false,
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "rate" || field === "hours" ? Number(value) : value;
    setItems(updated);
  };

  const handleRemoveItem = async (index) => {
    const serviceId = items[index].id;

    if (serviceId) {
      try {
        const response = await fetch(
          `https://devionx-expensetracker.onrender.com/removeservice?service_id=${serviceId}&invoice_id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server error: ${response.status} - ${text}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to remove service");
        }

        alert("Service removed successfully!");
      } catch (error) {
        alert(`Error removing service: ${error.message}`);
        return;
      }
    }

    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSaveServices = async () => {
    try {
      const updatedItems = [...items];
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];

        // Skip if already saved or empty
        if (item.isSaved || (!item.description && !item.service)) continue;

        const response = await fetch(
          "https://devionx-expensetracker.onrender.com/addservice",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoice_id: Number(id),
              description: item.description,
              service: item.service,
              hourly_rate: item.rate,
              total_hour: item.hours,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to save service");

        // Mark the saved item
        updatedItems[i].isSaved = true;
      }

      setItems(updatedItems);
      alert("All new services saved successfully!");
    } catch (error) {
      console.error("Error saving services:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.rate * item.hours, 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;

  if (loading) return <div className="loading">Loading invoice details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!invoice) return <div className="error">No invoice found.</div>;

  return (
    <div className="myinvoice-container">
      <div className="invoice-heading">
        <h2>Invoice Preview</h2>
      </div>

      <div className="invoice-upperpart">
        <div className="left-section">
          <div className="company-logo">
            <img src={Company_logo} alt="Devonx Logo" />
          </div>
          <div className="recipient-info">
            <h2>To, RECIPIENT</h2>
            <p>
              <strong>Payee:</strong> {invoice.payee}
            </p>
            <p>
              <strong>Address:</strong> {invoice.raddrress}
            </p>
            <p>
              <strong>Date:</strong> {invoice.Date}
            </p>
            <p>
              <strong>Description:</strong> {invoice.description}
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.Duedate}
            </p>
            <p>
              <strong>Payment Type:</strong> {invoice.paymentType}
            </p>
            <p className="mail animate-contact">
              <FiMail className="icon" /> {invoice.remail}
            </p>
            <p className="phone animate-contact">
              <FiPhone className="icon" /> {invoice.rphone}
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="company-address">
            <h2>By, Devonx Technology</h2>
            <p>
              Lokmanya Tilak college,
              <br />
              Near Mechanical Department,
              <br />
              Incubation Lab, Navi Mumbai,
              <br />
              Koperkhairane, 400 709
            </p>
            <p className="mail animate-contact">
              <FiMail className="icon" /> info@devionx.com
              <br />
              <span className="indent">support@devionx.com</span>
            </p>
            <p className="phone animate-contact">
              <FiPhone className="icon" /> 9370613157
              <br />
              <span className="indent">7666675306</span>
            </p>
          </div>
          <div className="invoice-summary">
            <h2>INVOICE</h2>
            <p>
              <strong>Invoice NO:</strong> {invoice.id}
            </p>
            <p>
              <strong>Date:</strong> {invoice.Date}
            </p>
          </div>
        </div>
      </div>

      <div className="addbill">
        <h2>Services & Bill</h2>
        <table className="bill-data">
          <thead>
            <tr>
              <th>Description</th>
              <th>Service</th>
              <th>Hourly Rate</th>
              <th>Total Hours</th>
              <th>Amount</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <p>No services found for this invoice.</p>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      disabled={item.isSaved}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.service}
                      disabled={item.isSaved}
                      onChange={(e) =>
                        handleItemChange(index, "service", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      disabled={item.isSaved}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.hours}
                      disabled={item.isSaved}
                      onChange={(e) =>
                        handleItemChange(index, "hours", e.target.value)
                      }
                      min="0"
                    />
                  </td>
                  <td>₹{(item.rate * item.hours).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button className="add-btn" onClick={handleAddItemClick}>
          + Add Item
        </button>

        <div className="summary-table-container">
          <table className="summary-table">
            <tbody>
              <tr>
                <td>
                  <strong>Subtotal:</strong>
                </td>
                <td>₹{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Discount (10%):</strong>
                </td>
                <td>₹{discount.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td>
                  <strong>Total:</strong>
                </td>
                <td>₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bank-statement">
          <p className="payment-instruction">
            Kindly transfer the amount of <strong>₹{total}</strong> to the bank
            account mentioned below <br /> <strong>before the due date</strong>{" "}
            to avoid any inconvenience. And add Invoice NO into Payment
          </p>
          <div className="bank-details">
            <p>
              <strong>Bank Account No:</strong> HDFC178908
            </p>
            <p>
              <strong>UPI ID:</strong> devionx@ybi.com
            </p>
          </div>
        </div>

        <div className="invoice-actions">
          <button className="action-button share-button">Share by Email</button>
          <button className="action-button pdf-button">Make PDF</button>
          <button
            className="action-button save-button"
            onClick={handleSaveServices}
          >
            Save Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
