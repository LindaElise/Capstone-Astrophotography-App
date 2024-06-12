// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/api/signup', { email, password })
      .then(response => {
        onSignup(response.data.token);
        navigate('/');
      })
      .catch(error => {
        console.error('Error signing up:', error);
      });
  };

  const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }

  return (
    <div className='loginSignupDiv'>
      <h1>Sign up</h1>
      <form className='loginSignupForm' onSubmit={handleSubmit}>
        <input className='loginSignupEm' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className='loginSignupPs' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className='loginSignupSm' type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
