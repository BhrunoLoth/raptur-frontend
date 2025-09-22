// src/services/embarqueService.js
import api from './api';

/**
 * 📋 Listar embarques com filtros
 * @param {Object} filtros - Filtros opcionais
 * @returns {Promise<Object>} Lista de embarques
 */
export async function listarEmbarques(filtros = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const response = await api.get(`/embarques?${params.toString()}`);
  return response.data;
}

// Manter compatibilidade com código existente
export async function buscarEmbarques() {
  return listarEmbarques();
}

/**
 * 🔍 Buscar embarque por ID
 * @param {string} id - ID do embarque
 * @returns {Promise<Object>} Dados do embarque
 */
export async function buscarEmbarque(id) {
  const response = await api.get(`/embarques/${id}`);
  return response.data;
}

/**
 * ➕ Criar novo embarque
 * @param {Object} dados - Dados do embarque
 * @returns {Promise<Object>} Embarque criado
 */
export async function criarEmbarque(dados) {
  const response = await api.post('/embarques', dados);
  return response.data;
}

/**
 * ✏️ Atualizar embarque
 * @param {string} id - ID do embarque
 * @param {Object} dados - Dados para atualização
 * @returns {Promise<Object>} Embarque atualizado
 */
export async function atualizarEmbarque(id, dados) {
  const response = await api.put(`/embarques/${id}`, dados);
  return response.data;
}

/**
 * ❌ Remover embarque
 * @param {string} id - ID do embarque
 * @returns {Promise<void>}
 */
export async function deletarEmbarque(id) {
  await api.delete(`/embarques/${id}`);
}

/**
 * 📱 Validar QR Code para embarque
 * @param {string} qrCode - Código QR escaneado
 * @returns {Promise<Object>} Dados de validação
 */
export async function validarQRCode(qrCode) {
  const response = await api.post('/embarques/validar-qr', { qr_code: qrCode });
  return response.data;
}

/**
 * 📊 Obter histórico de embarques do motorista
 * @param {string} motoristaId - ID do motorista (opcional)
 * @param {string} data - Data no formato YYYY-MM-DD (opcional)
 * @returns {Promise<Array>} Lista de embarques
 */
export async function obterHistoricoMotorista(motoristaId = null, data = null) {
  const params = new URLSearchParams();
  if (data) params.append('data', data);
  
  const url = motoristaId 
    ? `/embarques/motorista/${motoristaId}?${params.toString()}`
    : `/embarques/motorista/historico?${params.toString()}`;
    
  const response = await api.get(url);
  return response.data;
}

/**
 * 👤 Obter embarques de um usuário específico
 * @param {string} usuarioId - ID do usuário
 * @param {Object} opcoes - Opções de paginação
 * @returns {Promise<Object>} Embarques do usuário
 */
export async function obterEmbarquesUsuario(usuarioId, opcoes = {}) {
  const { limit = 20, offset = 0 } = opcoes;
  const response = await api.get(`/embarques/usuario/${usuarioId}?limit=${limit}&offset=${offset}`);
  return response.data;
}

/**
 * 🔄 Sincronizar embarques offline (para motoristas)
 * @param {Array} embarques - Lista de embarques offline
 * @returns {Promise<Object>} Resultado da sincronização
 */
export async function sincronizarEmbarquesOffline(embarques) {
  const response = await api.post('/embarques/sincronizar', { embarques });
  return response.data;
}

/**
 * 🎫 Gerar QR Code para embarque do usuário
 * @param {string} usuarioId - ID do usuário
 * @returns {Promise<string>} QR Code em formato JSON
 */
export async function gerarQRCodeEmbarque(usuarioId) {
  const qrData = {
    usuario_id: usuarioId,
    tipo: 'embarque',
    timestamp: Date.now(),
    valido_ate: Date.now() + (5 * 60 * 1000) // Válido por 5 minutos
  };
  
  return JSON.stringify(qrData);
}

