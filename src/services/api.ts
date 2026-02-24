import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lf9server.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('todo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('todo_token');
      localStorage.removeItem('todo_user');
      window.location.href = '/todo/login';
    }
    return Promise.reject(error);
  }
);

export default api;
