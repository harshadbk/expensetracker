import React, { useEffect, useState } from "react";
import remove_icon from "../../assets/remove.jpg";
import "./getquote.css";

const GetQuote = () => {
  const [allQuote, setAllQuote] = useState([]);
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
      showPopupMessage("❌ Please log in to access the Quotes system.");
      return;
    }
    try {
      const response = await fetch("https://devionx-expensetracker.onrender.com/allquote");
      const data = await response.json();
      setAllQuote(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      showPopupMessage("⚠️ Error fetching quotes. Try again.");
    }
  };

  const removeTouch = async (id) => {
    try {
      await fetch("https://devionx-expensetracker.onrender.com/removequote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      showPopupMessage("✅ Quote removed successfully.");
      await fetchInfo();
    } catch (error) {
      console.error("Error removing quote:", error);
      showPopupMessage("⚠️ Failed to remove quote.");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="quote-container">
        {showPopup && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access the quote system.</h2>
      </div>
    );
  }

  return (
    <div className="quote-container">
      <h1>All Quotes</h1>
      <div className="table-wrapper">
        <table className="quote-table">
          {showPopup && <div className="popup-message">{popupMessage}</div>}
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Services</th>
              <th>Budget</th>
              <th>Timeline</th>
              <th>Created At</th>
              <th>Description</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {allQuote.map((quote, index) => (
              <tr key={index}>
                <td>{quote.name}</td>
                <td>{quote.company}</td>
                <td>{quote.email || "None"}</td>
                <td>{quote.phone}</td>
                <td>{quote.services}</td>
                <td>{quote.budget}</td>
                <td>{quote.timeline}</td>
                <td>
                  {new Date(quote.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{quote.description}</td>
                <td>
                  <img
                    onClick={() => removeTouch(quote.id)}
                    className="remove-icon"
                    src={remove_icon}
                    alt="Remove"
                    title="Remove Quote"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetQuote;
