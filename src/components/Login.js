import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from './api';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signIn({ email, password });
      localStorage.setItem('profile', JSON.stringify(data));
      console.log('Login successful:', data);
      navigate('/forms'); // Redirect to the forms page
    } catch (error) {
      console.error('Login error:', error.response?.data);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  );
}

export default Login;
