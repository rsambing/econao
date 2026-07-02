import api from './api';

export const listTopics = () => api.get('/forum/topics').then((r) => r.data);
export const getTopic = (id: number) => api.get(`/forum/topics/${id}`).then((r) => r.data);
export const createTopic = (title: string, description: string) =>
  api.post('/forum/topics', { title, description }).then((r) => r.data);
export const createReply = (topicId: number, body: string) =>
  api.post(`/forum/topics/${topicId}/replies`, { body }).then((r) => r.data);
