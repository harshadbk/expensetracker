import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import list_product_icon from '../../assets/git.jpg';
import QT from '../../assets/qt.jpg';
import EXP from '../../assets/exp.jpg';
import DS from '../../assets/ds.jpg';
import IC from '../../assets/ic.jpg';
import IVC from '../../assets/ivc.jpg';
import VS from '../../assets/visual.jpg';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to="/dashboards" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={DS} alt="List Product" />
          <p>Dashboards</p>
        </div>
      </Link>
      <Link to="/income" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={IC} alt="List Product" />
          <p>Income</p>
        </div>
      </Link>
      <Link to="/expenses" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={EXP} alt="List Product" />
          <p>Expenses</p>
        </div>
      </Link>
      <Link to="/invoices" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={IVC} alt="List Product" />
          <p>Invoices</p>
        </div>
      </Link>
      <Link to="/listproduct" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="List Product" />
          <p>Get In Touch</p>
        </div>
      </Link>
      <Link to="/getquote" style={{ textDecoration: 'none' }}>
        <div className="sidebar-item">
          <img src={QT} alt="List Product" />
          <p>Get Quote</p>
        </div>
      </Link>
    </div>
  );
}

export default Sidebar;
