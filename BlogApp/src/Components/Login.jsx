import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const Login = ({setUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/login', { username, password },{ withCredentials: true })
      .then(response => {
        setUser(response.data.user); 
        navigate('/');
      })
      .catch(error => {
        setError('Invalid credentials, please try again');
        console.error('Login error', error);
      });
  };

  return (
    <div className="auth-container-l">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
