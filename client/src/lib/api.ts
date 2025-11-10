import axios from "axios";

/* 🌐 BASE DA API (CORRIGIDA)
---------------------------------------------------------- */
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
let API_URL = rawUrl.trim();

// ✅ Garante que tenha apenas UM /api, sem duplicar nem cortar errado
if (!/\/api\/?$/.test(API_URL)) {
  API_URL = `${API_URL.replace(/\/+$/, "")}/api`;
} else {
  API_URL = API_URL.replace(/\/+$/, "");
}

/* 🧠 Instância global do Axios
---------------------------------------------------------- */
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/* 🔐 Interceptores de Autenticação
---------------------------------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

/* ---------------- UTILIDADES ---------------- */
const formatCPF = (cpf: string) =>
  cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

const formatTelefone = (tel: string) =>
  tel.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

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

/* ---------------- Idoso 🧓 ---------------- */
export const idosoAPI = {
  minha: () => api.get("/idoso/me"),
  solicitar: () => api.post("/idoso/solicitar"),
  listarSolicitacoes: () => api.get("/idoso/solicitacoes"),
  aprovar: (id: string) => api.put(`/idoso/aprovar/${id}`),
  rejeitar: (id: string) => api.put(`/idoso/rejeitar/${id}`),
  uploadFoto: (id: string, arquivo: File) => {
    const formData = new FormData();
    formData.append("foto", arquivo);
    return api.post(`/idoso/foto/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  imprimirCarteira: (id: string) =>
    window.open(`${API_URL}/idoso/carteira/${id}`, "_blank"),
};

/* ---------------- Usuários ---------------- */
export const usuarioAPI = {
  listar: () => api.get("/usuarios"),
  criar: (data: any) => {
    const payload = {
      ...data,
      cpf: formatCPF(data.cpf),
      telefone: formatTelefone(data.telefone || ""),
    };
    return api.post("/usuarios", payload);
  },
  editar: (id: string, data: any) => {
    const payload = {
      ...data,
      cpf: formatCPF(data.cpf),
      telefone: formatTelefone(data.telefone || ""),
    };
    return api.put(`/usuarios/${id}`, payload);
  },
  ativar: (id: string) => api.put(`/usuarios/${id}/ativar`),
  desativar: (id: string) => api.put(`/usuarios/${id}/desativar`),
};

/* ---------------- Dashboard Admin ✅ ---------------- */
export const dashboardAPI = {
  resumo: () => api.get("/dashboard/resumo"),
  estatisticas: () => api.get("/dashboard/estatisticas"),
  notificacoes: () => api.get("/dashboard/notificacoes"),
};
