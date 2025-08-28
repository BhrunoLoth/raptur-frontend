import React, { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"; // Usa variável de ambiente se houver

const QRCodeSimulator = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const simularLeitura = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const res = await fetch(`${API_URL}/validar/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: codigo }),
      });

      if (!res.ok) {
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.mensagem || "Erro ao validar QR");
      }

      const json = await res.json();
      setResultado(json);
    } catch (err) {
      setResultado({ status: "erro", mensagem: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={estilos.container}>
      <h2>🧪 Simulador de QR Code</h2>
      <input
        type="text"
        placeholder="Cole o código aqui"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        style={estilos.input}
        autoFocus
      />
      <button
        onClick={simularLeitura}
        style={estilos.button}
        disabled={!codigo.trim() || loading}
      >
        {loading ? "Validando..." : "Validar QR"}
      </button>

      {resultado && (
        <div
          style={{
            ...estilos.resultado,
            color:
              resultado.status === "ok"
                ? "#178f41"
                : resultado.status === "erro"
                ? "#c0392b"
                : "#333",
          }}
        >
          <strong>Status:</strong> {resultado.status} <br />
          <strong>Mensagem:</strong> {resultado.mensagem}
        </div>
      )}
    </div>
  );
};

const estilos = {
  container: {
    maxWidth: "480px",
    margin: "48px auto",
    padding: "24px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "11px 26px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "10px",
  },
  resultado: {
    marginTop: "24px",
    background: "#f8f8f8",
    padding: "14px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "1.1rem",
  },
};

export default QRCodeSimulator;
