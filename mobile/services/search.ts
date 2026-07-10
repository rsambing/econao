import api from './api';

export const search = (q: string) => api.get('/search', { params: { q } }).then((r) => r.data);
