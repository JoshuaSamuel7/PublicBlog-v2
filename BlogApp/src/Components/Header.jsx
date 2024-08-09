import React from 'react';
import { useState } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Buffer } from 'buffer';
import axios from 'axios';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/logout', { withCredentials: true });
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      navigate(0); // Force a re-render if already on the home page
    } else {
      navigate('/'); // Navigate to the home page
    }
  };

  return (
    <header className="header">
      <h1 className="header-title">My Blog Site</h1>
      <button className="nav-toggle" onClick={toggleNav}>
        &#9776;
      </button>
      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button onClick={handleHomeClick} className="header-button">Home</button>
        <Link to="/add-blogs" className="header-button">Add Blogs</Link>
        <Link to="/edit-blogs" className="header-button">Manage Blogs</Link>
        <Link to="/about" className="header-button">About Us / Contact Us</Link>
        {user ? (
          <>
            <Link to="/profile" className="header-button">Profile</Link>
            <div className='acc-name'>
              {user.profilePicture && user.profilePicture.data && (
                <img
                  src={`data:${user.profilePicture.contentType};base64,${Buffer.from(user.profilePicture.data.data).toString('base64')}`}
                  alt={user.name}
                  className="imgph"
                />
              )}
              {user.name}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="header-button">Login</Link>
            <Link to="/signup" className="header-button">Register</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} className="header-button">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
