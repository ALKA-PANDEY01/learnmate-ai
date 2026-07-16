import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS_KEY = 'learnmate_mock_users';
const CURRENT_USER_KEY = 'learnmate_current_user';
const TOKEN_KEY = 'learnmate_token';

const DEFAULT_USERS = [
  {
    id: '1',
    name: 'Demo Learner',
    email: 'demo@learnmate.ai',
    username: 'demo',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    role: 'Student',
    joinedAt: '2026-01-15'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock users if not present
    if (!localStorage.getItem(MOCK_USERS_KEY)) {
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }

    // Check if user is logged in
    const token = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    // Add brief artificial delay to simulate API response
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || JSON.stringify(DEFAULT_USERS));
    const matchedUser = users.find(
      (u) => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );

    if (matchedUser) {
      const { password, ...userWithoutPassword } = matchedUser;
      const fakeToken = `lm_tok_${Math.random().toString(36).substring(2)}`;
      
      localStorage.setItem(TOKEN_KEY, fakeToken);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userWithoutPassword };
    } else {
      setLoading(false);
      throw new Error('Invalid email/username or password.');
    }
  };

  const register = async (name, email, username, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    
    const emailExists = users.some((u) => u.email === email);
    if (emailExists) {
      setLoading(false);
      throw new Error('Email is already registered.');
    }

    const usernameExists = users.some((u) => u.username === username);
    if (usernameExists) {
      setLoading(false);
      throw new Error('Username is already taken.');
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      username,
      password, // In mock we store plain, obviously don't do this in production
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
      role: 'Student',
      joinedAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

    // Automatically log in the registered user
    const { password: _, ...userWithoutPassword } = newUser;
    const fakeToken = `lm_tok_${Math.random().toString(36).substring(2)}`;
    
    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    setLoading(false);
    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    // Also update in mock users list
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updatedData } : u);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));
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
