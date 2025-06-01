const API = "http://localhost:3000/api/embarques";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function buscarEmbarques() {
  const res = await fetch(API, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao carregar embarques");
  return res.json();
}

export async function criarEmbarque(dados) {
  const res = await fetch(API, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar embarque");
  return res.json();
}

export async function atualizarEmbarque(id, dados) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao atualizar embarque");
  return res.json();
}

export async function deletarEmbarque(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao remover embarque");
  return res.json();
}