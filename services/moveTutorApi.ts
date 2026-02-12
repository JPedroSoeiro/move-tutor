import axios from 'axios';

export const moveTutorApi = axios.create({
  baseURL: 'http://localhost:3001',
});

// Interceptor para injetar o token em cada chamada
moveTutorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('@MoveTutor:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});