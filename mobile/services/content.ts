import api from './api';

export const listContent = () => api.get('/content').then((r) => r.data);
export const getContent = (id: number) => api.get(`/content/${id}`).then((r) => r.data);
export const createComment = (contentId: number, body: string) =>
  api.post(`/content/${contentId}/comments`, { body }).then((r) => r.data);
export const updateComment = (commentId: number, body: string) =>
  api.put(`/comments/${commentId}`, { body }).then((r) => r.data);
export const deleteComment = (commentId: number) =>
  api.delete(`/comments/${commentId}`).then((r) => r.data);
