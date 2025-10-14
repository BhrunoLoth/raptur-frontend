// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import logo from '../assets/logo-raptur.png';
import { login as authLogin } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // se já estiver logado, pula a tela
  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      const user = JSON.parse(localStorage.getItem('usuario') || 'null');
      if (token && user?.perfil) {
        const destinos = {
          admin: '/admin/dashboard',
          motorista: '/motorista/dashboard',
          passageiro: '/passageiro/dashboard',
        };
        navigate(destinos[user.perfil] || '/login', { replace: true });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const destinos = {
    admin: '/admin/dashboard',
    motorista: '/motorista/dashboard',
    passageiro: '/passageiro/dashboard',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      emailRef.current?.focus();
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro('Digite um e-mail válido.');
      emailRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      // limpa sessão antiga
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // authService salva token/usuario e retorna o usuario
      const usuario = await authLogin(email, senha);

      if (usuario?.precisaTrocarSenha) {
        return navigate('/trocar-senha', { replace: true });
      }

      // se veio redirecionado de uma rota protegida, volta pra lá
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        navigate(destinos[usuario?.perfil] || '/admin/dashboard', { replace: true });
      }
    } catch (err) {
      if (typeof err === 'string') setErro(err);
      else if (err?.message) setErro(err.message);
      else setErro('Erro ao fazer login. Verifique suas credenciais.');
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (erro) setErro('');
  };

  return (
    <PublicLayout>
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-orange-100 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
          <img src={logo} alt="Logo Raptur" className="w-24 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-green-800">
            Acessar Painel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={email}
                onChange={handleChange(setEmail)}
                ref={emailRef}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium mb-1 text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                value={senha}
                onChange={handleChange(setSenha)}
                autoComplete="current-password"
              />
            </div>

            {erro && <div className="text-red-600 text-sm text-center">{erro}</div>}

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Ainda não tem conta?{' '}
            <a href="/cadastro" className="text-green-700 font-medium hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
