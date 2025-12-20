import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { authAPI } from '@/lib/api';
import type { User } from './authTypes';
import { AuthContext } from './authContextValue';

const STORAGE_KEY = 'qc_auth';
const TOKEN_KEY = 'qc-token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        // Skip validation for mock token
        if (storedToken === 'mock-jwt-token') {
          const mockUser: User = {
            _id: 'mock-user-id',
            name: 'Test User',
            email: 'user@gmail.com',
            isAdmin: false,
            theme: 'light'
          };
          setUser(mockUser);
          setToken(storedToken);
        } else {
          try {
            // Validate token by fetching current user
            const res = await authAPI.getCurrentUser();
            if (!mounted) return;
            // API returns user data directly, not wrapped in user property
            const userData = res._id ? res : res.user;
            setUser(userData ?? null);
            setToken(storedToken);
          } catch (err) {
            // token invalid or request failed
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(TOKEN_KEY);
            setUser(null);
            setToken(null);
          }
        }
      } else {
        // Fallback to old storage format for backward compatibility
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed.user ?? null);
            setToken(parsed.token ?? null);
            // Migrate to new format
            if (parsed.token) {
              localStorage.setItem(TOKEN_KEY, parsed.token);
            }
          } catch (err) {
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
            setToken(null);
          }
        }
      }
      if (mounted) setLoading(false);
    };

    init();
    return () => { mounted = false; };
  }, []);

  const persist = (u: User | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u }));
      localStorage.setItem(TOKEN_KEY, t);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const signin = async (email: string, password: string) => {
    setLoading(true);

    // Bypass login for test user
    if (email === 'user@gmail.com' && password === '1234') {
      const mockUser: User = {
        _id: 'mock-user-id',
        name: 'Test User',
        email: 'user@gmail.com',
        isAdmin: false,
        theme: 'light'
      };
      const mockToken = 'mock-jwt-token';
      persist(mockUser, mockToken);
      message.success('Signed in successfully');
      setLoading(false);
      return;
    }

    try {
      const data = await authAPI.signin({ email, password });
      const { token, _id, name, isAdmin, email: userEmail, theme } = data;
      const u: User = { _id, name, email: userEmail, isAdmin, theme };
      persist(u, token);
      message.success('Signed in successfully');
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || 'Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authAPI.signup({ name, email, password });
      const { token, _id, name: returnedName, isAdmin, email: userEmail, theme } = data;
      const u: User = { _id, name: returnedName, email: userEmail, isAdmin, theme };
      persist(u, token);
      message.success('Account created');
    } catch (error: unknown) {
      const err = error as Error;
      message.error(err.message || 'Sign up failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    persist(null, null);
    message.info('Signed out');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Update stored user data
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updatedUser }));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signin, signup, signout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
