import axios from 'axios';
import {
  listarEmbarquesOffline,
  limparEmbarquesSincronizados
} from './offlineStorage';

export async function sincronizarEmbarques() {
  const embarques = listarEmbarquesOffline();
  if (embarques.length === 0) return '⚠️ Nenhum embarque offline para sincronizar.';

  try {
    await axios.post('/api/embarques/sync', { embarques });
    limparEmbarquesSincronizados();
    return '✅ Embarques sincronizados com sucesso!';
  } catch (err) {
    console.error('Erro ao sincronizar embarques:', err);
    return '❌ Falha ao sincronizar embarques.';
  }
}