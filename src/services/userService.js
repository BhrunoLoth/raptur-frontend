// src/services/userService.js
import api from './api';

/**
 * 🔐 Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Promise<Object>} Dados do login (token, usuario)
 */
export async function login(email, senha) {
  const res = await api.post('/auth/login', { email, senha });
  return res.data;
}

/**
 * 🔍 Lista todos os usuários cadastrados.
 * @returns {Promise<Array>} Lista de usuários
 */
export async function listarUsuarios() {
  const res = await api.get('/usuarios');
  return res.data;
}

/**
 * ➕ Cria um novo usuário.
 * @param {Object} dados - Dados do novo usuário
 * @returns {Promise<Object>} Usuário criado
 */
export async function criarUsuario(dados) {
  const res = await api.post('/usuarios', dados);
  return res.data;
}

/**
 * ❌ Remove um usuário pelo ID.
 * @param {number|string} id - ID do usuário
 * @returns {Promise<void>}
 */
export async function deletarUsuario(id) {
  await api.delete(`/usuarios/${id}`);
}

/**
 * ✏️ Atualiza dados de um usuário.
 * @param {number|string} id - ID do usuário
 * @param {Object} dados - Dados atualizados
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function atualizarUsuario(id, dados) {
  const res = await api.put(`/usuarios/${id}`, dados);
  return res.data;
}

/**
 * 🔍 Busca um usuário específico por ID
 * @param {number|string} id 
 * @returns {Promise<Object>} Usuário
 */
export async function obterUsuario(id) {
  const res = await api.get(`/usuarios/${id}`);
  return res.data;
}
