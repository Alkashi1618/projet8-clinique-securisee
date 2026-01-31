import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access');

      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.clear();
          setIsAuthenticated(false);
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Connexion
  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      const userResponse = await authAPI.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Identifiants incorrects'
      };
    }
  };

  // Déconnexion
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default AuthContext;