'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Initial load directly from localStorage for instant UI sync
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('studynook_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error reading localStorage:', err);
    } finally {
      setLoading(false);
    }

    // 2. Validate session with server cookie in background
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.success && data?.user) {
        setUser(data.user);
        localStorage.setItem('studynook_user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.log('Session sync background error:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('studynook_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('studynook_user');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, checkUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);