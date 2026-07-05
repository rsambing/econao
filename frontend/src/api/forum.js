import client from './client';

export const listTopics = () => client.get('/forum/topics').then((r) => r.data);
export const getTopic = (id) => client.get(`/forum/topics/${id}`).then((r) => r.data);
export const createTopic = (data) => client.post('/forum/topics', data).then((r) => r.data);
export const updateTopic = (id, data) => client.put(`/forum/topics/${id}`, data).then((r) => r.data);
export const deleteTopic = (id) => client.delete(`/forum/topics/${id}`).then((r) => r.data);
export const createReply = (topicId, body) =>
  client.post(`/forum/topics/${topicId}/replies`, { body }).then((r) => r.data);
export const updateReply = (replyId, body) =>
  client.put(`/forum/replies/${replyId}`, { body }).then((r) => r.data);
export const deleteReply = (replyId) => client.delete(`/forum/replies/${replyId}`).then((r) => r.data);
