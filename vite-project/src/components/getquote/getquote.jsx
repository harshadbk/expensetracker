import React, { useEffect, useState } from "react";
import remove_icon from "../../assets/remove.jpg";
import "./getquote.css";

const GetQuote = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [allQuote, setAllQuote] = useState([]);

  const fetchInfo = async () => {
    await fetch(`${API_URL}/allquote`)
      .then((resp) => resp.json())
      .then((data) => {
        setAllQuote(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeTouch = async (id) => {
    await fetch(`${API_URL}/removequote`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };

  return (
    <div className="quote-container">
      <h1>All Quotes</h1>
      <div className="table-wrapper">
        <table className="quote-table">
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
                <td>{quote.email ? quote.email : "None"}</td>
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
