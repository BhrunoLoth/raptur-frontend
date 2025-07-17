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
  const [novo, setNovo] = useState({
    viagemId: "",
    usuarioId: "",
    status: "pendente",
    dataHora: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    const fetchEmbarques = async () => {
      try {
        const lista = await buscarEmbarques();
        // Debug opcional para ver o que o backend retorna:
        // console.log("LISTA DE EMBARQUES:", lista);

        // Garante que sempre será array!
        setEmbarques(Array.isArray(lista) ? lista : []);
      } catch (err) {
        setErro("Erro ao carregar embarques");
        setEmbarques([]); // Segurança extra: evita erro no map!
      }
    };
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
      setNovo({ viagemId: "", usuarioId: "", status: "pendente", dataHora: "" });
      setErro("");
    } catch (err) {
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
      setErro("");
    } catch {
      setErro("Erro ao atualizar embarque");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card px-4 py-6 max-w-full">
        <h2 className="text-2xl font-bold mb-4">📦 Gestão de Embarques</h2>

        {erro && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleCriar} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            name="viagemId"
            placeholder="Viagem ID"
            value={novo.viagemId}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="usuarioId"
            placeholder="Usuário ID"
            value={novo.usuarioId}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <select
            name="status"
            value={novo.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <input
            name="dataHora"
            type="datetime-local"
            value={novo.dataHora}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="col-span-full sm:col-span-2 lg:col-span-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded"
          >
            ➕ Criar
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded shadow">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Viagem</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Status</th>
                <th className="p-3">Data/Hora</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(embarques) && embarques.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    Nenhum embarque cadastrado
                  </td>
                </tr>
              ) : (
                Array.isArray(embarques) && embarques.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3">{e.id}</td>
                    <td className="p-3">{e.viagemId}</td>
                    <td className="p-3">{e.usuarioId}</td>
                    <td className="p-3">
                      {editandoId === e.id ? (
                        <select
                          value={editStatus}
                          onChange={(ev) => setEditStatus(ev.target.value)}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      ) : (
                        <span className="font-medium">{e.status}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {new Date(e.dataHora).toLocaleString()}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {editandoId === e.id ? (
                        <>
                          <button
                            onClick={() => salvarEdicao(e.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => iniciarEdicao(e.id, e.status)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => removerEmbarque(e.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
