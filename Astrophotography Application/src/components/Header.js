// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import logo from '../assets/nasa-logo.svg';

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header className='HeaderNasa'>
      <nav className='HeaderNasaNav'>
        <ul className='HeaderNasaLogo'>
          <img src={logo} className="App-logo" alt="logo" />
        </ul>
        <ul className='HeaderNasaUl'>
          <div className='HeaderNasaUlDiv'>
          {isAuthenticated ? (
            <li className='HeaderNasaLiLogout'><button onClick={onLogout}>Logout</button></li>
          ) : (
            <>
              <li className='HeaderNasaLiLogin'><Link to="/login">Login</Link></li>
              <li className='HeaderNasaLiSignup'><Link to="/signup">Signup</Link></li>
            </>
          )}
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
