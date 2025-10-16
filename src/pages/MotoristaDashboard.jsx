// src/pages/MotoristaDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  iniciarJornada,
  encerrarJornada,
  buscarJornadaAtiva,
} from "../services/jornadaService";

const API_URL = import.meta.env.VITE_API_URL;

function exportarCSV(corridas) {
  const header = ["ID", "Passageiro", "Data"];
  const rows = corridas.map((c) => [c.id, c.passageiro, c.data]);
  const csv =
    "data:text/csv;charset=utf-8," +
    header.join(",") +
    "\n" +
    rows.map((r) => r.join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", "embarques.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportarPDF(corridas) {
  const doc = new jsPDF();
  doc.text("Embarques Recentes", 14, 16);
  doc.autoTable({
    startY: 22,
    head: [["ID", "Passageiro", "Data"]],
    body: corridas.map((c) => [c.id, c.passageiro, c.data]),
  });
  doc.save("embarques.pdf");
}

export default function MotoristaDashboard() {
  const [corridas, setCorridas] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mensagem, setMensagem] = useState("");
  const [jornadaAtiva, setJornadaAtiva] = useState(null);
  const [loadingJornada, setLoadingJornada] = useState(false);
  const motorista = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const fetchEmbarques = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/motorista/embarques`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCorridas(res.data);
      } catch (err) {
        console.error("Erro ao carregar embarques:", err);
        setMensagem("Erro ao carregar embarques.");
      }
    };

    if (isOnline) fetchEmbarques();
  }, [isOnline]);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  // Buscar jornada ativa ao carregar
  useEffect(() => {
    const fetchJornada = async () => {
      if (!motorista?.id) return;
      try {
        const data = await buscarJornadaAtiva(motorista.id);
        if (data?.jornada) setJornadaAtiva(data.jornada);
      } catch {
        setJornadaAtiva(null);
      }
    };
    fetchJornada();
  }, [motorista]);

  const handleIniciarJornada = async () => {
    if (!motorista?.id) return alert("Erro: motorista inválido");
    const onibusId = prompt("Informe o ID do ônibus:");
    if (!onibusId) return;

    setLoadingJornada(true);
    try {
      const data = await iniciarJornada(motorista.id, onibusId);
      setJornadaAtiva(data.jornada);
      alert("🚀 Jornada iniciada com sucesso!");
    } catch (err) {
      alert(err?.erro || "Erro ao iniciar jornada.");
    } finally {
      setLoadingJornada(false);
    }
  };

  const handleEncerrarJornada = async () => {
    if (!jornadaAtiva?.id) return alert("Nenhuma jornada ativa.");
    setLoadingJornada(true);
    try {
      await encerrarJornada(jornadaAtiva.id);
      setJornadaAtiva(null);
      alert("✅ Jornada encerrada com sucesso!");
    } catch (err) {
      alert(err?.erro || "Erro ao encerrar jornada.");
    } finally {
      setLoadingJornada(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/motorista/login";
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🧑‍✈️ Painel do Motorista</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {/* Status */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-sm">
          <strong>Status da conexão:</strong>{" "}
          <span className={isOnline ? "text-green-600" : "text-yellow-600"}>
            {isOnline ? "Online 🌐" : "Offline 🛰️"}
          </span>
        </p>
        <p className="mt-2 text-sm">
          <strong>Jornada:</strong>{" "}
          {jornadaAtiva ? (
            <span className="text-green-700">
              Ativa desde {new Date(jornadaAtiva.inicio).toLocaleString()}
            </span>
          ) : (
            <span className="text-gray-600">Nenhuma jornada ativa</span>
          )}
        </p>

        {/* Botões de Jornada */}
        <div className="mt-4 flex gap-3">
          {!jornadaAtiva ? (
            <button
              onClick={handleIniciarJornada}
              disabled={loadingJornada}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🚀 Iniciar Jornada
            </button>
          ) : (
            <button
              onClick={handleEncerrarJornada}
              disabled={loadingJornada}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              🛑 Encerrar Jornada
            </button>
          )}
        </div>
      </div>

      {/* Lista de embarques */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <span className="text-lg font-semibold">Embarques Recentes</span>
          <div className="flex gap-2">
            <button
              className="export-btn"
              onClick={() => exportarPDF(corridas)}
            >
              📄 PDF
            </button>
            <button
              className="export-btn"
              onClick={() => exportarCSV(corridas)}
            >
              📑 CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Passageiro
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {corridas.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-gray-500"
                  >
                    Nenhum embarque encontrado
                  </td>
                </tr>
              ) : (
                corridas.map((c, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm text-gray-800">{c.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {c.passageiro}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {c.data}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
