import React, { useState, useEffect } from "react";
import profileImage from "../assets/profile.jpeg";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Show popup notification
  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 3000);
  };

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      showPopupMessage("❌ Please log in to access your profile.");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("https://devionx-expensetracker.onrender.com/peruser", {
          headers: {
            token: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile. Log in again.");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("⚠️ Unable to load profile.");
        showPopupMessage("⚠️ Error loading profile. Try again.");
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    showPopupMessage("👋 Logged out successfully.");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        {showPopup && <div className="popup-message">{popupMessage}</div>}
        <h2 className="error">Please log in to access your profile.</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        {showPopup && <div className="popup-message">{popupMessage}</div>}
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="profile-container">
        <p className="loading-message">⏳ Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {showPopup && <div className="popup-message">{popupMessage}</div>}

      <div className="profile-heading">
        <h1>Welcome, {username || "User"}!</h1>
        <p>You're logged into the <strong>Devionx Admin Panel</strong>.</p>
      </div>

      <div className="profile-card">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <h2 className="profile-name">{data.name}</h2>
        <p className="profile-email">{data.email}</p>

        <table className="profile-table">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{data.name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>{data.email}</td>
            </tr>
          </tbody>
        </table>

        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Profile;
