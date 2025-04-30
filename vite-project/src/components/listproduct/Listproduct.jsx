import React, { useEffect, useState } from "react";
import remove_icon from "../../assets/remove.jpg";
import "./listproduct.css";

const ListProduct = () => {
  
  const [allTouch, setAllTouch] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
  
    const token = localStorage.getItem("token");
  
    const showPopupMessage = (message) => {
      setPopupMessage(message);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage("");
      }, 3000);
    };
  

  const fetchInfo = async () => {
    if (!token) {
      setIsAuthenticated(false);
      showPopupMessage("❌ Please log in to access the Touches of system.");
      return;
    }
    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/gettouch");
      const data = await response.json();
      setAllTouch(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeTouch = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await fetch("https://devionx-expensetracker.onrender.com/removetouch", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      fetchInfo();
    } catch (error) {
      console.error("Error removing entry:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="quote-container">
        {showPopup && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access the quote system.</h2>
      </div>
    );
  }

  return (
    <div className="listproduct">
      <h1>All Get In Touch</h1>

      {showPopup && <div className="popup-message">{popupMessage}</div>}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <table className="listproduct-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {allTouch.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.email || "None"}</td>
                <td>{product.phone}</td>
                <td>{product.subject}</td>
                <td className="message-column">{product.message}</td>
                <td>
                  <img
                    onClick={() => removeTouch(product.id)}
                    className="listproduct-remove-icon"
                    src={remove_icon}
                    alt="Remove"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListProduct;
