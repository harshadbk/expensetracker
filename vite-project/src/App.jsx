import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/navbar/sidebar';
import ListProduct from './components/listproduct/Listproduct';
import GetQuote from './components/getquote/getquote';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import Dashboards from './pages/dashboards';
import Income from './pages/income';
import Expenses from './pages/expenses';
import Invoices from './pages/invoices';
import Visuals from './pages/visuals';
import InvoiceDetail from './pages/invoicedetails';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/getquote" element={<GetQuote />} />
            <Route path="/listproduct" element={<ListProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/visuals" element={<Visuals />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/profile" />
  ) : (
    <Navigate to="/login" />
  );
};