import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as AuthAPI from '../services/auth';
import { User } from '../types/auth';

const TOKEN_KEY = 'econao_token';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return;
      const me = await AuthAPI.me();
      setUser(me);
    } catch (err) {
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await AuthAPI.login(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await AuthAPI.register(name, email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    setUser(user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
