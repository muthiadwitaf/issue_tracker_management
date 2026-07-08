import api from './api';

export default {
  login(email, password) {
    return api.post('/auth/login', { email, password }).then((res) => res.data);
  },
  me() {
    return api.get('/auth/me').then((res) => res.data);
  },
};
