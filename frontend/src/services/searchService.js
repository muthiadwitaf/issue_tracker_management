import api from './api';

export default {
  search(q) {
    return api.get('/search', { params: { q } }).then((res) => res.data);
  },
};
