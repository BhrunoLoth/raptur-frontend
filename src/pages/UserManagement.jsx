import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  listarUsuarios,
  criarUsuario,
  deletarUsuario
} from "../services/userService";

function exportarCSV(usuarios) {
  const header = ["Nome", "Email", "Perfil"];
  const rows = usuarios.map((u) => [u.nome, u.email, u.perfil]);
  const csv =
    "data:text/csv;charset=utf-8," +
    header.join(",") +
    "\n" +
    rows.map((e) => e.join(",")).join("\n");
  const encoded = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", encoded);
  link.setAttribute("download", "usuarios.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportarPDF(usuarios) {
  const doc = new jsPDF();
  doc.text("Usuários Cadastrados", 14, 16);
  doc.autoTable({
    startY: 22,
    head: [["Nome", "Email", "Perfil"]],
    body: usuarios.map((u) => [u.nome, u.email, u.perfil]),
  });
  doc.save("usuarios.pdf");
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [subtipo_passageiro, setSubtipoPassageiro] = useState("");
  const [erro, setErro] = useState("");
  const nomeRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const lista = await listarUsuarios();
        setUsuarios(lista);
      } catch {
        setErro("Erro ao carregar usuários.");
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !perfil) {
      return setErro("Preencha todos os campos obrigatórios.");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return setErro("Digite um e-mail válido.");
    }

    try {
      const formData = {
        nome,
        email,
        senha: "123456", // senha padrão ou lógica de geração segura
        perfil,
      };

      if (perfil === "passageiro") {
        formData.subtipo_passageiro = subtipo_passageiro;
        formData.saldo_credito = 0;
      }

      const novo = await criarUsuario(formData);
      setUsuarios([...usuarios, novo]);

      setNome("");
      setEmail("");
      setPerfil("");
      setSubtipoPassageiro("");
      nomeRef.current?.focus();
    } catch {
      setErro("Erro ao criar usuário.");
    }
  };

  const removerUsuario = async (index) => {
    const usuario = usuarios[index];
    if (!window.confirm(`Remover ${usuario.nome}?`)) return;

    try {
      await deletarUsuario(usuario.id);
      setUsuarios(usuarios.filter((_, i) => i !== index));
    } catch {
      setErro("Erro ao remover usuário.");
    }
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
            />

            <label htmlFor="email" className="user-label">Email</label>
            <input
              id="email"
              className="user-input"
              placeholder="Digite o e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />

            <label htmlFor="perfil" className="user-label">Perfil</label>
            <select
              id="perfil"
              className="user-input"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="admin">Admin</option>
              <option value="motorista">Motorista</option>
              <option value="passageiro">Passageiro</option>
            </select>

            {perfil === "passageiro" && (
              <>
                <label htmlFor="subtipo" className="user-label">Subtipo Passageiro</label>
                <select
                  id="subtipo"
                  className="user-input"
                  value={subtipo_passageiro}
                  onChange={(e) => setSubtipoPassageiro(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="aluno_gratuito">Aluno com Gratuidade</option>
                  <option value="aluno_pagante">Aluno Pagante</option>
                  <option value="idoso">Idoso</option>
                </select>
              </>
            )}

            {erro && <div className="user-error">{erro}</div>}

            <button className="action-btn user-create-btn" type="submit">
              ➕ Criar
            </button>
          </form>
        </div>

        <div className="dashboard-section user-table-section">
          <div className="dashboard-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Usuários Cadastrados</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="export-btn" onClick={() => exportarPDF(usuarios)}>📄 PDF</button>
              <button className="export-btn" onClick={() => exportarCSV(usuarios)}>📑 CSV</button>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table user-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th style={{ textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                      Nenhum usuário cadastrado
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u, i) => (
                    <tr key={u.id || i}>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>{u.perfil}</td>
                      <td style={{ textAlign: "center" }}>
                        <button className="remove-btn" onClick={() => removerUsuario(i)}>
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

