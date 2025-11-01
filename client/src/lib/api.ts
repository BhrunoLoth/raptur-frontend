import axios from 'axios';
import { useAuthStore } from './store'; // Importa o store Zustand

// Cria uma instância do Axios com a URL base da API vinda das variáveis de ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Fallback para 8080
});

// Interceptor de Request: Adiciona o token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    // Pega o token diretamente do localStorage ou do store Zustand
    const token = localStorage.getItem('token') || useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Lida com erros 401 (Unauthorized) - Token expirado/inválido
api.interceptors.response.use(
  (response) => {
    return response; // Retorna a resposta se for bem-sucedida
  },
  (error) => {
    // Se o erro for 401, desloga o usuário
    if (error.response && error.response.status === 401) {
      console.warn('Erro 401: Token inválido ou expirado. Deslogando...');
      // Chama a ação de logout do store Zustand para limpar o estado e o localStorage
      useAuthStore.getState().logout();
      // Opcional: Redirecionar para a página de login
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    // Rejeita a promise para que o erro possa ser tratado no local da chamada da API
    return Promise.reject(error);
  }
);

/**
 * Exporta um objeto de autenticação separado.
 * Como VITE_API_URL não inclui /api no final, adicionamos explicitamente /api nas rotas.
 */
export const authAPI = {
  login: (cpf: string, senha: string) =>
    api.post('/api/auth/login', { cpf, senha }),
  getProfile: () => api.get('/api/auth/profile'),
};

export default api;
