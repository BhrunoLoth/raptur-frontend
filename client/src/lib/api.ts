import axios from "axios";

/* ==============================
   CONFIGURAÇÃO BASE
============================== */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://raptur-system-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token automaticamente se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ==============================
   FORMATAÇÕES ÚTEIS
============================== */
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

/* ==============================
   USUÁRIOS
============================== */
export const usuarioAPI = {
  listar: () => api.get("/usuarios"),

  obterPorId: (id: string) => api.get(`/usuarios/${id}`),

  criar: (dados: any) =>
    api.post("/usuarios", {
      ...dados,
      cpf: formatCPF(dados.cpf),
      telefone: formatTelefone(dados.telefone),
    }),

  atualizar: (id: string, dados: any) =>
    api.put(`/usuarios/${id}`, {
      ...dados,
      cpf: formatCPF(dados.cpf),
      telefone: formatTelefone(dados.telefone),
    }),

  deletar: (id: string) => api.delete(`/usuarios/${id}`),

  ativar: (id: string) => api.put(`/usuarios/${id}/ativar`),

  desativar: (id: string) => api.put(`/usuarios/${id}/desativar`),
};

/* ==============================
   LOGIN / AUTENTICAÇÃO
============================== */
export const authAPI = {
  login: (email: string, senha: string) =>
    api.post("/auth/login", { email, senha }),

  validarToken: () => api.get("/auth/validar"),
};

/* ==============================
   DASHBOARD / RELATÓRIOS
============================== */
export const dashboardAPI = {
  resumo: () => api.get("/admin/dashboard/resumo"),
  estatisticas: () => api.get("/admin/dashboard/estatisticas"),
  notificacoes: () => api.get("/admin/dashboard/notificacoes"),
};
