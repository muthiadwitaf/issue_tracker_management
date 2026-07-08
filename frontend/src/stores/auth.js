import { defineStore } from 'pinia';
import authService from '../services/authService';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: readStoredUser(),
    restoring: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(email, password) {
      const { token, user } = await authService.login(email, password);
      this.token = token;
      this.user = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    async restoreSession() {
      if (!this.token) return;
      this.restoring = true;
      try {
        const user = await authService.me();
        this.user = user;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch {
        this.logout();
      } finally {
        this.restoring = false;
      }
    },
  },
});
