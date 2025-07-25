import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroPassageiro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    subtipo: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validação básica
    if (!form.nome.trim() || !form.email.trim() || !form.senha.trim() || !form.subtipo) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          perfil: "passageiro",
          subtipo_passageiro: form.subtipo
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.erro || 'Erro ao cadastrar');
      }

      navigate('/login');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-orange-200 px-2">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Cadastrar Passageiro</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            className="w-full border rounded px-4 py-2"
            value={form.nome}
            onChange={handleChange}
            autoFocus
            autoComplete="off"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full border rounded px-4 py-2"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha (mínimo 6 caracteres)"
            className="w-full border rounded px-4 py-2"
            value={form.senha}
            onChange={handleChange}
            minLength={6}
            autoComplete="new-password"
          />
          <select
            name="subtipo"
            className="w-full border rounded px-4 py-2"
            value={form.subtipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo de passageiro</option>
            <option value="aluno_gratuito">Aluno Gratuito</option>
            <option value="aluno_pagante">Aluno Pagante</option>
            <option value="idoso">Idoso</option>
            <option value="comum">Usuário Comum</option>
          </select>

          {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold transition"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Cadastrar"}
          </button>

          <p className="text-sm text-center mt-2">
            Já tem conta?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-green-700 hover:underline cursor-pointer"
              tabIndex={0}
              role="button"
            >
              Entrar
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
