import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo.png'
import navProfile from '../../assets/onlyaadarsh.png'

export const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='subbox'> 
      <img src={navlogo} alt=""  className='nav-logo'/> <h1>TRENDY CART</h1> 
      </div>
      <img src={navProfile} alt=""  className='nav-profile'/>
    </div>
  )
}

export default Navbar
