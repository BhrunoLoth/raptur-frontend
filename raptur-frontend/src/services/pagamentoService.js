// src/services/pagamentoService.js
import api from './api';

/**
 * 💳 Listar pagamentos do usuário
 * @param {Object} filtros - Filtros opcionais (status, metodo, etc.)
 * @returns {Promise<Object>} Lista de pagamentos
 */
export async function listarPagamentos(filtros = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const response = await api.get(`/pagamentos?${params.toString()}`);
  return response.data;
}

/**
 * 🔍 Buscar pagamento por ID
 * @param {string} id - ID do pagamento
 * @returns {Promise<Object>} Dados do pagamento
 */
export async function buscarPagamento(id) {
  const response = await api.get(`/pagamentos/${id}`);
  return response.data;
}

/**
 * ➕ Criar novo pagamento
 * @param {Object} dados - Dados do pagamento
 * @returns {Promise<Object>} Pagamento criado
 */
export async function criarPagamento(dados) {
  const response = await api.post('/pagamentos', dados);
  return response.data;
}

/**
 * 💳 Criar checkout do Mercado Pago
 * @param {string} pagamentoId - ID do pagamento
 * @returns {Promise<Object>} Dados do checkout (URL, QR Code, etc.)
 */
export async function criarCheckout(pagamentoId) {
  const response = await api.post(`/pagamentos/${pagamentoId}/checkout`);
  return response.data;
}

/**
 * 📱 Criar pagamento PIX direto (recarga)
 * @param {Object} dados - { valor, descricao }
 * @returns {Promise<Object>} Dados do PIX (QR Code, etc.)
 */
export async function criarPagamentoPix(dados) {
  const response = await api.post('/pagamentos/pix/criar', dados);
  return response.data;
}

/**
 * 🔄 Consultar status de um pagamento
 * @param {string} pagamentoId - ID do pagamento
 * @returns {Promise<Object>} Status atualizado do pagamento
 */
export async function consultarStatusPagamento(pagamentoId) {
  const response = await api.get(`/pagamentos/${pagamentoId}/status`);
  return response.data;
}

/**
 * ⚙️ Verificar configuração do Mercado Pago
 * @returns {Promise<Object>} Status da configuração
 */
export async function verificarConfiguracao() {
  const response = await api.get('/pagamentos/config/verificar');
  return response.data;
}

/**
 * 💰 Processar recarga via PIX
 * @param {number} valor - Valor da recarga
 * @param {string} descricao - Descrição opcional
 * @returns {Promise<Object>} Dados do PIX para pagamento
 */
export async function processarRecargaPix(valor, descricao = 'Recarga de créditos') {
  if (!valor || valor <= 0) {
    throw new Error('Valor deve ser maior que zero');
  }

  try {
    const pagamento = await criarPagamentoPix({
      valor: parseFloat(valor),
      descricao
    });

    return {
      sucesso: true,
      pagamento: pagamento.pagamento,
      qr_code: pagamento.pagamento?.qr_code,
      qr_code_base64: pagamento.pagamento?.qr_code_base64,
      expiration_date: pagamento.pagamento?.expiration_date
    };
  } catch (error) {
    console.error('❌ Erro ao processar recarga PIX:', error);
    throw new Error(error.message || 'Erro ao processar recarga PIX');
  }
}

/**
 * 🔄 Monitorar status de pagamento PIX
 * @param {string} pagamentoId - ID do pagamento
 * @param {Function} callback - Função chamada quando status muda
 * @param {number} intervalo - Intervalo de verificação em ms (padrão: 3000)
 * @returns {Function} Função para parar o monitoramento
 */
export function monitorarPagamentoPix(pagamentoId, callback, intervalo = 3000) {
  let ativo = true;
  
  const verificar = async () => {
    if (!ativo) return;
    
    try {
      const status = await consultarStatusPagamento(pagamentoId);
      callback(status);
      
      // Parar monitoramento se pagamento foi finalizado
      if (['pago', 'falhou', 'cancelado', 'expirado'].includes(status.pagamento_local?.status)) {
        ativo = false;
        return;
      }
      
      // Continuar monitoramento
      if (ativo) {
        setTimeout(verificar, intervalo);
      }
    } catch (error) {
      console.error('❌ Erro ao monitorar pagamento:', error);
      callback({ erro: error.message });
      
      // Tentar novamente após intervalo maior em caso de erro
      if (ativo) {
        setTimeout(verificar, intervalo * 2);
      }
    }
  };
  
  // Iniciar monitoramento
  verificar();
  
  // Retornar função para parar
  return () => {
    ativo = false;
  };
}

/**
 * 💳 Obter histórico de pagamentos formatado
 * @param {Object} filtros - Filtros opcionais
 * @returns {Promise<Array>} Histórico formatado
 */
export async function obterHistoricoPagamentos(filtros = {}) {
  try {
    const dados = await listarPagamentos(filtros);
    
    return dados.pagamentos?.map(pagamento => ({
      id: pagamento.id,
      valor: parseFloat(pagamento.valor),
      status: pagamento.status,
      metodo: pagamento.metodo,
      descricao: pagamento.descricao,
      data: new Date(pagamento.createdAt),
      data_formatada: new Date(pagamento.createdAt).toLocaleString('pt-BR'),
      status_formatado: formatarStatusPagamento(pagamento.status)
    })) || [];
  } catch (error) {
    console.error('❌ Erro ao obter histórico:', error);
    return [];
  }
}

/**
 * 📊 Formatar status do pagamento para exibição
 * @param {string} status - Status do pagamento
 * @returns {Object} Status formatado com cor e texto
 */
export function formatarStatusPagamento(status) {
  const statusMap = {
    'pendente': { texto: 'Pendente', cor: 'warning', icone: '⏳' },
    'pago': { texto: 'Pago', cor: 'success', icone: '✅' },
    'falhou': { texto: 'Falhou', cor: 'error', icone: '❌' },
    'cancelado': { texto: 'Cancelado', cor: 'default', icone: '🚫' },
    'expirado': { texto: 'Expirado', cor: 'default', icone: '⏰' }
  };
  
  return statusMap[status] || { texto: status, cor: 'default', icone: '❓' };
}

/**
 * 💰 Formatar valor monetário
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado em R$
 */
export function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}
