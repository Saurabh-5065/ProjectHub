// src/lib/logout.ts
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  return async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
};
