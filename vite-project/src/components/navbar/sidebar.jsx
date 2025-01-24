import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import list_product_icon from '../../assets/list_product.jpg';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to="/listproduct" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="List Product" />
          <p>Get In Touch</p>
        </div>
      </Link>
      <Link to="/getquote" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="List Product" />
          <p>Get Quote</p>
        </div>
      </Link>
    </div>
  );
}

export default Sidebar;
