import axios from 'axios';

export const moveTutorApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

// Interceptor para injetar o token em cada chamada
moveTutorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('@MoveTutor:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});