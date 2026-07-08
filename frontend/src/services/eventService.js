import api from './api';

export default {
  list(issueId) {
    return api.get(`/issues/${issueId}/events`).then((res) => res.data);
  },
  createComment(issueId, payload) {
    return api.post(`/issues/${issueId}/events`, payload).then((res) => res.data);
  },
};
