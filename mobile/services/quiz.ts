import api from './api';

export const listQuizzes = () => api.get('/quizzes').then((r) => r.data);
export const getQuiz = (id: number) => api.get(`/quizzes/${id}`).then((r) => r.data);
export const submitAttempt = (id: number, answers: { questionId: number; optionId: number }[]) =>
  api.post(`/quizzes/${id}/attempts`, { answers }).then((r) => r.data);
export const getRanking = (id: number) => api.get(`/quizzes/${id}/ranking`).then((r) => r.data);
