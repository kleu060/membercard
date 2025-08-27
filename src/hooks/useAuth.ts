'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: 'Failed to check authentication status',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    checkAuth,
  };
}