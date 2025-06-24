import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrocarSenha() {
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!novaSenha || novaSenha.length < 6) {
      return setErro('A nova senha deve ter pelo menos 6 caracteres.');
    }

    if (novaSenha !== confirmarNovaSenha) {
      return setErro('As novas senhas não coincidem.');
    }

    try {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      const res = await fetch('/api/usuarios/trocar-senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ senha_nova: novaSenha })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.erro || 'Erro ao trocar senha.');
      }

      usuario.precisaTrocarSenha = false;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      setSucesso('Senha alterada com sucesso! Redirecionando...');

      setTimeout(() => {
        if (usuario.perfil === 'passageiro') navigate('/passageiro/dashboard');
        else if (usuario.perfil === 'motorista') navigate('/motorista/dashboard');
        else if (usuario.perfil === 'admin') navigate('/dashboard');
        else navigate('/');
      }, 2000);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 md:p-8 rounded-xl shadow">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-green-800">
        🔐 Trocar Senha
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarNovaSenha}
          onChange={(e) => setConfirmarNovaSenha(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm text-center">{sucesso}</p>}

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded font-medium transition"
        >
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