/**
 * 📱 Processar embarque via QR Code (para motoristas)
 * @param {string} qrCode - Código QR escaneado
 * @param {string} onibusId - ID do ônibus
 * @param {string} viagemId - ID da viagem
 * @returns {Promise<Object>} Resultado do embarque
 */
export async function processarEmbarqueQR(qrCode, onibusId, viagemId) {
  try {
    // Validar QR Code primeiro
    const validacao = await validarQRCode(qrCode);
    
    if (!validacao.valido) {
      throw new Error('QR Code inválido ou expirado');
    }
    
    // Criar embarque
    const embarque = await criarEmbarque({
      usuario_id: validacao.usuario.id,
      viagem_id: viagemId,
      onibus_id: onibusId,
      tipo_embarque: determinarTipoEmbarque(validacao.usuario),
      valor_pago: calcularValorEmbarque(validacao.usuario),
      metodo_pagamento: 'credito'
    });
    
    return {
      sucesso: true,
      embarque: embarque.embarque,
      usuario: validacao.usuario,
      mensagem: `Embarque confirmado para ${validacao.usuario.nome}`
    };
    
  } catch (error) {
    console.error('❌ Erro ao processar embarque:', error);
    return {
      sucesso: false,
      erro: error.message,
      mensagem: `Erro no embarque: ${error.message}`
    };
  }
}

/**
 * 🎯 Determinar tipo de embarque baseado no usuário
 * @param {Object} usuario - Dados do usuário
 * @returns {string} Tipo de embarque
 */
function determinarTipoEmbarque(usuario) {
  if (usuario.subtipo_passageiro === 'idoso') return 'idoso';
  if (usuario.subtipo_passageiro === 'aluno_gratuito') return 'estudante';
  return 'normal';
}

/**
 * 💰 Calcular valor do embarque baseado no usuário
 * @param {Object} usuario - Dados do usuário
 * @returns {number} Valor a ser cobrado
 */
function calcularValorEmbarque(usuario) {
  // Valores padrão - podem ser configuráveis
  const valores = {
    idoso: 0,
    aluno_gratuito: 0,
    aluno_pagante: 2.50,
    comum: 5.00
  };
  
  return valores[usuario.subtipo_passageiro] || valores.comum;
}

/**
 * 📊 Formatar dados de embarque para exibição
 * @param {Object} embarque - Dados do embarque
 * @returns {Object} Embarque formatado
 */
export function formatarEmbarque(embarque) {
  return {
    ...embarque,
    data_formatada: new Date(embarque.data).toLocaleString('pt-BR'),
    valor_formatado: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(embarque.valor_pago || 0),
    status_formatado: formatarStatusEmbarque(embarque.status),
    tipo_formatado: formatarTipoEmbarque(embarque.tipo_embarque)
  };
}

/**
 * 📊 Formatar status do embarque
 * @param {string} status - Status do embarque
 * @returns {Object} Status formatado
 */
function formatarStatusEmbarque(status) {
  const statusMap = {
    'pendente': { texto: 'Pendente', cor: 'warning', icone: '⏳' },
    'confirmado': { texto: 'Confirmado', cor: 'success', icone: '✅' },
    'cancelado': { texto: 'Cancelado', cor: 'error', icone: '❌' },
    'registrado': { texto: 'Registrado', cor: 'info', icone: '📝' }
  };
  
  return statusMap[status] || { texto: status, cor: 'default', icone: '❓' };
}

/**
 * 🎫 Formatar tipo de embarque
 * @param {string} tipo - Tipo do embarque
 * @returns {Object} Tipo formatado
 */
function formatarTipoEmbarque(tipo) {
  const tipoMap = {
    'normal': { texto: 'Normal', cor: 'primary', icone: '🎫' },
    'gratuito': { texto: 'Gratuito', cor: 'success', icone: '🆓' },
    'estudante': { texto: 'Estudante', cor: 'info', icone: '🎓' },
    'idoso': { texto: 'Idoso', cor: 'secondary', icone: '👴' }
  };
  
  return tipoMap[tipo] || { texto: tipo, cor: 'default', icone: '🎫' };
}
