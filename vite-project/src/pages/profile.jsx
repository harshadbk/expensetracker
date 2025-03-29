import React, { useState, useEffect } from "react";
import profileImage from "../assets/profile.jpeg";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://devionx-expensetracker.onrender.com/peruser", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          throw new Error("Log in to access your profile");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Log in to access your profile");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (error) return <p className="error-message">{error}</p>;

  if (!data) return <p className="loading-message">Loading...</p>;

  return (
    <div className="profile-container">
      {/* Profile Heading */}
      <div className="profile-heading">
        <h1>Welcome, {username || "User"}!</h1>
        <p>You're logged into the <strong>Devionx Admin Panel</strong>.</p>
      </div>

      {/* Profile Card */}
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
