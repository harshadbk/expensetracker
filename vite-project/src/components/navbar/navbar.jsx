import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Corrected import
import "./navbar.css";
import navlogo from "../../assets/devon.png";
import Profile from "../../assets/profile.jpeg";

const Navbar = () => {
  const navigate = useNavigate(); // ✅ Use navigate hook for redirection

  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/login"); // ✅ Redirects to login page after logout
  };

  return (
    <div className="navbar">
      <img className="nav-logo" src={navlogo} alt="Logo" />

      <div className="header">Devionx Admin Panel</div>

      <div className="nav-login-cart">
        {isAuthenticated && isAuthenticated ? (
          <>
            {username && <span className="nav-username">Hello, {username}</span>}
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="nav-button">Login</button>
          </Link>
        )}

        <Link to="/profile">
          <img className="nav-profile" src={Profile} alt="Profile" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
