"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  hasProfile: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<AuthUser>;
  register(email: string, password: string, name: string): Promise<AuthUser>;
  logout(): Promise<void>;
  refreshUser(): Promise<void>;
  updateUser(u: Partial<AuthUser>): void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, name: string): Promise<AuthUser> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const updateUser = (u: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...u } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
