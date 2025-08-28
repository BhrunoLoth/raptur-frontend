import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import logo from '../assets/logo-raptur.png';
import { login } from '../services/userService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

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
      // Limpa usuário/token antigos antes do login (robustez)
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('perfil');

      const res = await login(email, senha);

      // O userService.login deve lançar erro se falhar!
      const { token, usuario } = res;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.removeItem('perfil'); // Nunca armazene 'perfil' fora do objeto!

      if (usuario.precisaTrocarSenha) {
        return navigate('/trocar-senha');
      }

      switch (usuario.perfil) {
        case 'admin':
          return navigate('/dashboard');
        case 'motorista':
          return navigate('/motorista/dashboard');
        case 'passageiro':
          return navigate('/passageiro/dashboard');
        default:
          setErro('Perfil não reconhecido. Contate o administrador.');
      }
    } catch (err) {
      if (typeof err === "string") setErro(err);
      else if (err?.message) setErro(err.message);
      else setErro('Erro ao fazer login. Verifique suas credenciais.');
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Limpa erro ao digitar novamente
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (erro) setErro('');
  };

  return (
    <PublicLayout>
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-orange-100 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
          <img
            src={logo}
            alt="Logo Raptur"
            className="w-24 mx-auto mb-4"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-green-800">
            Acessar Painel
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
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
              <label htmlFor="senha" className="block text-sm font-medium mb-1 text-gray-700">Senha</label>
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
            <a href="/cadastro" className="text-green-700 font-medium hover:underline">Cadastre-se</a>
          </p>
          {/* Se quiser adicionar recuperação de senha */}
          {/* <p className="mt-2 text-center text-xs">
            <a href="/esqueci-senha" className="text-green-600 hover:underline">Esqueceu a senha?</a>
          </p> */}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
