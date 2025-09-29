// src/services/paymentService.js
// ⚠️ Módulo de compatibilidade temporário.
// Padronize novos imports para: `import { ... } from './pagamentoService'`.
// Este arquivo mantém os nomes antigos em uso no projeto
// e redireciona para o novo serviço unificado `pagamentoService`.

import api from './api';
import {
  // novos nomes/exportações oficiais
  listarPagamentos,
  buscarPagamento,
  criarPagamento,
  criarCheckout,
  criarPagamentoPix,
  consultarStatusPagamento,
  verificarConfiguracao,
  processarRecargaPix,
  monitorarPagamentoPix,
  obterHistoricoPagamentos,
  formatarStatusPagamento,
  formatarValor,
} from './pagamentoService';

// Reexporta tudo do serviço novo (para quem já migrou os imports)
export * from './pagamentoService';

/**
 * 🔁 Alias antigo: buscarPagamentos()
 * Use o novo nome `listarPagamentos(filtros)`.
 * Shim de compatibilidade: garante que retorne um ARRAY para telas antigas.
 * Ex.: se a API devolver `{ pagamentos: [...] }`, retornamos só `[...]`.
 */
export async function buscarPagamentos(filtros = {}) {
  const data = await listarPagamentos(filtros);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.pagamentos)) return data.pagamentos;
  return [];
}

/**
 * 🔁 Alias antigo: buscarPagamentoPorId(id)
 * Use o novo nome `buscarPagamento(id)`.
 */
export async function buscarPagamentoPorId(id) {
  return buscarPagamento(id);
}

/**
 * 🔁 Alias antigo: criarPagamento(dados)
 * Mantém o mesmo nome e assinatura (mapeia para o serviço novo).
 */
export { criarPagamento };

/**
 * 🔁 Alias antigo: atualizarPagamento(id, dados)
 * Não havia função equivalente no serviço novo; mantém via `api`.
 */
export async function atualizarPagamento(id, dados) {
  const { data } = await api.put(`/pagamentos/${id}`, dados);
  return data;
}

/**
 * 🔁 Alias antigo: deletarPagamento(id)
 * Não havia função equivalente no serviço novo; mantém via `api`.
 */
export async function deletarPagamento(id) {
  const { data } = await api.delete(`/pagamentos/${id}`);
  return data;
}

// Também expõe as helpers novas pelo nome atual (caso alguém importe deste arquivo)
export {
  criarCheckout,
  criarPagamentoPix,
  consultarStatusPagamento,
  verificarConfiguracao,
  processarRecargaPix,
  monitorarPagamentoPix,
  obterHistoricoPagamentos,
  formatarStatusPagamento,
  formatarValor,
};
