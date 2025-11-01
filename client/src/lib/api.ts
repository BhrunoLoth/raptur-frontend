// Updated client/src/lib/api.ts for frontend-cpf-oficial
import axios from 'axios';

// Usa a URL base da API das variáveis de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
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

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --------------------- AUTH ---------------------
// Prefixamos todas as rotas com /api para compatibilidade com o backend
export const authAPI = {
  login: (cpf: string, senha: string) =>
    api.post('/api/auth/login', { cpf, senha }),

  register: (data: any) =>
    api.post('/api/auth/register', data),

  getProfile: () =>
    api.get('/api/auth/profile'),
};

// --------------------- PIX ----------------------
export const pixAPI = {
  criarRecarga: (valor: number) =>
    api.post('/api/pix/recarga', { valor }),

  consultarStatus: (pagamentoId: string) =>
    api.get(`/api/pix/status/${pagamentoId}`),

  listarPagamentos: () =>
    api.get('/api/pix/pagamentos'),
};

// ------------------- EMBARQUE -------------------
export const embarqueAPI = {
  validar: (qrCodeData: string, viagemId: string) =>
    api.post('/api/embarques/validar', { qrCodeData, viagemId }),

  listarPorViagem: (viagemId: string) =>
    api.get(`/api/embarques/viagem/${viagemId}`),

  sincronizar: (embarques: any[]) =>
    api.post('/api/embarques/sincronizar', { embarques }),
};

// --------------------- VIAGEM --------------------
export const viagemAPI = {
  listar: (params?: any) =>
    api.get('/api/viagens', { params }),

  minhas: () =>
    api.get('/api/viagens/minhas'),

  buscar: (id: string) =>
    api.get(`/api/viagens/${id}`),

  iniciar: (id: string) =>
    api.put(`/api/viagens/${id}/iniciar`),

  finalizar: (id: string, observacoes?: string) =>
    api.put(`/api/viagens/${id}/finalizar`, { observacoes }),
};

// ------------------ CARTEIRINHA IDOSO ---------------
export const idosoAPI = {
  solicitar: () =>
    api.post('/api/idosos'),

  minha: () =>
    api.get('/api/idosos/minha'),

  validar: (numero: string) =>
    api.get(`/api/idosos/validar/${numero}`),

  listar: (params?: any) =>
    api.get('/api/idosos', { params }),
};

// --------------------- DASHBOARD --------------------
export const dashboardAPI = {
  estatisticas: () =>
    api.get('/api/dashboard/estatisticas'),

  viagens: (params?: any) =>
    api.get('/api/dashboard/viagens', { params }),

  topRotas: (limit?: number) =>
    api.get('/api/dashboard/top-rotas', { params: { limit } }),
};

// --------------------- USUÁRIOS --------------------
export const usuarioAPI = {
  listar: (params?: any) =>
    api.get('/api/usuarios', { params }),

  buscar: (id: string) =>
    api.get(`/api/usuarios/${id}`),

  criar: (data: any) =>
    api.post('/api/usuarios', data),

  atualizar: (id: string, data: any) =>
    api.put(`/api/usuarios/${id}`, data),

  deletar: (id: string) =>
    api.delete(`/api/usuarios/${id}`),
};

export default api;
