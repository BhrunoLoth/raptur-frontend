// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 segundos
  withCredentials: true,
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para desenvolvimento
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas e erros
api.interceptors.response.use(
  (response) => {
    // Log para desenvolvimento
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    // Erro de resposta do servidor
    if (response) {
      const { status, data } = response;
      
      // Token expirado ou inválido
      if (status === 401) {
        console.warn('🔒 Token expirado ou inválido. Redirecionando para login...');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // Redirecionar para login apenas se não estiver já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Acesso negado
      if (status === 403) {
        console.warn('🚫 Acesso negado');
      }
      
      // Servidor indisponível
      if (status >= 500) {
        console.error('🔥 Erro interno do servidor');
      }
      
      // Log do erro
      console.error(`❌ API Error ${status}:`, data?.erro || data?.message || 'Erro desconhecido');
      
      // Retornar erro estruturado
      const errorMessage = data?.erro || data?.message || `Erro HTTP ${status}`;
      return Promise.reject(new Error(errorMessage));
    }
    
    // Erro de rede (sem resposta)
    if (request) {
      console.error('🌐 Erro de rede - Servidor indisponível');
      return Promise.reject(new Error('Servidor indisponível. Verifique sua conexão.'));
    }
    
    // Erro na configuração da requisição
    console.error('⚙️ Erro na configuração da requisição:', message);
    return Promise.reject(new Error('Erro na configuração da requisição'));
  }
);

// Função helper para verificar se a API está online
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error('❌ API Health Check falhou:', error.message);
    return false;
  }
};

// Função helper para obter informações do usuário logado
export const getCurrentUser = () => {
  try {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error('❌ Erro ao obter usuário atual:', error);
    localStorage.removeItem('usuario');
    return null;
  }
};

// Função helper para verificar se o usuário está logado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const usuario = getCurrentUser();
  return !!(token && usuario);
};

export default api;
