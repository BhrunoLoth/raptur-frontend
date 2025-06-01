import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { listarUsuarios, criarUsuario, deletarUsuario } from "../services/userService";

function exportarCSV(usuarios) {
  const header = ["Nome", "Email"];
  const rows = usuarios.map((u) => [u.nome, u.email]);
  let csvContent =
    "data:text/csv;charset=utf-8," +
    header.join(",") +
    "\n" +
    rows.map((e) => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "usuarios.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [subtipo_passageiro, setSubtipoPassageiro] = useState("");
  const [erro, setErro] = useState("");
  const nomeRef = useRef(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const lista = await listarUsuarios();
        setUsuarios(lista);
      } catch (err) {
        setErro("Erro ao carregar usuários");
      }
    }
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !tipo) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    try {
      const novo = await criarUsuario({
        nome,
        email,
        senha: "123456", // Ajuste conforme regra
        tipo,
        ...(tipo === "passageiro" && { subtipo_passageiro }),
      });

      setUsuarios([...usuarios, novo]);
      setNome("");
      setEmail("");
      setTipo("");
      setSubtipoPassageiro("");
      setErro("");
      nomeRef.current.focus();
    } catch (err) {
      setErro("Erro ao criar usuário");
    }
  };

  const removerUsuario = async (index) => {
    const usuario = usuarios[index];
    if (!window.confirm(`Remover usuário ${usuario.nome}?`)) return;
    try {
      await deletarUsuario(usuario.id);
      setUsuarios(usuarios.filter((_, i) => i !== index));
    } catch (err) {
      setErro("Erro ao remover usuário");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Usuários Cadastrados", 14, 16);
    doc.autoTable({
      startY: 22,
      head: [["Nome", "Email"]],
      body: usuarios.map((u) => [u.nome, u.email]),
    });
    doc.save("usuarios.pdf");
  };

  return (
    <Layout>
      <div className="dashboard-main-card user-card">
        <h2 className="user-title">👤 Gerenciar Usuários</h2>
        <div className="dashboard-section user-form-section">
          <form onSubmit={handleSubmit} className="user-form" autoComplete="off">
            <label htmlFor="nome" className="user-label">Nome</label>
            <input
              id="nome"
              className="user-input"
              placeholder="Digite o nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              ref={nomeRef}
              autoFocus
              aria-label="Nome"
            />

            <label htmlFor="email" className="user-label">Email</label>
            <input
              id="email"
              className="user-input"
              placeholder="Digite o e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              type="email"
            />

            <label htmlFor="tipo" className="user-label">Tipo de Usuário</label>
            <select
              id="tipo"
              className="user-input"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="admin">Admin</option>
              <option value="motorista">Motorista</option>
              <option value="passageiro">Passageiro</option>
            </select>

            {tipo === "passageiro" && (
              <>
                <label htmlFor="subtipo" className="user-label">Subtipo de Passageiro</label>
                <select
                  id="subtipo"
                  className="user-input"
                  value={subtipo_passageiro}
                  onChange={(e) => setSubtipoPassageiro(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="ALUNO_GRATUITO">Aluno com Gratuidade</option>
                  <option value="ALUNO_PAGANTE">Aluno Pagante</option>
                  <option value="IDOSO">Idoso</option>
                </select>
              </>
            )}

            {erro && <div className="user-error">{erro}</div>}
            <button className="action-btn user-create-btn" type="submit">
              <span>➕ Criar</span>
            </button>
          </form>
        </div>

        <div className="dashboard-section user-table-section">
          <div
            className="dashboard-label"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Usuários Cadastrados</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="export-btn"
                type="button"
                onClick={exportarPDF}
                aria-label="Exportar PDF"
              >
                <span style={{ marginRight: 4 }}>📄</span>PDF
              </button>
              <button
                className="export-btn"
                type="button"
                onClick={() => exportarCSV(usuarios)}
                aria-label="Exportar CSV"
              >
                <span style={{ marginRight: 4 }}>📑</span>CSV
              </button>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table user-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th style={{ textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", opacity: 0.7 }}>
                      Nenhum usuário cadastrado
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u, i) => (
                    <tr key={u.id || i}>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => removerUsuario(i)}
                          className="remove-btn"
                          aria-label={`Remover usuário ${u.nome}`}
                        >
                          Remover
                        </button>
                      </td>
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

export default UserManagement;
