import React, { useState } from "react";

const QRCodeSimulator = () => {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);

  const simularLeitura = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/validar/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: codigo }),
      });

      const json = await res.json();
      setResultado(json);
    } catch (err) {
      console.error("Erro na validação:", err);
      setResultado({ status: "erro", mensagem: "Erro ao validar QR" });
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
      />
      <button onClick={simularLeitura} style={estilos.button}>
        Validar QR
      </button>

      {resultado && (
        <div style={estilos.resultado}>
          <strong>Status:</strong> {resultado.status} <br />
          <strong>Mensagem:</strong> {resultado.mensagem}
        </div>
      )}
    </div>
  );
};

const estilos = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 18px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  resultado: {
    marginTop: "20px",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "6px",
  },
};

export default QRCodeSimulator;
