import { useState, useEffect } from 'react';
import { setAuthToken, login, register } from '../services/api';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials);
      setAuthToken(data.access);
      setCurrentUser({
        id: data.user_id,
        username: credentials.email.split('@')[0],
        email: credentials.email,
      });
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        username: credentials.email.split('@')[0],
        email: credentials.email,
      }));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const handleSignup = async (userData) => {
    try {
      const data = await register(userData);
      setAuthToken(data.access); // Assuming backend returns token on register
      setCurrentUser({
        id: data.user_id || `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        studentId: userData.studentId,
        phone: userData.phone,
      });
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id || `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        studentId: userData.studentId,
        phone: userData.phone,
      }));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  return { currentUser, handleLogin, handleSignup, handleLogout, isLoading };
};