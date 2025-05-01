import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
    } else {
      fetch('http://localhost:5000/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setAuthenticated(false);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
