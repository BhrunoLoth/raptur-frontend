import React, { useEffect, useState } from "react";
import { usuarioAPI } from "../lib/api";
import { toast } from "sonner";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    perfil: "passageiro",
    subtipo_passageiro: "comum",
    senha: "",
  });

  /* ------------------ Carregar usuários ------------------ */
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const res = await usuarioAPI.listar();
      setUsuarios(res.data || []);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  /* ------------------ Criar novo usuário ------------------ */
  const handleCreate = async () => {
    try {
      const data = { ...novoUsuario };
      if (data.perfil === "passageiro" && !data.subtipo_passageiro) {
        return toast.error("Selecione o subtipo do passageiro");
      }

      await usuarioAPI.criar(data);
      toast.success("Usuário criado com sucesso!");
      setDialogOpen(false);
      setNovoUsuario({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        perfil: "passageiro",
        subtipo_passageiro: "comum",
        senha: "",
      });
      loadUsuarios();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao criar usuário");
    }
  };

  /* ------------------ Alternar status (ativo/inativo) ------------------ */
  const handleToggleStatus = async (user: any) => {
    try {
      const rota = user.ativo
        ? usuarioAPI.desativar(user.id)
        : usuarioAPI.ativar(user.id);

      await rota;
      toast.success(
        `Usuário ${user.nome} ${user.ativo ? "desativado" : "ativado"} com sucesso`
      );
      loadUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao alterar status do usuário");
    }
  };

  /* ------------------ Atualizar campos do formulário ------------------ */
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------ Renderização ------------------ */
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Gerenciar Usuários</h1>
        <button
          onClick={() => setDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          + Novo Usuário
        </button>
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="bg-white p-4 rounded-2xl shadow-md overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">CPF</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Perfil</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{u.nome}</td>
                  <td className="p-2">{u.cpf}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.perfil}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        u.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`${
                        u.ativo
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-3 py-1 rounded-md`}
                    >
                      {u.ativo ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de criação */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Novo Usuário</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="nome"
                value={novoUsuario.nome}
                onChange={handleInputChange}
                placeholder="Nome completo"
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                name="cpf"
                value={novoUsuario.cpf}
                onChange={handleInputChange}
                placeholder="CPF (000.000.000-00)"
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                name="email"
                value={novoUsuario.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                name="telefone"
                value={novoUsuario.telefone}
                onChange={handleInputChange}
                placeholder="Telefone (00) 00000-0000"
                className="border p-2 rounded-md"
              />

              <select
                name="perfil"
                value={novoUsuario.perfil}
                onChange={handleInputChange}
                className="border p-2 rounded-md"
              >
                <option value="admin">Administrador</option>
                <option value="motorista">Motorista</option>
                <option value="cobrador">Cobrador</option>
                <option value="passageiro">Passageiro</option>
              </select>

              {/* Subtipo de passageiro */}
              {novoUsuario.perfil === "passageiro" && (
                <select
                  name="subtipo_passageiro"
                  value={novoUsuario.subtipo_passageiro}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                >
                  <option value="comum">Comum</option>
                  <option value="aluno_pagante">Estudante com desconto</option>
                  <option value="aluno_gratuito">Estudante gratuito</option>
                  <option value="idoso">Idoso</option>
                </select>
              )}

              <input
                type="password"
                name="senha"
                value={novoUsuario.senha}
                onChange={handleInputChange}
                placeholder="Senha"
                className="border p-2 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDialogOpen(false)}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
