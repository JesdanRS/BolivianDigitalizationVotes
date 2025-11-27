import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Opcional: Muestra un componente de carga mientras se verifica la autenticación
    return <div>Cargando...</div>;
  }
  
  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar si se proporcionaron roles permitidos como array
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    // Redirigir según el rol actual
    return redirectBasedOnRole(user.role);
  }
  
  // Mantener compatibilidad con la versión anterior que usa requiredRole
  if (requiredRole && user.role !== requiredRole) {
    // Redirigir según el rol actual
    return redirectBasedOnRole(user.role);
  }
  
  // Función auxiliar para redirigir según el rol
  function redirectBasedOnRole(role) {
    switch(role) {
      case 'usuario':
        return <Navigate to="/votacion" replace />;
      case 'auditor':
        return <Navigate to="/auditoria" replace />;
      case 'admin':
        return <Navigate to="/gestionar-candidatos" replace />;
      case 'jurado':
        return <Navigate to="/jurado-espera" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  // Si el usuario está autenticado y tiene el rol requerido (o no se requiere un rol específico)
  return children;
};

export default ProtectedRoute;
