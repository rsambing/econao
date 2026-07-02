import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('econao_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Erro desconhecido';
    return Promise.reject(new Error(msg));
  }
);

export default client;
