import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { authAPI } from '@/lib/api';
import type { User } from './authTypes';
import { AuthContext } from './authContextValue';

const STORAGE_KEY = 'qc_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const token = parsed.token ?? null;
          if (token) {
            // Validate token by fetching current user
            try {
              const res = await authAPI.getCurrentUser();
              if (!mounted) return;
              setUser(res.user ?? null);
              setToken(token);
            } catch (err) {
              // token invalid or request failed
              localStorage.removeItem(STORAGE_KEY);
              setUser(null);
              setToken(null);
            }
          } else {
            setUser(parsed.user ?? null);
            setToken(parsed.token ?? null);
          }
        } catch (err) {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
          setToken(null);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signin = async (email: string, password: string) => {
    setLoading(true);

      if (email === 'user@gmail.com' && password === '1234') {
        const token = `dev-token-${Date.now()}`;
        const u: User = { _id: 'dev-user', name: 'Dev User', email: 'user@gmail.com', isAdmin: false };
        persist(u, token);
        message.success('Signed in (dev mode)');
        setLoading(false);
        return;
      }
    

    try {
      const data = await authAPI.signin({ email, password });
      const { token, _id, name, isAdmin, email: userEmail } = data;
      const u: User = { _id, name, email: userEmail, isAdmin };
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
      const { token, _id, name: returnedName, isAdmin, email: userEmail } = data;
      const u: User = { _id, name: returnedName, email: userEmail, isAdmin };
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

  return (
    <AuthContext.Provider value={{ user, token, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
