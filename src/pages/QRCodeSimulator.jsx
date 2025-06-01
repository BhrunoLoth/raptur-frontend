import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";

const QRCodeSimulator = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  const validarCodigo = (e) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setErro("Insira um código válido.");
      inputRef.current.focus();
      return;
    }
    setErro("");
    alert(`Código validado com sucesso: ${codigo}`);
    setCodigo("");
    inputRef.current.focus();
  };

  return (
    <Layout>
      <div className="dashboard-main-card login-card" style={{ maxWidth: 420 }}>
        <img src={logo} alt="Logo Raptur" width={110} style={{ margin: "0 auto 10px auto", display: "block" }} />
        <h2 className="user-title" style={{ marginBottom: 18 }}>Simulador de QR Code ✏️</h2>
        <form className="login-form" onSubmit={validarCodigo} autoComplete="off">
          <label htmlFor="codigo" className="user-label">Código do QR</label>
          <input
            id="codigo"
            className="user-input"
            placeholder="Cole o código do QR aqui..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            ref={inputRef}
            aria-label="Código do QR"
            autoFocus
          />
          {erro && <div className="user-error">{erro}</div>}
          <button className="action-btn login-btn" type="submit">
            <span>✅ Validar Código</span>
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default QRCodeSimulator;
