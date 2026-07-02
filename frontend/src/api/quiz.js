import client from './client';

export const listQuizzes = () => client.get('/quizzes').then((r) => r.data);
export const getQuiz = (id) => client.get(`/quizzes/${id}`).then((r) => r.data);
export const createQuiz = (data) => client.post('/quizzes', data).then((r) => r.data);
export const submitAttempt = (id, answers) =>
  client.post(`/quizzes/${id}/attempts`, { answers }).then((r) => r.data);
export const getRanking = (id) => client.get(`/quizzes/${id}/ranking`).then((r) => r.data);
