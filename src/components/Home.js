import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Our Application</h1>
      <div className="button-group">
        <button onClick={() => navigate('/login')} className="home-button login-button">
          Login
        </button>
        <button onClick={() => navigate('/signup')} className="home-button signup-button">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Home;
