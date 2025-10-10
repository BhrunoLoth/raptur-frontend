// src/pages/CarteirinhaView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { buscarIdoso } from "../services/idosoService";
import IdosoCard from "../components/IdosoCard";
import "../styles/carteirinha.css";
import "../styles/formulario.css"; // reaproveita botões e cores do painel

export default function CarteirinhaView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idoso, setIdoso] = useState(null);
  const [status, setStatus] = useState("verificando");
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await buscarIdoso(id);
        if (!data) throw new Error("Idoso não encontrado.");

        // 🔹 Validação de validade
        const hoje = new Date();
        const validade = new Date(data.dataValidade);
        const ativo = validade >= hoje;

        setStatus(ativo ? "ativo" : "expirado");
        setIdoso(data);
      } catch (e) {
        console.error(e);
        setErro("Erro ao validar a carteirinha.");
        setStatus("erro");
      }
    })();
  }, [id]);

  // 🔹 Estados de carregamento/erro
  if (status === "verificando") {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#136c3a",
          fontWeight: 500,
        }}
      >
        Verificando carteirinha...
      </div>
    );
  }

  if (erro || !idoso) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "red",
          fontWeight: "600",
        }}
      >
        {erro || "Carteirinha inválida."}
        <div style={{ marginTop: "16px" }}>
          <button className="btn-voltar" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </div>
    );
  }

  // 🔹 Layout principal
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8f9f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#136c3a",
          marginBottom: "12px",
          fontSize: "1.6rem",
          fontWeight: "700",
        }}
      >
        Validação de Carteirinha Raptur
      </h1>

      {/* 🔸 Status visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {status === "ativo" ? (
          <>
            <CheckCircle color="#136c3a" size={28} />
            <span style={{ color: "#136c3a", fontWeight: "600" }}>
              Carteirinha VÁLIDA
            </span>
          </>
        ) : (
          <>
            <XCircle color="#e53935" size={28} />
            <span style={{ color: "#e53935", fontWeight: "600" }}>
              Carteirinha EXPIRADA
            </span>
          </>
        )}
      </div>

      {/* 🔸 Exibição visual da carteirinha */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <IdosoCard idoso={idoso} />
      </div>

      {/* 🔸 Informações complementares */}
      <div
        style={{
          maxWidth: "480px",
          textAlign: "center",
          background: "white",
          padding: "16px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ marginBottom: "6px" }}>
          <strong>Nome:</strong> {idoso.nome}
        </p>
        <p style={{ marginBottom: "6px" }}>
          <strong>CPF:</strong> {idoso.cpf}
        </p>
        <p style={{ marginBottom: "6px" }}>
          <strong>Número da Carteira:</strong> {idoso.numeroCarteira}
        </p>
        <p style={{ marginBottom: "6px" }}>
          <strong>Data de Emissão:</strong>{" "}
          {idoso.dataEmissao
            ? new Date(idoso.dataEmissao).toLocaleDateString("pt-BR")
            : "-"}
        </p>
        <p>
          <strong>Validade:</strong>{" "}
          {idoso.dataValidade
            ? new Date(idoso.dataValidade).toLocaleDateString("pt-BR")
            : "-"}
        </p>
      </div>

      {/* 🔸 Voltar */}
      <div style={{ marginTop: "20px" }}>
        <button className="btn-voltar" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <footer
        style={{
          marginTop: "40px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} Raptur — Sistema de Carteirinha do Idoso
      </footer>
    </div>
  );
}
