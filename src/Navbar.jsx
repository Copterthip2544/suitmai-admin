import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './Navbar.css';
import logo from './image/Logo.png';
import { auth } from './firebase';

const Navbar = ({ handleSignOut }) => {
  const handleSignOutClick = async () => {
    try {
      await signOut(auth);
      handleSignOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className='path-control'>
        <Link to="/ingredients" style={{ color: 'white' }} >
          จัดการวัตถุดิบ
        </Link>
      </div>
      <div className='path-control'>
        <Link to="/equipment" style={{ color: 'white' }}>
          จัดการอุปกรณ์
        </Link>
      </div>
      <div className="navbar-signout">
        <button onClick={handleSignOutClick}>ออกจากระบบ</button>
      </div>
    </nav>
  );
};

export default Navbar;
