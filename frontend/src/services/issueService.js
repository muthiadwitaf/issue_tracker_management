import api from './api';

function buildFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;
    if (key === 'files' && Array.isArray(value)) {
      value.forEach((file) => formData.append('files', file));
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value === null) {
      formData.append(key, '');
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

export default {
  list(filters = {}) {
    return api.get('/issues', { params: filters }).then((res) => res.data);
  },
  getById(id) {
    return api.get(`/issues/${id}`).then((res) => res.data);
  },
  create(payload) {
    return api.post('/issues', buildFormData(payload)).then((res) => res.data);
  },
  update(id, payload) {
    return api.put(`/issues/${id}`, payload).then((res) => res.data);
  },
  updateStatus(id, payload) {
    return api.patch(`/issues/${id}/status`, buildFormData(payload)).then((res) => res.data);
  },
  assign(id, assigneeId) {
    return api.patch(`/issues/${id}/assign`, { assigneeId }).then((res) => res.data);
  },
  updateLabels(id, labelIds) {
    return api.patch(`/issues/${id}/labels`, { labelIds }).then((res) => res.data);
  },
  updateStartDate(id, startDate) {
    return api.patch(`/issues/${id}/start-date`, { startDate }).then((res) => res.data);
  },
  updateDueDate(id, dueDate) {
    return api.patch(`/issues/${id}/due-date`, { dueDate }).then((res) => res.data);
  },
  remove(id) {
    return api.delete(`/issues/${id}`);
  },
};
