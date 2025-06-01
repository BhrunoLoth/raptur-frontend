// src/services/authService.js

const API = "http://localhost:3000/api/auth/login";

export async function login(email, senha) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) throw new Error("Falha no login");

  const data = await res.json();

  // Salva token e usuário diretamente
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.usuario));

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
