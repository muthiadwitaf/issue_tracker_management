import { defineStore } from 'pinia';
import issueService from '../services/issueService';

export const useIssuesStore = defineStore('issues', {
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        this.items = await issueService.list(filters);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchById(id) {
      this.loading = true;
      this.error = null;
      try {
        this.current = await issueService.getById(id);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const issue = await issueService.create(payload);
      this.items.unshift(issue);
      return issue;
    },
    async update(id, payload) {
      const issue = await issueService.update(id, payload);
      this._replace(issue);
      return issue;
    },
    async updateStatus(id, payload) {
      const issue = await issueService.updateStatus(id, payload);
      this._replace(issue);
      return issue;
    },
    async assign(id, assigneeId) {
      const issue = await issueService.assign(id, assigneeId);
      this._replace(issue);
      return issue;
    },
    async updateLabels(id, labelIds) {
      const issue = await issueService.updateLabels(id, labelIds);
      this._replace(issue);
      return issue;
    },
    async updateStartDate(id, startDate) {
      const issue = await issueService.updateStartDate(id, startDate);
      this._replace(issue);
      return issue;
    },
    async updateDueDate(id, dueDate) {
      const issue = await issueService.updateDueDate(id, dueDate);
      this._replace(issue);
      return issue;
    },
    async remove(id) {
      await issueService.remove(id);
      this.items = this.items.filter((i) => i.id !== id);
    },
    _replace(issue) {
      const idx = this.items.findIndex((i) => i.id === issue.id);
      if (idx !== -1) this.items[idx] = issue;
      if (this.current && this.current.id === issue.id) this.current = issue;
    },
  },
});
