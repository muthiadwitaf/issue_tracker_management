import api from './api';

export default {
  list() {
    return api.get('/projects').then((res) => res.data);
  },
  getById(id) {
    return api.get(`/projects/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/projects', payload).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/projects/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/projects/${id}`);
  },
};
