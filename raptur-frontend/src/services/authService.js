// src/services/authService.js
import api from './api';

/**
 * Faz login na API e salva sessão no localStorage.
 * Retorna o objeto do usuário para você decidir o redirect.
 */
export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });

  if (!data?.token || !data?.usuario) {
    throw new Error('Resposta de login inválida.');
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));

  return data.usuario;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function getSession() {
  try {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('usuario');
    const usuario = raw ? JSON.parse(raw) : null;
    return token && usuario ? { token, usuario } : null;
  } catch {
    return null;
  }
}
