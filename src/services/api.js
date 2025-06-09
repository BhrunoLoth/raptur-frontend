// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',            // usa o proxy do Vite em vez de http://localhost:3000
  withCredentials: true,      // se você usar cookies/sessão
});

// injeta o Authorization header em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
