import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";
import "../styles/RapturStyle.css";

export default function MotoristaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const handleLogin = async (e) => {
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
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();

      if (res.ok && data.token && data.usuario.role === "motorista") {
        localStorage.setItem("token", data.token);
        navigate("/motorista/dashboard");
      } else {
        setErro("Acesso negado: apenas motoristas.");
      }
    } catch (err) {
      setErro("Erro ao fazer login.");
    }
  };

  return (
    <Layout>
      <div className="dashboard-main-card login-card">
        <img src={logo} alt="Logo Raptur" width={110} style={{ margin: "0 auto 10px auto", display: "block" }} />
        <h2 className="user-title" style={{ marginBottom: 18 }}>Acesso Motorista</h2>
        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <label htmlFor="email" className="user-label">Email</label>
          <input
            id="email"
            className="user-input"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            ref={emailRef}
            autoFocus
            aria-label="Email"
            type="email"
          />
          <label htmlFor="senha" className="user-label">Senha</label>
          <input
            id="senha"
            className="user-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            aria-label="Senha"
            type="password"
          />
          {erro && <div className="user-error">{erro}</div>}
          <button type="submit" className="action-btn login-btn">
            Entrar
          </button>
        </form>
      </div>
    </Layout>
  );
}