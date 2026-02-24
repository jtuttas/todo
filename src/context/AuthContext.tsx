import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('todo_token');
    const storedUser = localStorage.getItem('todo_user');

    if (!storedToken || !storedUser || isTokenExpired(storedToken)) {
      localStorage.removeItem('todo_token');
      localStorage.removeItem('todo_user');
      setIsInitializing(false);
      return;
    }

    // Token sieht lokal gültig aus → serverseitig verifizieren
    const parsedUser = JSON.parse(storedUser) as User;
    api.get(`/users/${parsedUser.id}`)
      .then(() => {
        setToken(storedToken);
        setUser(parsedUser);
      })
      .catch(() => {
        localStorage.removeItem('todo_token');
        localStorage.removeItem('todo_user');
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('todo_token', newToken);
    localStorage.setItem('todo_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
