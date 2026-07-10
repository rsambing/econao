import api from './api';

export const listTopics = () => api.get('/forum/topics').then((r) => r.data);
export const getTopic = (id: number) => api.get(`/forum/topics/${id}`).then((r) => r.data);
export interface TopicPayload {
  title: string;
  description: string;
  theme?: string | null;
  imageUrl?: string | null;
}
export const createTopic = (data: TopicPayload) =>
  api.post('/forum/topics', data).then((r) => r.data);
export const updateTopic = (id: number, data: Partial<TopicPayload>) =>
  api.put(`/forum/topics/${id}`, data).then((r) => r.data);
export const deleteTopic = (id: number) =>
  api.delete(`/forum/topics/${id}`).then((r) => r.data);
export const createReply = (topicId: number, body: string) =>
  api.post(`/forum/topics/${topicId}/replies`, { body }).then((r) => r.data);
export const updateReply = (replyId: number, body: string) =>
  api.put(`/forum/replies/${replyId}`, { body }).then((r) => r.data);
export const deleteReply = (replyId: number) =>
  api.delete(`/forum/replies/${replyId}`).then((r) => r.data);
