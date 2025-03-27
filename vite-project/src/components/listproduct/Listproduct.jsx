import React, { useEffect, useState } from "react";
import remove_icon from "../../assets/remove.jpg";
import "./listproduct.css";

const ListProduct = () => {
  
  const [allTouch, setAllTouch] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const response = await fetch("https://devionxwebsitebackend.onrender.com/gettouch");
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
      await fetch("http://127.0.0.1:5000/removetouch", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      fetchInfo(); // Refresh data after deletion
    } catch (error) {
      console.error("Error removing entry:", error);
    }
  };

  return (
    <div className="listproduct">
      <h1>All Get In Touch</h1>

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
