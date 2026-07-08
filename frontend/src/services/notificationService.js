import api from './api';

export default {
  list(userId) {
    return api.get('/notifications', { params: { userId } }).then((res) => res.data);
  },
  markRead(id) {
    return api.patch(`/notifications/${id}/read`).then((res) => res.data);
  },
  markAllRead(userId) {
    return api.patch('/notifications/read-all', null, { params: { userId } });
  },
};
