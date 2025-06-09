import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  buscarPagamentos,
  deletarPagamento,
  atualizarPagamento,
} from "../services/paymentService";

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  useEffect(() => {
    async function fetchPagamentos() {
      try {
        const lista = await buscarPagamentos();
        setPagamentos(lista);
      } catch (err) {
        setErro("Erro ao carregar pagamentos");
      }
    }
    fetchPagamentos();
  }, []);

  const removerPagamento = async (id) => {
    if (!window.confirm("Deseja remover este pagamento?")) return;
    try {
      await deletarPagamento(id);
      setPagamentos(pagamentos.filter((p) => p.id !== id));
    } catch (err) {
      setErro("Erro ao remover pagamento");
    }
  };

  const iniciarEdicao = (id, statusAtual) => {
    setEditandoId(id);
    setNovoStatus(statusAtual);
  };

  const salvarEdicao = async (id) => {
    try {
      const atualizado = await atualizarPagamento(id, { status: novoStatus });
      setPagamentos(
        pagamentos.map((p) =>
          p.id === id ? { ...p, status: atualizado.status } : p
        )
      );
      setEditandoId(null);
      setNovoStatus("");
    } catch (err) {
      setErro("Erro ao atualizar pagamento");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card px-4 py-6 max-w-full overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">💳 Gestão de Pagamentos</h2>

        {erro && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
            {erro}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded shadow">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Viagem</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Método</th>
                <th className="p-3">Status</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    Nenhum pagamento cadastrado
                  </td>
                </tr>
              ) : (
                pagamentos.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.viagemId}</td>
                    <td className="p-3">{p.usuarioId}</td>
                    <td className="p-3">R$ {p.valor}</td>
                    <td className="p-3">{p.metodo}</td>
                    <td className="p-3">
                      {editandoId === p.id ? (
                        <select
                          value={novoStatus}
                          onChange={(e) => setNovoStatus(e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Pago">Pago</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      ) : (
                        <span className="font-medium">{p.status}</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {editandoId === p.id ? (
                        <>
                          <button
                            onClick={() => salvarEdicao(p.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => iniciarEdicao(p.id, p.status)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => removerPagamento(p.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Remover
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Pagamentos;
