// src/services/idosoService.js
import api from './api';

export async function listarIdosos({ page = 1, limit = 10, search = '', ativo = true, min_age = 65 } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  if (ativo !== undefined) params.set('ativo', String(ativo));
  if (min_age) params.set('min_age', String(min_age));

  const { data } = await api.get(`/idosos?${params.toString()}`);

  // Normaliza possíveis formatos
  // Seu back envia { idosos, totalItems, currentPage }.
  if (data?.idosos) {
    return {
      rows: data.idosos,
      total: data.totalItems ?? data.idosos.length,
      page: data.currentPage ?? page,
      limit,
    };
  }

  return data ?? { rows: [], total: 0, page, limit };
}

export async function buscarIdoso(id) {
  const { data } = await api.get(`/idosos/${id}`);
  return data;
}

export async function criarIdoso(payload) {
  // payload pode ser FormData (foto) ou JSON
  const isFormData = payload instanceof FormData;
  const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
  const { data } = await api.post('/idosos', payload, { headers });
  return data;
}

export async function atualizarIdoso(id, payload) {
  const isFormData = payload instanceof FormData;
  const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
  const { data } = await api.put(`/idosos/${id}`, payload, { headers });
  return data;
}

export async function removerIdoso(id) {
  const { data } = await api.delete(`/idosos/${id}`);
  return data;
}

export async function uploadFoto(id, file) {
  const fd = new FormData();
  fd.append('foto', file);
  const { data } = await api.put(`/idosos/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
