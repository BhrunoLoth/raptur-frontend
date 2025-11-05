import axios from "axios";

// ✅ Ajuste inteligente da URL base para evitar /api/api
let API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Remove barra final se existir
API_URL = API_URL.replace(/\/$/, "");

// Remove /api final se existir
API_URL = API_URL.replace(/\/api$/, "");

// Adiciona /api no final corretamente
const baseURL = `${API_URL}/api`;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Anexa Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Redireciona no 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* ---------------- AUTH ---------------- */
export const authAPI = {
  login: (cpf, senha) => api.post("/auth/login", { cpf, senha }),
  getProfile: () => api.get("/auth/me"),
};

/* ---------------- PIX ---------------- */
export const pixAPI = {
  criarRecarga: (valor) => api.post("/pagamento/gerar-pagamento", { valor }),
  consultarStatus: (id) => api.get(`/pagamento/status/${id}`),
  listarPagamentos: () => api.get("/pagamento/meus"),
};

/* ---------------- Embarques ---------------- */
export const embarqueAPI = {
  validar: (qrCode, viagemId) => api.post("/embarques/validar", { qrCode, viagemId }),
};

/* ---------------- Viagens ---------------- */
export const viagemAPI = {
  minhas: () => api.get("/viagens/minhas"),
  iniciar: (id) => api.post(`/viagens/${id}/iniciar`),
  finalizar: (id) => api.post(`/viagens/${id}/finalizar`),
};

/* ---------------- Idoso ---------------- */
export const idosoAPI = {
  minha: () => api.get("/idoso/me"),
  solicitar: () => api.post("/idoso/solicitar"),
};

/* ---------------- Usuários ---------------- */
export const usuarioAPI = {
  listar: () => api.get("/usuarios"),
  criar: (data) => api.post("/usuarios", data),
  editar: (id, data) => api.put(`/usuarios/${id}`, data),
  ativar: (id) => api.put(`/usuarios/${id}`, { ativo: true }),
  desativar: (id) => api.put(`/usuarios/${id}`, { ativo: false }),
};

/* ---------------- Dashboard Admin ✅ ---------------- */
export const dashboardAPI = {
  resumo: () => api.get("/dashboard/resumo"),
  estatisticas: () => api.get("/dashboard/estatisticas"),
  notificacoes: () => api.get("/dashboard/notificacoes"),
};
