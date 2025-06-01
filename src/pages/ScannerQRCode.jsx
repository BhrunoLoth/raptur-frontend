import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";

const ScannerQRCode = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  // Simulação de leitura de QR Code
  const handleScan = (e) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setErro("Aponte a câmera para um QR Code ou cole o código.");
      inputRef.current.focus();
      return;
    }
    setErro("");
    alert(`QR Code lido com sucesso: ${codigo}`);
    setCodigo("");
    inputRef.current.focus();
  };

  return (
    <Layout>
      <div className="dashboard-main-card login-card" style={{ maxWidth: 420 }}>
        <img src={logo} alt="Logo Raptur" width={110} style={{ margin: "0 auto 10px auto", display: "block" }} />
        <h2 className="user-title" style={{ marginBottom: 18 }}>Scanner de QR Code 📷</h2>
        <form className="login-form" onSubmit={handleScan} autoComplete="off">
          <label htmlFor="codigo" className="user-label">Código do QR</label>
          <input
            id="codigo"
            className="user-input"
            placeholder="Aponte a câmera ou cole o código do QR aqui..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            ref={inputRef}
            aria-label="Código do QR"
            autoFocus
          />
          {erro && <div className="user-error">{erro}</div>}
          <button className="action-btn login-btn" type="submit">
            <span>📡 Ler QR Code</span>
          </button>
        </form>
        {/* Dica para integração real */}
        <div style={{ marginTop: 18, fontSize: "0.97rem", color: "#888", textAlign: "center" }}>
          Para leitura automática, integre uma biblioteca como <b>react-qr-reader</b>.
        </div>
      </div>
    </Layout>
  );
};

export default ScannerQRCode;