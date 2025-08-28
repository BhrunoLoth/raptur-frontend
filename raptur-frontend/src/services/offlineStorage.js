const STORAGE_KEY = 'embarques_offline';

export function salvarEmbarqueLocal(embarque) {
  const armazenados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  armazenados.push(embarque);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(armazenados));
}

export function listarEmbarquesOffline() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function limparEmbarquesSincronizados() {
  localStorage.removeItem(STORAGE_KEY);
}