import axios from "axios";

/* 🌐 BASE DA API (corrigida e segura para deploy)
---------------------------------------------------------- */
const rawUrl = import.meta.env.VITE_API_URL || "https://raptur-system-production.up.railway.app";
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

/* 🧾 FORMATAÇÃO DE CAMPOS
---------------------------------------------------------- */
export const formatCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatTelefone = (telefone: string) => {
  if (!telefone) return "";
  return telefone
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

/* ---------------- Usuários ---------------- */
export const usuarioAPI = {
  listar: () => api.get("/usuarios"),
  criar: (data: any) =>
    api.post("/usuarios", {
      ...data,
      cpf: formatCPF(data.cpf),
      telefone: formatTelefone(data.telefone),
    }),
  editar: (id: string, data: any) =>
    api.put(`/usuarios/${id}`, {
      ...data,
      cpf: formatCPF(data.cpf),
      telefone: formatTelefone(data.telefone),
    }),
  ativar: (id: string) => api.put(`/usuarios/${id}/ativar`),
  desativar: (id: string) => api.put(`/usuarios/${id}/desativar`),
  deletar: (id: string) => api.delete(`/usuarios/${id}`),
};

/* ---------------- Auth ---------------- */
export const authAPI = {
  login: (cpf: string, senha: string) => api.post("/auth/login", { cpf, senha }),
  getProfile: () => api.get("/auth/me"),
};

/* ---------------- Dashboard Admin ---------------- */
export const dashboardAPI = {
  resumo: () => api.get("/dashboard/resumo"),
  estatisticas: () => api.get("/dashboard/estatisticas"),
  notificacoes: () => api.get("/dashboard/notificacoes"),
};
