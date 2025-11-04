import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Garante `/api`
const baseURL = API_URL.includes("/api") ? API_URL : `${API_URL}/api`;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Intercepta token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Expira sessão se 401
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
  login: (cpf: string, senha: string) => api.post("/auth/login", { cpf, senha }),
  getProfile: () => api.get("/auth/me"),
};

/* ---------------- PIX ---------------- */
export const pixAPI = {
  criarRecarga: (valor: number) => api.post("/pagamento/gerar-pagamento", { valor }),
  consultarStatus: (id: string) => api.get(`/pagamento/status/${id}`),
  listarPagamentos: () => api.get("/pagamento/meus"),
};

/* ---------------- Embarques ---------------- */
export const embarqueAPI = {
  validar: (qrCode: string, viagemId: string) =>
    api.post("/embarques/validar", { qrCode, viagemId }),
};

/* ---------------- Viagens ---------------- */
export const viagemAPI = {
  minhas: () => api.get("/viagens/minhas"),
  iniciar: (id: string) => api.post(`/viagens/${id}/iniciar`),
  finalizar: (id: string) => api.post(`/viagens/${id}/finalizar`),
};

/* ---------------- Idoso ---------------- */
export const idosoAPI = {
  minha: () => api.get("/idoso/me"),
  solicitar: () => api.post("/idoso/solicitar"),
};

/* ---------------- Usuários ---------------- */
export const usuarioAPI = {
  listar: () => api.get("/usuarios"),
  criar: (data: any) => api.post("/usuarios", data),
  editar: (id: string, data: any) => api.put(`/usuarios/${id}`, data),
  ativar: (id: string) => api.put(`/usuarios/${id}`, { ativo: true }),
  desativar: (id: string) => api.put(`/usuarios/${id}`, { ativo: false }),
};

/* ---------------- Dashboard Admin ✅ NOVO ---------------- */
export const dashboardAPI = {
  estatisticas: () => api.get("/admin/dashboard/resumo"),
};
