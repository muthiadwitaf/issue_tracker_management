import api from './api';

export default {
  list() {
    return api.get('/labels').then((res) => res.data);
  },
  create(payload) {
    return api.post('/labels', payload).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/labels/${id}`);
  },
};
