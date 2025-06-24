import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ScannerQRCode from "./ScannerQRCode";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import {
  sincronizarEmbarques,
  iniciarSincronizacaoAutomatica
} from "../services/syncService";

const API_URL = import.meta.env.VITE_API_URL;

function exportarCSV(corridas) {
  const header = ["ID", "Passageiro", "Data"];
  const rows = corridas.map((c) => [c.id, c.passageiro, c.data]);
  const csv = "data:text/csv;charset=utf-8," +
    header.join(",") + "\n" +
    rows.map(r => r.join(",")).join("\n");
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

  useEffect(() => {
    iniciarSincronizacaoAutomatica();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/motorista/embarques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCorridas(res.data);
      } catch (err) {
        console.error("Erro ao carregar embarques:", err);
        setMensagem("Erro ao carregar embarques.");
      }
    };

    if (isOnline) fetchData();
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

  const handleSync = async () => {
    const msg = await sincronizarEmbarques();
    setMensagem(msg);
  };

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🧑‍✈️ Painel do Motorista</h2>

        <div className="bg-white p-4 rounded shadow mb-4">
          <p className="text-sm">
            <strong>Status:</strong>{" "}
            <span className={isOnline ? "text-green-600" : "text-yellow-600"}>
              {isOnline ? "Online 🌐" : "Offline 🛰️"}
            </span>
          </p>
          <button
            onClick={handleSync}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Sincronizar Embarques
          </button>
          {mensagem && <p className="mt-2 text-sm text-gray-700">{mensagem}</p>}
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <ScannerQRCode />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <span className="text-lg font-semibold">Embarques Recentes</span>
            <div className="flex gap-2">
              <button className="export-btn" onClick={() => exportarPDF(corridas)}>
                📄 PDF
              </button>
              <button className="export-btn" onClick={() => exportarCSV(corridas)}>
                📑 CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Passageiro</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {corridas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      Nenhum embarque encontrado
                    </td>
                  </tr>
                ) : (
                  corridas.map((c, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 text-sm text-gray-800">{c.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{c.passageiro}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{c.data}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

