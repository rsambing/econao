import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('econao_token').catch(() => null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const rawMsg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Erro desconhecido';
    const msg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg);
    return Promise.reject(new Error(msg));
  }
);

export default api;
