const API_BASE = "http://localhost:3000/api";
const API_MOTORISTAS = `${API_BASE}/motoristas`;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function listarMotoristas() {
  const res = await fetch(API_MOTORISTAS, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao listar motoristas");
  return res.json();
}

export async function criarMotorista(dados) {
  const res = await fetch(API_MOTORISTAS, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar motorista");
  return res.json();
}

export async function deletarMotorista(id) {
  const res = await fetch(`${API_MOTORISTAS}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao excluir motorista");
  return res.json();
}