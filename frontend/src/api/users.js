import client from './client';

export const getPublicProfile = (id) => client.get(`/users/${id}/public`).then((r) => r.data);
