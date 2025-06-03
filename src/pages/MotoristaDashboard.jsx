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
    iniciarSincronizacaoAutomatica(); // 🧠 Roda a cada 30s
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/motorista/embarques", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCorridas(res.data);
      } catch (err) {
        console.error("❌ Erro ao carregar embarques:", err);
        setMensagem("Erro ao carregar embarques.");
      }
    };

    if (isOnline) {
      fetchData();
    }
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
      <div className="dashboard-main-card">
        <h2 className="user-title">🧑‍✈️ Painel do Motorista</h2>

        <div className="dashboard-section" style={{ marginBottom: 16 }}>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: isOnline ? "green" : "orange" }}>
              {isOnline ? "Online 🌐" : "Offline 🛰️"}
            </span>
          </p>
          <button onClick={handleSync} className="action-btn" style={{ marginTop: 6 }}>
            🔄 Sincronizar Embarques
          </button>
          {mensagem && <p style={{ marginTop: 8 }}>{mensagem}</p>}
        </div>

        <div className="dashboard-section">
          <ScannerQRCode />
        </div>

        <div className="dashboard-section" style={{ marginTop: 20 }}>
          <div
            className="dashboard-label"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Embarques Recentes</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="export-btn" onClick={() => exportarPDF(corridas)}>
                📄 PDF
              </button>
              <button className="export-btn" onClick={() => exportarCSV(corridas)}>
                📑 CSV
              </button>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Passageiro</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {corridas.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", opacity: 0.7 }}>
                      Nenhum embarque encontrado
                    </td>
                  </tr>
                ) : (
                  corridas.map((c, i) => (
                    <tr key={i}>
                      <td>{c.id}</td>
                      <td>{c.passageiro}</td>
                      <td>{c.data}</td>
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



