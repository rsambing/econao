import api from './api';

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password }).then((r) => r.data);

export const me = () => api.get('/auth/me').then((r) => r.data);

export const updateMe = (data: {
  name?: string;
  avatarUrl?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}) => api.put('/auth/me', data).then((r) => r.data);

export const forgotPassword = (email: string) =>
  api.post('/auth/forgot-password', { email }).then((r) => r.data);
