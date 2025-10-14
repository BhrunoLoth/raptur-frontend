import axios from 'axios';

export async function buscarViagensPorPassageiro(usuarioId, dataInicio, dataFim) {
  const params = new URLSearchParams({ inicio: dataInicio, fim: dataFim }).toString();
  const { data } = await axios.get(`/api/relatorios/viagens/${usuarioId}?${params}`);
  return data;
}