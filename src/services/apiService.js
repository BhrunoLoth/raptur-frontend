// src/services/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // ✅ usa o proxy do Vite para redirecionar para localhost:3000
  withCredentials: true,
});

// ✅ Interceptor para injetar o token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ template string correta
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Opcional) Interceptor de resposta para capturar erros globais como 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Sessão expirada ou não autorizada. Redirecionando...');
      // window.location.href = '/login'; // Descomente se quiser forçar logout
    }
    return Promise.reject(error);
  }
);

export default api;
