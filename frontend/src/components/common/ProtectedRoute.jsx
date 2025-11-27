// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { isAuthenticated, hasActiveSession, hasRole, loading } = useAuth();

  if (loading) {
    // Podrías poner un spinner aquí si quieres
    return null;
  }

  // Sin sesión -> al login
  if (!isAuthenticated || !hasActiveSession()) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay requisitos de rol, basta con estar logueado
  const rolesToCheck = allowedRoles || (requiredRole ? [requiredRole] : null);
  if (rolesToCheck && !rolesToCheck.some((r) => hasRole(r))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;