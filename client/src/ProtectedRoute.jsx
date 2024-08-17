import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log("Token:", token);
  console.log("User:", user);

  const isAuthenticated = token && user && (user.id || (user.user && user.user.id));

  return isAuthenticated ? children : <Navigate to="/no-register" />;
};

export default ProtectedRoute;