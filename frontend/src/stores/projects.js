import { defineStore } from 'pinia';
import projectService from '../services/projectService';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.items = await projectService.list();
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
        this.current = await projectService.getById(id);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const project = await projectService.create(payload);
      this.items.unshift(project);
      return project;
    },
    async update(id, payload) {
      const project = await projectService.update(id, payload);
      const idx = this.items.findIndex((p) => p.id === id);
      if (idx !== -1) this.items[idx] = { ...this.items[idx], ...project };
      return project;
    },
    async remove(id) {
      await projectService.remove(id);
      this.items = this.items.filter((p) => p.id !== id);
    },
  },
});
