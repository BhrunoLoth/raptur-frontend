import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  // URL base do backend definida no Vercel como VITE_API_URL
  const BACKEND = import.meta.env.VITE_API_URL;

  // Token salvo no login
  const token = localStorage.getItem("token");

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      setErro("");

      // ROTA CORRETA (sem /api/api)
      const resp = await axios.get(`${BACKEND}/api/usuarios`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      // Caso o backend responda { usuarios: [...] }
      // ou responda um array direto
      const lista = Array.isArray(resp.data)
        ? resp.data
        : resp.data.usuarios || [];

      setUsuarios(lista);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setErro("Erro ao carregar usuários");
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* Header da página */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-900 text-xl leading-none"
        >
          ←
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-900">
            Gerenciar Usuários
          </h1>
          <span className="text-sm text-gray-500">
            Lista de contas do sistema
          </span>
        </div>

        <div className="ml-auto">
          <button
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-md shadow"
            onClick={() => console.log("Novo Usuário")}
          >
            + Novo Usuário
          </button>
        </div>
      </div>

      {/* Card com tabela */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-800">Lista de Usuários</p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2 px-4 font-medium">Nome</th>
                <th className="py-2 px-4 font-medium">CPF</th>
                <th className="py-2 px-4 font-medium">Email</th>
                <th className="py-2 px-4 font-medium">Perfil</th>
                <th className="py-2 px-4 font-medium">Status</th>
                <th className="py-2 px-4 font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 px-4 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 px-4 text-center text-gray-500"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr
                    key={
                      u.id ||
                      u.usuarioId ||
                      u.cpf ||
                      `${u.email}-${u.nome || "user"}`
                    }
                    className="border-t border-gray-100"
                  >
                    <td className="py-2 px-4 text-gray-900">{u.nome}</td>
                    <td className="py-2 px-4 text-gray-900">{u.cpf}</td>
                    <td className="py-2 px-4 text-gray-900">{u.email}</td>
                    <td className="py-2 px-4 text-gray-900">
                      {u.perfil || u.role || u.tipo || "—"}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block rounded-full text-xs px-2 py-1 font-medium ${
                          u.ativo === false || u.status === "inativo"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.ativo === false || u.status === "inativo"
                          ? "Inativo"
                          : "Ativo"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="text-blue-600 hover:underline text-xs font-medium mr-3"
                        onClick={() => console.log("editar", u)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:underline text-xs font-medium"
                        onClick={() => console.log("desativar", u)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast de erro */}
      {erro && (
        <div className="mt-6 bg-white border border-gray-200 shadow rounded-md p-4 flex items-start gap-3 max-w-lg">
          <div className="text-xl leading-none text-gray-700">⚠</div>
          <div>
            <p className="text-sm text-gray-800 font-medium">
              {erro || "Erro ao carregar usuários"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
