import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const EmbarqueManual = () => {
  const [usuarioId, setUsuarioId] = useState("");
  const [viagemId, setViagemId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const apiBase = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (!usuarioId || !viagemId || !veiculoId) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiBase}/embarques`,
        { usuarioId, viagemId, veiculoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem(response.data.mensagem || "✅ Embarque registrado com sucesso!");
      setUsuarioId("");
      setViagemId("");
      setVeiculoId("");
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.message ||
        "Erro ao registrar embarque.";
      setErro(`❌ ${msg}`);
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card max-w-lg mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">🚌 Registrar Embarque Manual</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block mb-1 font-medium">Usuário ID</label>
            <input
              type="text"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              placeholder="Ex: 101"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Viagem ID</label>
            <input
              type="text"
              value={viagemId}
              onChange={(e) => setViagemId(e.target.value)}
              placeholder="Ex: 202"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Veículo ID</label>
            <input
              type="text"
              value={veiculoId}
              onChange={(e) => setVeiculoId(e.target.value)}
              placeholder="Ex: 303"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white py-2 rounded"
          >
            🚀 Enviar
          </button>
        </form>

        {mensagem && (
          <div className="text-green-600 mt-4 bg-green-50 p-3 rounded">{mensagem}</div>
        )}
        {erro && (
          <div className="text-red-600 mt-4 bg-red-50 p-3 rounded">{erro}</div>
        )}
      </div>
    </Layout>
  );
};

export default EmbarqueManual;



