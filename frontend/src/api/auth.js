import client from './client';

export const login = (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data);
export const register = (name, email, password) =>
  client.post('/auth/register', { name, email, password }).then((r) => r.data);
export const me = () => client.get('/auth/me').then((r) => r.data);
export const updateMe = (data) => client.put('/auth/me', data).then((r) => r.data);
export const forgotPassword = (email) => client.post('/auth/forgot-password', { email }).then((r) => r.data);
export const resetPassword = (token, password) =>
  client.post('/auth/reset-password', { token, password }).then((r) => r.data);
