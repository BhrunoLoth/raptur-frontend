import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  buscarEmbarques,
  criarEmbarque,
  atualizarEmbarque,
  deletarEmbarque,
} from "../services/embarqueService";

const Embarques = () => {
  const [embarques, setEmbarques] = useState([]);
  const [erro, setErro] = useState("");
  const [novo, setNovo] = useState({ viagemId: "", usuarioId: "", status: "", dataHora: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    async function fetchEmbarques() {
      try {
        const lista = await buscarEmbarques();
        setEmbarques(lista);
      } catch (err) {
        setErro("Erro ao carregar embarques");
      }
    }
    fetchEmbarques();
  }, []);

  const handleChange = (e) => {
    setNovo({ ...novo, [e.target.name]: e.target.value });
  };

  const handleCriar = async (e) => {
    e.preventDefault();
    try {
      const criado = await criarEmbarque(novo);
      setEmbarques([...embarques, criado]);
      setNovo({ viagemId: "", usuarioId: "", status: "", dataHora: "" });
    } catch {
      setErro("Erro ao criar embarque");
    }
  };

  const removerEmbarque = async (id) => {
    if (!window.confirm("Deseja remover este embarque?")) return;
    try {
      await deletarEmbarque(id);
      setEmbarques(embarques.filter((e) => e.id !== id));
    } catch {
      setErro("Erro ao remover embarque");
    }
  };

  const iniciarEdicao = (id, statusAtual) => {
    setEditandoId(id);
    setEditStatus(statusAtual);
  };

  const salvarEdicao = async (id) => {
    try {
      const atualizado = await atualizarEmbarque(id, { status: editStatus });
      setEmbarques(
        embarques.map((e) =>
          e.id === id ? { ...e, status: atualizado.status } : e
        )
      );
      setEditandoId(null);
      setEditStatus("");
    } catch {
      setErro("Erro ao atualizar embarque");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card">
        <h2>Gestão de Embarques</h2>
        {erro && <div style={{ color: "red" }}>{erro}</div>}
        <form onSubmit={handleCriar} style={{ marginBottom: 20 }}>
          <input
            name="viagemId"
            placeholder="Viagem ID"
            value={novo.viagemId}
            onChange={handleChange}
            required
          />
          <input
            name="usuarioId"
            placeholder="Usuário ID"
            value={novo.usuarioId}
            onChange={handleChange}
            required
          />
          <input
            name="status"
            placeholder="Status"
            value={novo.status}
            onChange={handleChange}
            required
          />
          <input
            name="dataHora"
            placeholder="Data e Hora"
            value={novo.dataHora}
            onChange={handleChange}
            required
            type="datetime-local"
          />
          <button type="submit">Criar</button>
        </form>
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Viagem</th>
                <th>Usuário</th>
                <th>Status</th>
                <th>Data/Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {embarques.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", opacity: 0.7 }}>
                    Nenhum embarque cadastrado
                  </td>
                </tr>
              ) : (
                embarques.map((e) => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.viagemId}</td>
                    <td>{e.usuarioId}</td>
                    <td>
                      {editandoId === e.id ? (
                        <input
                          value={editStatus}
                          onChange={(ev) => setEditStatus(ev.target.value)}
                        />
                      ) : (
                        e.status
                      )}
                    </td>
                    <td>{e.dataHora}</td>
                    <td>
                      {editandoId === e.id ? (
                        <>
                          <button onClick={() => salvarEdicao(e.id)}>Salvar</button>
                          <button onClick={() => setEditandoId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => iniciarEdicao(e.id, e.status)}>
                            Editar
                          </button>
                          <button
                            style={{ marginLeft: 8, color: "red" }}
                            onClick={() => removerEmbarque(e.id)}
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

export default Embarques;