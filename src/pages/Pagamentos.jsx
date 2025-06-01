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

  // Remover pagamento
  const removerPagamento = async (id) => {
    if (!window.confirm("Deseja remover este pagamento?")) return;
    try {
      await deletarPagamento(id);
      setPagamentos(pagamentos.filter((p) => p.id !== id));
    } catch (err) {
      setErro("Erro ao remover pagamento");
    }
  };

  // Editar status do pagamento
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
      <div className="dashboard-main-card">
        <h2>Gestão de Pagamentos</h2>
        {erro && <div style={{ color: "red" }}>{erro}</div>}
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Viagem</th>
                <th>Usuário</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", opacity: 0.7 }}>
                    Nenhum pagamento cadastrado
                  </td>
                </tr>
              ) : (
                pagamentos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.viagemId}</td>
                    <td>{p.usuarioId}</td>
                    <td>{p.valor}</td>
                    <td>{p.metodo}</td>
                    <td>
                      {editandoId === p.id ? (
                        <select
                          value={novoStatus}
                          onChange={(e) => setNovoStatus(e.target.value)}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Pago">Pago</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      ) : (
                        p.status
                      )}
                    </td>
                    <td>
                      {editandoId === p.id ? (
                        <>
                          <button onClick={() => salvarEdicao(p.id)}>Salvar</button>
                          <button onClick={() => setEditandoId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => iniciarEdicao(p.id, p.status)}>
                            Editar
                          </button>
                          <button
                            style={{ marginLeft: 8, color: "red" }}
                            onClick={() => removerPagamento(p.id)}
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