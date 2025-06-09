// src/pages/Simulador.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";

const Simulador = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!codigo.trim() || codigo.trim().length < 6) {
      setErro("Insira um código válido com pelo menos 6 caracteres.");
      inputRef.current?.focus();
      return;
    }

    setErro("");
    navigate(`/validar/${codigo.trim()}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-orange-100 px-4">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <img
            src={logo}
            alt="Logo Raptur"
            className="w-28 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-center text-green-800 mb-4">
            Simulador de QR Code 🧪
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Código do QR
              </label>
              <input
                id="codigo"
                name="codigo"
                className="w-full border p-2 rounded text-sm"
                placeholder="Cole o código do QR aqui..."
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                ref={inputRef}
                aria-label="Código do QR"
                autoFocus
              />
              {erro && <p className="text-red-600 text-sm mt-1">{erro}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              Validar Código
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Simulador;
