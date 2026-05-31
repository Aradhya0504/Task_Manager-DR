import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { user, saveAuth, clearAuth } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', credentials);
      saveAuth(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', userData);
      saveAuth(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the API call fails, clear local state
    }
    clearAuth();
    navigate('/login');
  };

  return { user, loading, error, login, register, logout };
};

export default useAuth;
