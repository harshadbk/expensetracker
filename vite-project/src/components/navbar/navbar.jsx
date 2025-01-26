import React from 'react'
import './navbar.css'
import navlogo from '../../assets/devon.png'
import footer_logo from '../../assets/footer_logo.jpg'
import drop_down from '../../assets/dd.jpg'

const navbar = () => {
  return (
    <div className='navbar'>
      <img className="nav-logo" src={navlogo} alt="" />
      <div className="header">
       Devionx Admin Panel
      </div>
      <img className='nav-profile' src={footer_logo} alt="" />
      <img className='drop-down' src={drop_down} alt="" />
    </div>
  )
}

export default navbar
