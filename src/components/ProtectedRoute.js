import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/userAuth';

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
        console.log(isAuthenticated)
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;