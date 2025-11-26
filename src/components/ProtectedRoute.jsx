import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return role === 'approval_officer' ? (
      <Navigate to="/admin/dashboard" />
    ) : role === 'dispatch_officer' ? (
      <Navigate to="/user/dashboard" />
    ) : (
      <Navigate to="/" />
    );
  }

  return children;
};

export default ProtectedRoute;