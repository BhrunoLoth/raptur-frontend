import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-raptur.png";

const Simulador = () => {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const valor = codigo.trim();

    if (!valor || valor.length < 6) {
      setErro("Insira um código válido com pelo menos 6 caracteres.");
      inputRef.current?.focus();
      return;
    }

    setErro("");
    navigate(`/validar/${valor}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-orange-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
        <img
          src={logo}
          alt="Logo Raptur"
          className="w-24 mx-auto mb-4"
        />
        <h2 className="text-xl md:text-2xl font-bold text-center text-green-800 mb-4">
          Simulador de QR Code 🧪
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Código do QR
            </label>
            <input
              id="codigo"
              name="codigo"
              className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
  );
};

export default Simulador;
