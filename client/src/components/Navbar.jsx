import React from 'react'
import './Navbar.css'
import search_icon_light from '../assets/search-w.png'
import search_icon_dark from '../assets/search-b.png'
import toggle_light from '../assets/night.png'
import toggle_dark from '../assets/day.png'
import { Link } from 'react-router-dom';

const Navbar = ({ theme, setTheme }) => {

  const toggle_mode = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  }

  return (
    <div className={`navbar ${theme}`}>
  <div className="nav-left">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/services">Services</Link></li>
    </ul>
  </div>

  <div className="nav-center">
    <div className="search-box">
      <input type="text" placeholder="Search" />
      <img src={theme === 'light' ? search_icon_light : search_icon_dark} alt="search" />
    </div>
  </div>

  <div className="nav-right">
    <img 
      onClick={toggle_mode} 
      src={theme === 'light' ? toggle_light : toggle_dark} 
      alt="toggle" 
      className="toggle-icon" 
    />
  </div>
</div>

  )
}

export default Navbar;
