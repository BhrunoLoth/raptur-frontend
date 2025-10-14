// src/services/pagamentoService.js
// Serviço único e padronizado (axios). Não usa fetch. Sem funções duplicadas.

import api from './api';

/* ======================= Helpers ======================= */

// Garante que sempre retornamos um ARRAY de pagamentos, independente do shape
function asArrayPagamentos(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.pagamentos)) return payload.pagamentos;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows; // sequelize findAndCountAll
  return [];
}

// Formata status para UI
export function formatarStatusPagamento(status) {
  const map = {
    pendente:  { texto: 'Pendente',  cor: 'warning', icone: '⏳' },
    pago:      { texto: 'Pago',      cor: 'success', icone: '✅' },
    falhou:    { texto: 'Falhou',    cor: 'error',   icone: '❌' },
    cancelado: { texto: 'Cancelado', cor: 'default', icone: '🚫' },
    expirado:  { texto: 'Expirado',  cor: 'default', icone: '⏰' },
  };
  return map[status] || { texto: status || '—', cor: 'default', icone: '❓' };
}

export function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(valor || 0));
}

/* ======================= Listagem / Leitura ======================= */

/**
 * Lista pagamentos com filtros. Retorna { lista, total, raw }
 * `lista` é SEMPRE um array.
 */
export async function listarPagamentos(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });

  const { data } = await api.get(`/pagamentos?${params.toString()}`);
  const lista = asArrayPagamentos(data);

  // tenta extrair "total" das formas mais comuns
  const total =
    Number(data?.total ?? data?.count ?? lista.length ?? 0);

  return { lista, total, raw: data };
}

export async function buscarPagamento(id) {
  const { data } = await api.get(`/pagamentos/${id}`);
  return data;
}

/* ======================= Criação / Atualização ======================= */

export async function criarPagamento(dados) {
  const { data } = await api.post('/pagamentos', dados);
  return data;
}

export async function atualizarPagamento(id, dados) {
  const { data } = await api.put(`/pagamentos/${id}`, dados);
  return data;
}

export async function deletarPagamento(id) {
  await api.delete(`/pagamentos/${id}`);
  return true;
}

/* ======================= Mercado Pago / PIX ======================= */

export async function criarCheckout(pagamentoId) {
  const { data } = await api.post(`/pagamentos/${pagamentoId}/checkout`);
  return data; // ex: { init_point, qr_code, ... }
}

export async function criarPagamentoPix(dados) {
  const { data } = await api.post('/pagamentos/pix/criar', dados);
  return data; // ex: { pagamento: { qr_code, qr_code_base64, expiration_date, ... } }
}

export async function consultarStatusPagamento(pagamentoId) {
  const { data } = await api.get(`/pagamentos/${pagamentoId}/status`);
  return data; // ex: { pagamento_local: { status, ... }, ... }
}

export async function verificarConfiguracao() {
  const { data } = await api.get('/pagamentos/config/verificar');
  return data;
}

/**
 * Fluxo de recarga PIX com validação de valor.
 * Retorna campos úteis já “achatados” para a UI.
 */
export async function processarRecargaPix(valor, descricao = 'Recarga de créditos') {
  const v = Number(valor);
  if (!v || v <= 0) throw new Error('Valor deve ser maior que zero');

  try {
    const resp = await criarPagamentoPix({ valor: v, descricao });
    const p = resp?.pagamento || {};

    return {
      sucesso: true,
      pagamento: resp?.pagamento,
      qr_code: p.qr_code,
      qr_code_base64: p.qr_code_base64,
      expiration_date: p.expiration_date,
    };
  } catch (err) {
    console.error('❌ Erro ao processar recarga PIX:', err);
    throw new Error(err?.message || 'Erro ao processar recarga PIX');
  }
}

/**
 * Polling simples para acompanhar um pagamento PIX.
 * Retorna uma função para parar o monitoramento.
 */
export function monitorarPagamentoPix(pagamentoId, callback, intervalo = 3000) {
  let ativo = true;

  const tick = async () => {
    if (!ativo) return;
    try {
      const status = await consultarStatusPagamento(pagamentoId);
      callback(status);

      const s = status?.pagamento_local?.status;
      if (['pago', 'falhou', 'cancelado', 'expirado'].includes(s)) {
        ativo = false;
        return;
      }
      if (ativo) setTimeout(tick, intervalo);
    } catch (err) {
      console.error('❌ Erro ao monitorar pagamento:', err);
      callback({ erro: err?.message || String(err) });
      if (ativo) setTimeout(tick, intervalo * 2);
    }
  };

  // inicia
  tick();
  return () => { ativo = false; };
}

/* ======================= Histórico pronto p/ UI ======================= */

export async function obterHistoricoPagamentos(filtros = {}) {
  try {
    const { lista } = await listarPagamentos(filtros);
    return lista.map((p) => {
      const created = p?.createdAt ? new Date(p.createdAt) : null;
      return {
        id: p?.id,
        valor: Number(p?.valor || 0),
        valor_formatado: formatarValor(p?.valor),
        status: p?.status,
        status_formatado: formatarStatusPagamento(p?.status),
        metodo: p?.metodo,
        descricao: p?.descricao,
        data: created,
        data_formatada: created ? created.toLocaleString('pt-BR') : '—',
      };
    });
  } catch (err) {
    console.error('❌ Erro ao obter histórico:', err);
    return [];
  }
}
