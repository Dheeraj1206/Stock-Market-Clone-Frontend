import React, { useEffect, useState } from 'react';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

const PrivateRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthenticated(false);
    } else {
      // Optional: validate token with backend
      fetch('http://localhost:5000/api/auth/validate', {  // Corrected the URL here
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) {
            setAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setAuthenticated(false);
          }
        })
        .catch(() => {
          setAuthenticated(false);
        });
    }
  }, []);

  if (!authenticated) return <LoginPage />;
  return <HomePage />;
};

export default PrivateRoute;
