import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ setUser }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('dob', dob);
    formData.append('profilePicture', profilePicture);
    formData.append('mobileNumber', mobileNumber);

    try {
      const response = await axios.post('http://localhost:8000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data.user); // Assume backend sends user data
      navigate('/');
    } catch (error) {
      setError('Signup failed, please try again');
      console.error('Signup error', error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </label>
        <label>
          Profile Picture:
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            accept="image/*"
            required
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="tel"
            value={mobileNumber}
            maxlength="10"
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Already have an account? <a href="/login">Login here</a></p>
      </form>
    </div>
  );
};

export default Signup;
