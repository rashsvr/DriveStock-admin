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
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await login({ email, password });
      const { token, data } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role: data.role, email }));
      setUser({ role: data.role, email });
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      if (error.isBigError) {
        navigate('/error', { state: { message: error.message, code: error.code } });
        return { success: false };
      }
      return { success: false, message: error.message };
    }
  };

  const handleRegister = async ({ email, password, role, name, phone }) => {
    try {
      const response = await register({ email, password, role, name, phone });
      const { token, data } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ role, email }));
      setUser({ role, email });
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
  };

  return (
    <AuthContext.Provider
      value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};