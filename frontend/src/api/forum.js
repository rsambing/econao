import client from './client';

export const listTopics = () => client.get('/forum/topics').then((r) => r.data);
export const getTopic = (id) => client.get(`/forum/topics/${id}`).then((r) => r.data);
export const createTopic = (data) => client.post('/forum/topics', data).then((r) => r.data);
export const createReply = (topicId, body) =>
  client.post(`/forum/topics/${topicId}/replies`, { body }).then((r) => r.data);
