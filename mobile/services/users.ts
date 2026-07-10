import api from './api';

export const getPublicProfile = (id: number | string) => api.get(`/users/${id}/public`).then((r) => r.data);
