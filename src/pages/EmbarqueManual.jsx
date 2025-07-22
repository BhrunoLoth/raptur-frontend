import React, { useState, useRef } from "react";
import axios from "axios";
import ProtectedLayout from "../components/ProtectedLayout";

const EmbarqueManual = () => {
  const [usuarioId, setUsuarioId] = useState("");
  const [viagemId, setViagemId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const userRef = useRef(null);

  const apiBase = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const limparCampos = () => {
    setUsuarioId("");
    setViagemId("");
    setVeiculoId("");
    userRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setLoading(true);

    if (!usuarioId || !viagemId || !veiculoId) {
      setErro("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiBase}/embarques`,
        { usuarioId: Number(usuarioId), viagemId: Number(viagemId), veiculoId: Number(veiculoId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensagem(response.data.mensagem || "✅ Embarque registrado com sucesso!");
      limparCampos();
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.message ||
        "Erro ao registrar embarque.";
      setErro(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Limpa mensagem de sucesso ao alterar qualquer campo
  const onChangeField = (setter) => (e) => {
    setter(e.target.value.replace(/[^0-9]/g, "")); // apenas números
    if (mensagem) setMensagem("");
    if (erro) setErro("");
  };

  return (
    <ProtectedLayout>
      <div className="dashboard-main-card max-w-lg mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">🚌 Registrar Embarque Manual</h2>
        <form onSubmit={handleSubmit} className="grid gap-4" autoComplete="off">
          <div>
            <label className="block mb-1 font-medium">Usuário ID</label>
            <input
              type="text"
              value={usuarioId}
              onChange={onChangeField(setUsuarioId)}
              placeholder="Ex: 101"
              required
              className="w-full border px-3 py-2 rounded"
              inputMode="numeric"
              ref={userRef}
              autoFocus
              maxLength={8}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Viagem ID</label>
            <input
              type="text"
              value={viagemId}
              onChange={onChangeField(setViagemId)}
              placeholder="Ex: 202"
              required
              className="w-full border px-3 py-2 rounded"
              inputMode="numeric"
              maxLength={8}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Veículo ID</label>
            <input
              type="text"
              value={veiculoId}
              onChange={onChangeField(setVeiculoId)}
              placeholder="Ex: 303"
              required
              className="w-full border px-3 py-2 rounded"
              inputMode="numeric"
              maxLength={8}
            />
          </div>

          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Enviando..." : "🚀 Enviar"}
          </button>
        </form>

        {mensagem && (
          <div className="text-green-700 mt-4 bg-green-50 p-3 rounded border border-green-300 text-center font-medium">
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="text-red-700 mt-4 bg-red-50 p-3 rounded border border-red-300 text-center font-medium">
            {erro}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default EmbarqueManual;
