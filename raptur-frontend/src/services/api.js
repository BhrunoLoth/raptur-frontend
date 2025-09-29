// src/services/api.js
import axios from 'axios';

/**
 * Base URL da API:
 * - Em produção, defina VITE_API_URL no Vercel como
 *   https://raptur-system-production.up.railway.app/api  (com /api no final)
 * - Em dev, cai no fallback http://localhost:3000/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  // Usamos Authorization: Bearer, então não precisamos enviar cookies
  withCredentials: false,
});

/* ------------------------------ REQUEST ------------------------------ */
api.interceptors.request.use(
  (config) => {
    // Anexa o token (se existir)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log opcional
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

/* ------------------------------ RESPONSE ----------------------------- */
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { response, request, message } = error;

    // Resposta recebida com erro HTTP
    if (response) {
      const { status, data } = response;

      // Não autenticado / token inválido/expirado
      if (status === 401) {
        console.warn('🔒 401 recebido — limpando sessão e redirecionando para /login');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      if (status === 403) console.warn('🚫 403 Acesso negado');
      if (status >= 500)  console.error('🔥 Erro interno do servidor');

      const msg = data?.erro || data?.message || `Erro HTTP ${status}`;
      return Promise.reject(new Error(msg));
    }

    // Sem resposta (erro de rede / CORS / servidor offline)
    if (request) {
      console.error('🌐 Erro de rede - Servidor indisponível');
      return Promise.reject(new Error('Servidor indisponível. Verifique sua conexão.'));
    }

    // Erro na configuração da requisição
    console.error('⚙️ Erro na configuração da requisição:', message);
    return Promise.reject(new Error('Erro na configuração da requisição'));
  }
);

/* ------------------------------ HELPERS ------------------------------ */

/** Verifica se a API está online (/health). */
export const checkApiHealth = async () => {
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  try {
    const res = await axios.get(`${backend}/health`, { timeout: 5000 });
    return res.status === 200;
  } catch (err) {
    console.error('❌ API Health Check falhou:', err?.message || err);
    return false;
  }
};

/** Retorna o usuário logado salvo no localStorage (ou null). */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('usuario');
    return null;
  }
};

/** Indica se há sessão válida (token + usuario). */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const usuario = getCurrentUser();
  return Boolean(token && usuario);
};

export default api;
