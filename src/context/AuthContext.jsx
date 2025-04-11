import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, isAuthenticated } from '../services/sharedApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser.role === 'buyer') {
            window.location.href = 'http://localhost:5173';
          }
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await login({ email, password });
      const { token, userId, role } = response.data; // Updated to match new response
      localStorage.setItem('token', token);
      const userData = { userId, role, email }; // Store more details
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('Login successful:', { token, userData });
      if (role === 'buyer') {
        window.location.href = 'http://localhost:5173';
        return { success: true, message: 'Login successful! Redirecting to buyer site...' };
      }
      navigate('/dashboard'); // Redirect to dashboard immediately
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      console.error('Login error:', error);
      if (error.isBigError) {
        navigate('/error', { state: { message: error.message, code: error.code } });
        return { success: false };
      }
      return { success: false, message: error.message };
    }
  };

  const handleRegister = async ({ email, password, role, name, phone }) => {
    if (role !== 'seller') {
      return { success: false, message: 'Registration is only available for sellers in this panel.' };
    }
    try {
      const response = await register({ email, password, role: 'seller', name, phone });
      const { token, userId } = response.data; // Updated to match new response
      localStorage.setItem('token', token);
      const userData = { userId, role: 'seller', email, name, phone };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate('/dashboard');
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      if (error.isBigError) {
        navigate('/error', { state: { message: error.message, code: error.code } });
        return { success: false };
      }
      return { success: false, message: error.message };
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};