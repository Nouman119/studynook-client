'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  setPersistence, 
  browserLocalPersistence, 
  inMemoryPersistence 
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/firebase.config';

const AuthContext = createContext(null);

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('studynook_token') : null;
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers,
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

  // ইমেইল ও পাসওয়ার্ড দিয়ে সাধারণ লগইন
  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        console.error('Failed to parse response JSON:', err);
      }

      if (res.ok && data?.success) {
        if (data.token) {
          localStorage.setItem('studynook_token', data.token);
        }
        login(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data?.message || 'Invalid email or password' 
        };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { 
        success: false, 
        message: 'Could not connect to server. Please try again.' 
      };
    }
  };

  // Google Sign In integration
  const googleLogin = async () => {
    try {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (persistenceErr) {
        console.warn('Storage partitioned or blocked, falling back to inMemory:', persistenceErr);
        await setPersistence(auth, inMemoryPersistence);
      }

      googleProvider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isGoogleLogin: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('studynook_token', data.token);
        }
        login(data.user);
        await checkUserStatus();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Google login failed' };
      }
    } catch (error) {
      console.error('Google Auth Error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Login cancelled. Popup closed.' };
      }
      return { success: false, message: error.message || 'Google authentication encountered an error.' };
    }
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
      localStorage.removeItem('studynook_token');
      localStorage.removeItem('studynook_user');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser, 
        login, 
        loginUser, 
        logout, 
        loading, 
        checkUserStatus, 
        googleLogin,
        googleSignIn: googleLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);