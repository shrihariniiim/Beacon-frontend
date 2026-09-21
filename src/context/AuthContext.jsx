import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('beaconcare_user');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session on boot
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('beaconcare_access_token');
      if (token) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('beaconcare_user', JSON.stringify(freshUser));
        } catch (err) {
          // If expired and refresh fails, local storage is cleared by api interceptor
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { user: userData, accessToken, refreshToken } = res.data;

    localStorage.setItem('beaconcare_access_token', accessToken);
    localStorage.setItem('beaconcare_refresh_token', refreshToken);
    localStorage.setItem('beaconcare_user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await authService.register(formData);
    const { user: userData, accessToken, refreshToken } = res.data;

    localStorage.setItem('beaconcare_access_token', accessToken);
    localStorage.setItem('beaconcare_refresh_token', refreshToken);
    localStorage.setItem('beaconcare_user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const isParent = user?.role === 'PARENT';
  const isNGO = user?.role === 'NGO';
  const isGovernment = user?.role === 'GOVERNMENT';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isParent,
        isNGO,
        isGovernment,
        isAdmin,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
