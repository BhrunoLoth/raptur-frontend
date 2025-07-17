// src/services/authService.js

const API = `${import.meta.env.VITE_API_URL}/auth/login`;

// 🔐 Realiza login e armazena token + usuário
export async function login(email, senha) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  if (!res.ok) throw new Error("Falha no login");

  const data = await res.json();

  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  return data;
}

// 🔓 Logout - remove dados locais
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

// ✅ Verifica se usuário está logado
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// 📦 Retorna dados do usuário logado (ou null)
export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch (err) {
    return null;
  }
}
