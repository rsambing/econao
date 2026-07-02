import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('econao_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('econao_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem('econao_token', token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const { token, user } = await authApi.register(name, email, password);
    localStorage.setItem('econao_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('econao_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await authApi.updateMe(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
