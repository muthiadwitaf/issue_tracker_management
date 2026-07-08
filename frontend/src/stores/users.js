import { defineStore } from 'pinia';
import userService from '../services/userService';

export const useUsersStore = defineStore('users', {
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
        this.items = await userService.list();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async create(payload) {
      const user = await userService.create(payload);
      this.items.push(user);
      return user;
    },
    async update(id, payload) {
      const user = await userService.update(id, payload);
      const idx = this.items.findIndex((u) => u.id === id);
      if (idx !== -1) this.items[idx] = user;
      return user;
    },
    async remove(id) {
      await userService.remove(id);
      this.items = this.items.filter((u) => u.id !== id);
    },
  },
});
