import React, { useState, useEffect } from 'react';
import './navbar.css';
import navlogo from '../../assets/devon.png';
import Profile from '../../assets/profile.jpeg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem('token'));
      setUsername(localStorage.getItem('username'));
    };

    window.addEventListener('storage', updateAuth); // Listen for localStorage changes

    return () => {
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  return (
    <div className='navbar'>
      <img className="nav-logo" src={navlogo} alt="Logo" />

      <div className="header">Devionx Admin Panel</div>

      <div className="nav-login-cart">
        {token ? (
          <>
            <span className="nav-username">Hello, {username}</span>
            <button className="nav-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to='/login'><button className="nav-button">Login</button></Link>
        )}

        <Link to="/profile"><img className='nav-profile' src={Profile} alt="Profile" /></Link>
      </div>
    </div>
  );
};

export default Navbar;
