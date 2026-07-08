import { defineStore } from 'pinia';
import labelService from '../services/labelService';

export const useLabelsStore = defineStore('labels', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.items = await labelService.list();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const label = await labelService.create(payload);
      this.items.push(label);
      return label;
    },
    async remove(id) {
      await labelService.remove(id);
      this.items = this.items.filter((l) => l.id !== id);
    },
  },
});
