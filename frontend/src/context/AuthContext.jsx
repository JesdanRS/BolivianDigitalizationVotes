import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserData, isAuthenticated, logout, saveUserData } from '../services/authService';
import {
  getTokenByRole,
  getStoredToken,
  clearToken,
  hasActiveSession,
  getCurrentRole
} from '../services/keycloakService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keycloakToken, setKeycloakToken] = useState(null);

  useEffect(() => {
    // Cargar datos del usuario desde localStorage al iniciar
    if (isAuthenticated()) {
      setUser(getUserData());
    }

    // Verificar si hay una sesión de Keycloak activa
    if (hasActiveSession()) {
      setKeycloakToken(getStoredToken());
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    clearToken();
    setUser(null);
    setKeycloakToken(null);
  };

  /**
   * Login con Keycloak por rol
   * @param {string} role - Rol para obtener token: 'USER', 'AUDITOR', o 'ADMIN'
   */
  const loginWithKeycloak = async (role) => {
    try {
      const tokenData = await getTokenByRole(role);
      setKeycloakToken(tokenData);

      // También establecer el usuario local con el rol
      const userData = {
        role: tokenData.role.toLowerCase(),
        username: tokenData.username,
        isKeycloakAuth: true
      };

      saveUserData(userData);
      setUser(userData);

      return tokenData;
    } catch (error) {
      console.error('Error al hacer login con Keycloak:', error);
      throw error;
    }
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido
   */
  const hasRole = (requiredRole) => {
    if (!user) return false;
    const normalizedRequired = requiredRole.toLowerCase();

    // 1) Mirar rol del token de Keycloak (USER, ADMIN, AUDITOR)
    if (keycloakToken) {
      const currentRole = getCurrentRole(); // e.g. 'USER'
      if (currentRole && currentRole.toLowerCase() === normalizedRequired) {
        return true;
      }
    }

    // 2) Fallback: rol guardado en el usuario del front (admin, auditor, jurado)
    if (user.role && user.role.toLowerCase() === normalizedRequired) {
      return true;
    }

    return false;
  };

  const value = {
    user,
    loading,
    login,
    logout: handleLogout,
    loginWithKeycloak,
    isAuthenticated: !!user,
    keycloakToken,
    hasActiveSession, // OJO: aquí pasamos la función importada, no hasActiveSession()
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

