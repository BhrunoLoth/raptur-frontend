const API_BASE = "http://localhost:3000/api";
const API_USUARIOS = `${API_BASE}/usuarios`;
const API_LOGIN = `${API_USUARIOS}/login`;

// Helper para pegar o token e montar headers
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// LOGIN
export async function login(email, senha) {
  const res = await fetch(API_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || "Login inválido");
  }

  // Salva o token no localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

// Lista todos usuários
export async function listarUsuarios() {
  const res = await fetch(API_USUARIOS, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Erro ao listar usuários");
  return res.json();
}

// Cria novo usuário
export async function criarUsuario(dados) {
  const res = await fetch(API_USUARIOS, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });

  if (!res.ok) throw new Error("Erro ao criar usuário");
  return res.json();
}

// Atualiza dados de um usuário
export async function atualizarUsuario(id, dados) {
  const res = await fetch(`${API_USUARIOS}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });

  if (!res.ok) throw new Error("Erro ao atualizar usuário");
  return res.json();
}

// Exclui um usuário
export async function deletarUsuario(id) {
  const res = await fetch(`${API_USUARIOS}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Erro ao excluir usuário");
  return res.json();
}