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
  const header = ["Nome", "Email", "CPF", "RG", "Perfil"];
  const rows = usuarios.map((u) => [u.nome, u.email, u.cpf, u.rg, u.perfil]);
  const csv =
    "data:text/csv;charset=utf-8," +
    header.join(",") + "\n" +
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
    head: [["Nome", "Email", "CPF", "RG", "Perfil"]],
    body: usuarios.map((u) => [u.nome, u.email, u.cpf, u.rg, u.perfil]),
  });
  doc.save("usuarios.pdf");
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [perfil, setPerfil] = useState("");
  const [subtipo_passageiro, setSubtipoPassageiro] = useState("");
  const [erro, setErro] = useState("");
  const nomeRef = useRef(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const lista = await listarUsuarios();
        setUsuarios(lista);
      } catch (e) {
        setErro("Erro ao carregar usuários.");
        console.error(e);
      }
    };
    carregar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !cpf.trim() || !rg.trim() || !perfil) {
      return setErro("Preencha todos os campos obrigatórios.");
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      return setErro("Digite um e-mail válido.");
    }
    if (cpf.length < 8 || rg.length < 5) {
      return setErro("Digite um CPF e RG válidos.");
    }

    try {
      const formData = {
        nome,
        email,
        cpf,
        rg,
        senha: "123456", // senha padrão inicial
        perfil,
        precisaTrocarSenha: true
      };

      if (perfil === "passageiro") {
        formData.subtipo_passageiro = subtipo_passageiro;
        formData.saldo_credito = 0;
      }

      const novo = await criarUsuario(formData);
      setUsuarios([...usuarios, novo]);

      setNome("");
      setEmail("");
      setCpf("");
      setRg("");
      setPerfil("");
      setSubtipoPassageiro("");
      nomeRef.current?.focus();
    } catch (e) {
      // Aqui tratamos o erro detalhado vindo do backend!
      if (e.response && e.response.data && e.response.data.erro) {
        setErro(e.response.data.erro);
      } else {
        setErro("Erro ao criar usuário.");
      }
      console.error(e);
    }
  };

  const removerUsuario = async (index) => {
    const usuario = usuarios[index];
    if (!window.confirm(`Remover ${usuario.nome}?`)) return;

    try {
      await deletarUsuario(usuario.id);
      setUsuarios(usuarios.filter((_, i) => i !== index));
    } catch (e) {
      console.error(e);
      setErro("Erro ao remover usuário.");
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-green-900">👤 Gerenciar Usuários</h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow"
          autoComplete="off"
        >
          <input
            id="nome"
            className="border p-2 rounded"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            ref={nomeRef}
            required
          />

          <input
            id="email"
            className="border p-2 rounded"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />

          <input
            id="cpf"
            className="border p-2 rounded"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <input
            id="rg"
            className="border p-2 rounded"
            placeholder="RG"
            value={rg}
            onChange={(e) => setRg(e.target.value)}
            required
          />

          <select
            id="perfil"
            className="border p-2 rounded"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            required
          >
            <option value="">Selecione o Perfil</option>
            <option value="admin">Admin</option>
            <option value="motorista">Motorista</option>
            <option value="passageiro">Passageiro</option>
          </select>

          {perfil === "passageiro" && (
            <select
              id="subtipo"
              className="border p-2 rounded"
              value={subtipo_passageiro}
              onChange={(e) => setSubtipoPassageiro(e.target.value)}
            >
              <option value="">Subtipo Passageiro</option>
              <option value="aluno_gratuito">Aluno com Gratuidade</option>
              <option value="aluno_pagante">Aluno Pagante</option>
              <option value="idoso">Idoso</option>
            </select>
          )}

          <div className="col-span-full">
            {erro && <div className="text-red-600 text-sm mb-2">{erro}</div>}
            <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
              ➕ Criar Usuário
            </button>
          </div>
        </form>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Usuários Cadastrados</h3>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className="border px-3 py-1 rounded hover:bg-gray-100"
                onClick={() => exportarPDF(usuarios)}
              >📄 PDF</button>
              <button
                className="border px-3 py-1 rounded hover:bg-gray-100"
                onClick={() => exportarCSV(usuarios)}
              >📑 CSV</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">E-mail</th>
                  <th className="px-4 py-2">CPF</th>
                  <th className="px-4 py-2">RG</th>
                  <th className="px-4 py-2">Perfil</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhum usuário cadastrado
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u, i) => (
                    <tr key={u.id || i} className="border-t">
                      <td className="px-4 py-2">{u.nome}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.cpf}</td>
                      <td className="px-4 py-2">{u.rg}</td>
                      <td className="px-4 py-2">{u.perfil}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => removerUsuario(i)}
                          className="text-red-600 hover:underline"
                        >Remover</button>
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
