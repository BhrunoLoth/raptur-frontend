const API = "http://localhost:3000/api/pagamentos";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// Buscar todos os pagamentos
export async function buscarPagamentos() {
  const res = await fetch(API, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao carregar pagamentos");
  return res.json();
}

// Buscar pagamento por ID
export async function buscarPagamentoPorId(id) {
  const res = await fetch(`${API}/${id}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao buscar pagamento");
  return res.json();
}

// Criar novo pagamento
export async function criarPagamento(dados) {
  const res = await fetch(API, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao criar pagamento");
  return res.json();
}

// Atualizar pagamento
export async function atualizarPagamento(id, dados) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Erro ao atualizar pagamento");
  return res.json();
}

// Remover pagamento
export async function deletarPagamento(id) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Erro ao remover pagamento");
  return res.json();
}