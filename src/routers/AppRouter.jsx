import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected route */}
      <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRouter;
