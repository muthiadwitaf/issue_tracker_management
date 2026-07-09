import axios from 'axios';
import { notify } from '../composables/snackbar';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.code !== 'ERR_CANCELED') {
      const message = error.response?.data?.error || 'Terjadi kesalahan. Silakan coba lagi.';
      notify(message, 'error');
    }
    return Promise.reject(error);
  },
);

export default api;
