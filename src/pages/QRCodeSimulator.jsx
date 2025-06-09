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
    alert(`✅ Código validado com sucesso: ${codigo}`);
    setCodigo("");
    inputRef.current.focus();
  };

  return (
    <Layout>
      <div className="max-w-sm mx-auto bg-white p-6 rounded shadow mt-10">
        <img
          src={logo}
          alt="Logo Raptur"
          className="mx-auto mb-4"
          width={100}
        />
        <h2 className="text-xl font-bold text-center mb-4">
          Simulador de QR Code ✏️
        </h2>
        <form onSubmit={validarCodigo} className="grid gap-4" autoComplete="off">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium mb-1">
              Código do QR
            </label>
            <input
              id="codigo"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholder="Cole o código do QR aqui..."
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              ref={inputRef}
              aria-label="Código do QR"
              autoFocus
            />
            {erro && (
              <div className="text-red-600 text-sm mt-1">{erro}</div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white py-2 rounded"
          >
            ✅ Validar Código
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default QRCodeSimulator;
