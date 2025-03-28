import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/navbar/sidebar';
import ListProduct from './components/listproduct/Listproduct';
import GetQuote from './components/getquote/getquote';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile'
import Dashboards from './pages/dashboards';
import Income from './pages/income';
import Expenses from './pages/expenses';
import Invoices from './pages/invoices';
import Visuals from './pages/visuals';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path='/getquote' element={<GetQuote/>}></Route>
            <Route path="/listproduct" element={<ListProduct />} />
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path="/" element={<h1>Welcome to Devionx Admin Dashboard</h1>} />
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/dashboards' element={<Dashboards/>}></Route>
            <Route path='/income' element={<Income/>}></Route>
            <Route path='/expenses' element={<Expenses/>}></Route>
            <Route path='/invoices' element={<Invoices/>}></Route>
            <Route path='/visuals' element={<Visuals/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
