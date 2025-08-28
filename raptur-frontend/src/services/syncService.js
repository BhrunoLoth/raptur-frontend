// ✅ services/syncService.js
import axios from 'axios';

const STORAGE_KEY = 'embarquesOffline';

export function salvarEmbarqueLocal(embarque) {
  const armazenados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  armazenados.push(embarque);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(armazenados));
}

export async function sincronizarEmbarques() {
  const embarques = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  if (embarques.length === 0) {
    return '📭 Nenhum embarque offline para sincronizar.';
  }

  try {
    const token = localStorage.getItem('token');

    const res = await axios.post(
      '/api/sync-embarques',
      { embarques },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.sucesso) {
      localStorage.removeItem(STORAGE_KEY);
      return `✅ ${embarques.length} embarques sincronizados com sucesso!`;
    } else {
      return '❌ Erro ao sincronizar: ' + res.data.erro;
    }
  } catch (error) {
    console.error('Erro na sync:', error);
    return '❌ Falha na comunicação com o servidor.';
  }
}

// 🔄 Sincronização contínua a cada 30 segundos quando online
let syncInterval = null;

export function iniciarSincronizacaoAutomatica(intervaloMs = 30000) {
  if (syncInterval) return; // já está rodando

  const loop = async () => {
    if (navigator.onLine) {
      console.log('🔄 Tentando sincronizar embarques offline...');
      await sincronizarEmbarques();
    }
  };

  loop(); // executa na inicialização

  syncInterval = setInterval(loop, intervaloMs);
  console.log(`✅ Sincronização automática iniciada a cada ${intervaloMs / 1000}s.`);
}

export function pararSincronizacaoAutomatica() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('🛑 Sincronização automática parada.');
  }
}

