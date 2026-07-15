import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      setLoading(false);
      throw err;
    }
  };

  const registerUser = async (name, email, password, address, phone) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register({ name, email, password, address, phone });
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      setLoading(false);
      throw err;
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error on server, continuing client logout', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfileLocal = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        updateProfileLocal,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
