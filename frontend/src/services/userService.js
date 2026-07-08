import api from './api';

export default {
  list() {
    return api.get('/users').then((res) => res.data);
  },
  getById(id) {
    return api.get(`/users/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/users', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/users/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/users/${id}`);
  },
};
