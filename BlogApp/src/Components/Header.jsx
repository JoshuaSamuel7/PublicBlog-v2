import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Buffer } from 'buffer';
import axios from 'axios';
import './Header.css';

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
    setIsNavOpen(false); // Close the navbar after clicking
  };

  // Close navbar when route changes
  useEffect(() => {
    if (isNavOpen) {
      setIsNavOpen(false);
    }
  }, [location]);

  return (
    <header className="header">
      <h1 className="header-title">My Blog Site</h1>
      <button className="nav-toggle" onClick={toggleNav}>
        &#9776;
      </button>
      <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
        <button onClick={handleHomeClick} className="header-button">Home</button>
        <Link to="/add-blogs" className="header-button" onClick={() => setIsNavOpen(false)}>Add Blogs</Link>
        <Link to="/edit-blogs" className="header-button" onClick={() => setIsNavOpen(false)}>Manage Blogs</Link>
        <Link to="/about" className="header-button" onClick={() => setIsNavOpen(false)}>About Us / Contact Us</Link>
        {user ? (
          <>
            <Link to="/profile" className="header-button" onClick={() => setIsNavOpen(false)}>Profile</Link>
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
            <Link to="/login" className="header-button" onClick={() => setIsNavOpen(false)}>Login</Link>
            <Link to="/signup" className="header-button" onClick={() => setIsNavOpen(false)}>Register</Link>
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
