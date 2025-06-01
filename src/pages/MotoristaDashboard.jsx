import React, { useState } from "react";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Função para exportar CSV
function exportarCSV(corridas) {
  const header = ["ID", "Passageiro", "Valor", "Data"];
  const rows = corridas.map(c => [c.id, c.passageiro, c.valor, c.data]);
  let csvContent = "data:text/csv;charset=utf-8," 
    + header.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "corridas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para exportar PDF
function exportarPDF(corridas) {
  const doc = new jsPDF();
  doc.text("Corridas Recentes", 14, 16);
  doc.autoTable({
    startY: 22,
    head: [["ID", "Passageiro", "Valor", "Data"]],
    body: corridas.map(c => [c.id, c.passageiro, c.valor, c.data]),
  });
  doc.save("corridas.pdf");
}

const MotoristaDashboard = () => {
  // Exemplo de dados
  const [corridas] = useState([
    { id: "c1a2b3", passageiro: "João Silva", valor: "R$ 35,00", data: "20/05/2025" },
    { id: "d4e5f6", passageiro: "Maria Souza", valor: "R$ 42,50", data: "21/05/2025" },
    { id: "g7h8i9", passageiro: "Carlos Lima", valor: "R$ 28,75", data: "22/05/2025" },
    { id: "j1k2l3", passageiro: "Ana Paula", valor: "R$ 50,00", data: "23/05/2025" },
  ]);
  const total = corridas.reduce((acc, c) => acc + Number(c.valor.replace(/[^\d,]/g, "").replace(",", ".")), 0);

  return (
    <Layout>
      <div className="dashboard-main-card">
        <h2 className="user-title">🚗 Painel do Motorista</h2>
        <div className="dashboard-section">
          <div className="dashboard-label" style={{ marginBottom: 10 }}>Total Recebido</div>
          <div className="dashboard-total" aria-label="Total recebido">
            {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
        </div>
        <div className="dashboard-section">
          <div className="dashboard-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span>Corridas Recentes</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="export-btn" type="button" onClick={() => exportarPDF(corridas)}>
                <span style={{ marginRight: 4 }}>📄</span>PDF
              </button>
              <button className="export-btn" type="button" onClick={() => exportarCSV(corridas)}>
                <span style={{ marginRight: 4 }}>📑</span>CSV
              </button>
            </div>
          </div>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Passageiro</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {corridas.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>Nenhuma corrida encontrada</td>
                  </tr>
                ) : (
                  corridas.map((c, i) => (
                    <tr key={i}>
                      <td>{c.id}</td>
                      <td>{c.passageiro}</td>
                      <td>{c.valor}</td>
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
};

export default MotoristaDashboard;



