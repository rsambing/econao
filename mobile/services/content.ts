import api from './api';

export const listContent = () => api.get('/content').then((r) => r.data);
export const getContent = (id: number) => api.get(`/content/${id}`).then((r) => r.data);
export const createComment = (contentId: number, body: string) =>
  api.post(`/content/${contentId}/comments`, { body }).then((r) => r.data);
