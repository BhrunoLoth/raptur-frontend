import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const EmbarqueManual = () => {
  const [usuarioId, setUsuarioId] = useState("");
  const [viagemId, setViagemId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const token = localStorage.getItem("token"); // ou onde estiver salvo

      const response = await axios.post(
        "/api/embarques",
        { usuarioId, viagemId, veiculoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem(response.data.mensagem || "Embarque realizado com sucesso!");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao registrar embarque.");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card user-card">
        <h2>🚌 Registrar Embarque Manual</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <label>Usuário ID:</label>
          <input value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} />

          <label>Viagem ID:</label>
          <input value={viagemId} onChange={(e) => setViagemId(e.target.value)} />

          <label>Veículo ID:</label>
          <input value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} />

          <button type="submit" className="action-btn user-create-btn">🚀 Enviar</button>
        </form>

        {mensagem && <div style={{ color: "green", marginTop: 12 }}>{mensagem}</div>}
        {erro && <div style={{ color: "red", marginTop: 12 }}>{erro}</div>}
      </div>
    </Layout>
  );
};

export default EmbarqueManual;
