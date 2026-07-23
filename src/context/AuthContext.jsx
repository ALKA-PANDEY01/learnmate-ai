import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.success && response.user) {
          const userWithAvatar = {
            ...response.user,
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${response.user.username}`,
            role: 'Student'
          };
          setUser(userWithAvatar);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email: emailOrUsername, password });
      if (response.success && response.user) {
        const userWithAvatar = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${response.user.username}`,
          role: 'Student'
        };
        setUser(userWithAvatar);
        setIsAuthenticated(true);
        return { success: true, user: userWithAvatar };
      }
    } catch (err) {
      throw new Error(err.message || 'Login failed. Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, username, password });
      if (response.success && response.user) {
        const userWithAvatar = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${response.user.username}`,
          role: 'Student'
        };
        setUser(userWithAvatar);
        setIsAuthenticated(true);
        return { success: true, user: userWithAvatar };
      }
    } catch (err) {
      throw new Error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn("Logout call failed", err.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await api.patch('/profile', updatedData);
      if (response.success && response.data) {
        setUser((prev) => (prev ? { ...prev, ...response.data } : null));
        return { success: true };
      }
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile details.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUser }}>
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
