// src/services/idosoService.js
import api from './api';

/**
 * Lista de idosos com paginação e filtros
 */
export async function listarIdosos({ page = 1, limit = 10, search = '', ativo = true } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (ativo !== undefined) params.set('ativo', String(ativo));

  const { data } = await api.get(`/idosos?${params.toString()}`);
  // Normaliza possíveis respostas 204/sem corpo
  return data ?? { rows: [], total: 0, page, limit };
}

/**
 * Cria um idoso
 */
export async function criarIdoso(payload) {
  const { data } = await api.post('/idosos', payload);
  return data;
}

/**
 * Atualiza um idoso
 */
export async function atualizarIdoso(id, payload) {
  const { data } = await api.put(`/idosos/${id}`, payload);
  return data;
}

/**
 * Remove um idoso
 */
export async function removerIdoso(id) {
  const { data } = await api.delete(`/idosos/${id}`);
  return data;
}
