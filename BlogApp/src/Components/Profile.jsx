import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { Buffer } from 'buffer';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/logout', { withCredentials: true });
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="profile-page">
      {user && (
        <div className="profile-card">
          {user.profilePicture && user.profilePicture.data && (
            <img
              src={`data:${user.profilePicture.contentType};base64,${Buffer.from(user.profilePicture.data.data).toString('base64')}`}
              alt={user.name}
              className="profile-picture"
            />
          )}
          <h2>{user.name}</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
          <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
          <button className='logoutbtn' onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
