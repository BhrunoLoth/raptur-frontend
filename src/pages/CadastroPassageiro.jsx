import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const apiBase = import.meta.env.VITE_API_URL;

export default function CadastroPassageiro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [subtipo, setSubtipo] = useState('aluno_pagante');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  // Validação básica
  const validaCPF = (v) => v.replace(/\D/g, '').length === 11;
  const validaEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Validações extras
    if (!nome.trim() || !email.trim() || !senha.trim() || !cpf.trim() || !rg.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!validaEmail(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (!validaCPF(cpf)) {
      setErro('CPF deve conter 11 dígitos numéricos.');
      return;
    }
    if (senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const resposta = await fetch(`${apiBase}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          perfil: 'passageiro',              // <-- Força o perfil correto!
          subtipo_passageiro: subtipo,
          cpf: cpf.replace(/\D/g, ''),       // Só números
          rg,
        }),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.erro || 'Erro ao cadastrar usuário');
      }

      setSucesso(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-orange-100 px-4 py-8">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-green-800">
            Cadastro de Passageiro
          </h2>
          <p className="text-center text-sm text-red-500 mb-2">
            Nome, e-mail, senha, subtipo, CPF e RG são obrigatórios.
          </p>
          {erro && (
            <p className="text-red-600 text-sm mb-2 text-center">{erro}</p>
          )}
          {sucesso && (
            <p className="text-green-600 text-sm mb-2 text-center">
              Cadastro realizado! Redirecionando...
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              autoComplete="off"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              minLength={6}
            />
            <select
              value={subtipo}
              onChange={(e) => setSubtipo(e.target.value)}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="aluno_pagante">Aluno Pagante</option>
              <option value="aluno_gratuito">Aluno Gratuito</option>
              <option value="idoso">Idoso</option>
              <option value="comum">Usuário Comum</option>
            </select>
            <input
              type="text"
              placeholder="CPF (apenas números)"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              maxLength={11}
              inputMode="numeric"
              pattern="[0-9]{11}"
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="RG"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              maxLength={12}
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              Cadastrar
            </button>
          </form>

          <div className="text-sm text-center mt-3">
            <a href="/login" className="text-green-700 hover:underline">
              Voltar para login
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
