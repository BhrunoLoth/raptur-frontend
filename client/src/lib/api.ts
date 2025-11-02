import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:3000/api';

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

// Auth
export const authAPI = {
  login: (cpf: string, senha: string) =>
    api.post('/auth/login', { cpf, senha }),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  getProfile: () =>
    api.get('/auth/perfil'),
};

// PIX
export const pixAPI = {
  criarRecarga: (valor: number) =>
    api.post('/pix/recarga', { valor }),
  
  consultarStatus: (pagamentoId: string) =>
    api.get(`/pix/status/${pagamentoId}`),
  
  listarPagamentos: () =>
    api.get('/pix/pagamentos'),
};

// Embarque
export const embarqueAPI = {
  validar: (qrCodeData: string, viagemId: string) =>
    api.post('/embarques/validar', { qrCodeData, viagemId }),
  
  listarPorViagem: (viagemId: string) =>
    api.get(`/embarques/viagem/${viagemId}`),
  
  sincronizar: (embarques: any[]) =>
    api.post('/embarques/sincronizar', { embarques }),
};

// Viagem
export const viagemAPI = {
  listar: (params?: any) =>
    api.get('/viagens', { params }),
  
  minhas: () =>
    api.get('/viagens/minhas'),
  
  buscar: (id: string) =>
    api.get(`/viagens/${id}`),
  
  iniciar: (id: string) =>
    api.put(`/viagens/${id}/iniciar`),
  
  finalizar: (id: string, observacoes?: string) =>
    api.put(`/viagens/${id}/finalizar`, { observacoes }),
};

// Carteirinha Idoso
export const idosoAPI = {
  solicitar: () =>
    api.post('/idosos'),
  
  minha: () =>
    api.get('/idosos/minha'),
  
  validar: (numero: string) =>
    api.get(`/idosos/validar/${numero}`),
  
  listar: (params?: any) =>
    api.get('/idosos', { params }),
};

// Dashboard
export const dashboardAPI = {
  estatisticas: () =>
    api.get('/dashboard/estatisticas'),
  
  viagens: (params?: any) =>
    api.get('/dashboard/viagens', { params }),
  
  topRotas: (limit?: number) =>
    api.get('/dashboard/top-rotas', { params: { limit } }),
};

// Usuários
export const usuarioAPI = {
  listar: (params?: any) =>
    api.get('/usuarios', { params }),
  
  buscar: (id: string) =>
    api.get(`/usuarios/${id}`),
  
  criar: (data: any) =>
    api.post('/usuarios', data),
  
  atualizar: (id: string, data: any) =>
    api.put(`/usuarios/${id}`, data),
  
  deletar: (id: string) =>
    api.delete(`/usuarios/${id}`),
};

export default api;

