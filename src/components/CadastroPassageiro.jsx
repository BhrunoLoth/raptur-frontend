import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroPassageiro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', subtipo: '' });
  const [erro, setErro] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha || !form.subtipo) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-orange-200">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Cadastrar Passageiro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            className="w-full border rounded px-4 py-2"
            value={form.nome}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full border rounded px-4 py-2"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            className="w-full border rounded px-4 py-2"
            value={form.senha}
            onChange={handleChange}
          />
          <select
            name="subtipo"
            className="w-full border rounded px-4 py-2"
            value={form.subtipo}
            onChange={handleChange}
          >
            <option value="">Selecione o tipo de passageiro</option>
            <option value="aluno_gratuito">Aluno Gratuito</option>
            <option value="aluno_pagante">Aluno Pagante</option>
            <option value="idoso">Idoso</option>
          </select>

          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold"
          >
            Cadastrar
          </button>

          <p className="text-sm text-center mt-2">
            Já tem conta?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-green-700 hover:underline cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
