// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/api/login', { email, password })
      .then(response => {
        onLogin(response.data.token);
        navigate('/');
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };

  const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }

  return (
    <div className='loginSignupDiv'>
    <h1>Log in</h1>
    <form className='loginSignupForm' onSubmit={handleSubmit}>
      <input className='loginSignupEm' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className='loginSignupPs' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className='loginSignupSm' type="submit">Login</button>
    </form>
  </div>
  );
};

export default Login;
