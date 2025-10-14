// src/pages/IdososView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { buscarIdoso } from "../services/idosoService";
import IdosoCard from "../components/IdosoCard";
import "../styles/carteirinha.css";
import "../styles/formulario.css"; // 🔹 Para reaproveitar estilos de botão e layout

const API = import.meta.env.VITE_API_URL;

export default function IdososView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idoso, setIdoso] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega dados do idoso
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await buscarIdoso(id);
        setIdoso(data);
        setErro("");
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar dados do idoso");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 🔹 Função para abrir o PDF autenticado
  const abrirPdf = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada! Faça login novamente.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/idosos/${id}/carteirinha.pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao gerar PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
    } catch (error) {
      console.error(error);
      alert("Erro ao abrir a carteirinha em PDF");
    }
  };

  // 🔹 Estados de carregamento/erro
  if (loading)
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontWeight: "500",
          color: "#136c3a",
        }}
      >
        Carregando carteirinha...
      </div>
    );

  if (erro || !idoso)
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "red",
          fontWeight: "600",
        }}
      >
        {erro || "Idoso não encontrado."}
      </div>
    );

  // 🔹 Layout final da página
  return (
    <div style={{ padding: "16px" }}>
      {/* 🔸 Botões superiores */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <button className="btn-voltar" onClick={() => navigate("/admin/idosos")}>
          <ArrowLeft size={16} /> Voltar
        </button>

        <button className="btn-imprimir" onClick={abrirPdf}>
          <Printer size={16} /> Abrir PDF
        </button>
      </div>

      {/* 🔸 Exibição da carteirinha */}
      <div
        className="carteirinha-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <IdosoCard idoso={idoso} />
      </div>
    </div>
  );
}
