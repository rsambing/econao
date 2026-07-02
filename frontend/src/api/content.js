import client from './client';

export const listContent = (params) => client.get('/content', { params }).then((r) => r.data);
export const getContent = (id) => client.get(`/content/${id}`).then((r) => r.data);
export const createContent = (data) => client.post('/content', data).then((r) => r.data);
export const updateContent = (id, data) => client.put(`/content/${id}`, data).then((r) => r.data);
export const deleteContent = (id) => client.delete(`/content/${id}`).then((r) => r.data);
export const listComments = (contentId) => client.get(`/content/${contentId}/comments`).then((r) => r.data);
export const createComment = (contentId, body) =>
  client.post(`/content/${contentId}/comments`, { body }).then((r) => r.data);
