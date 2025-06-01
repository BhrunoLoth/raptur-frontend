import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";
import { login } from "../services/userService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    try {
      const res = await login(email, senha);
      if (res?.token) {
        navigate("/dashboard"); // ✅ redireciona após login
      }
    } catch (err) {
      setErro("Credenciais inválidas ou erro no login.");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card login-card">
        <img
          src={logo}
          alt="Logo Raptur"
          width={110}
          style={{ margin: "0 auto 10px auto", display: "block" }}
        />
        <h2 className="user-title" style={{ marginBottom: 18 }}>
          Acessar Painel
        </h2>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email" className="user-label">
            Email
          </label>
          <input
            id="email"
            className="user-input"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailRef}
            autoFocus
            aria-label="Email"
            type="email"
          />

          <label htmlFor="senha" className="user-label">
            Senha
          </label>
          <input
            id="senha"
            className="user-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-label="Senha"
            type="password"
            autoComplete="current-password"
          />

          {erro && <div className="user-error">{erro}</div>}

          <button className="action-btn login-btn" type="submit">
            <span>Entrar</span>
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;













