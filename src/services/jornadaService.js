// src/services/jornadaService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

/**
 * 🚀 Iniciar uma jornada
 */
export async function iniciarJornada(motoristaId, onibusId) {
  try {
    const res = await axios.post(
      `${API_URL}/jornadas/iniciar`,
      { motoristaId, onibusId },
      getAuthHeaders()
    );
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao iniciar jornada:", err);
    throw err.response?.data || { erro: "Erro ao iniciar jornada." };
  }
}

/**
 * 🛑 Encerrar uma jornada
 */
export async function encerrarJornada(jornadaId) {
  try {
    const res = await axios.post(
      `${API_URL}/jornadas/encerrar`,
      { jornadaId },
      getAuthHeaders()
    );
    return res.data;
  } catch (err) {
    console.error("❌ Erro ao encerrar jornada:", err);
    throw err.response?.data || { erro: "Erro ao encerrar jornada." };
  }
}

/**
 * 🔎 Buscar jornada ativa do motorista
 */
export async function buscarJornadaAtiva(motoristaId) {
  try {
    const res = await axios.get(
      `${API_URL}/jornadas/ativas/${motoristaId}`,
      getAuthHeaders()
    );
    return res.data;
  } catch {
    return null;
  }
}
