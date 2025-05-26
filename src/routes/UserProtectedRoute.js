// src/routes/UserProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserProtectedRoute = () => {
  // Check if the user is authenticated (using your auth method)
  const isAuthenticated = localStorage.getItem('token'); // or your authentication logic

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, allow access to child routes
  return <Outlet />;
};

export default UserProtectedRoute;
