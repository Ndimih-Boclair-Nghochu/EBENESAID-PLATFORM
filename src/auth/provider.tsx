'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Must match SafeUser from db.ts
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  university: string;
  countryOfOrigin: string;
  userType: string;
  isActive: boolean;
  trialStartDate: string;
  trialEndDate: string;
  hasPaid: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

interface AuthContextState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isFirstLogin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearFirstLogin: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  countryOfOrigin?: string;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

async function readJsonSafely<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  // Check existing session on mount
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await readJsonSafely<{ user?: AuthUser }>(res);
      if (res.ok) {
        setUser(data?.user ?? null);
        setError(null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await readJsonSafely<{ user?: AuthUser; error?: string }>(res);

      if (res.ok && data?.user) {
        setUser(data.user);
        // Check if this is the user's first login (lastLoginAt is null means account was just created
        // or first real login)
        if (!data.user.lastLoginAt) {
          setIsFirstLogin(true);
        }
        return { success: true };
      } else {
        const error = data?.error || 'Login failed. Please try again.';
        setError(error);
        return { success: false, error };
      }
    } catch {
      const msg = 'Network error. Please check your connection.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await readJsonSafely<{ user?: AuthUser; error?: string }>(res);

      if (res.ok && responseData?.user) {
        setUser(responseData.user);
        setIsFirstLogin(true); // New registration is always first login
        return { success: true };
      } else {
        const error = responseData?.error || 'Registration failed. Please try again.';
        setError(error);
        return { success: false, error };
      }
    } catch {
      const msg = 'Network error. Please check your connection.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore errors — we clear state anyway
    }
    setUser(null);
    setIsFirstLogin(false);
    setError(null);
  }, []);

  const clearFirstLogin = useCallback(() => {
    setIsFirstLogin(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isFirstLogin,
        login,
        register,
        logout,
        refreshUser,
        clearFirstLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
