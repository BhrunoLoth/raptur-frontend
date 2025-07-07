import axios from 'axios';

// Garante o backend certo: em produção pega VITE_API_URL, senão usa proxy
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor para injetar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Você pode forçar logout aqui se quiser
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
