import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import logo from "../assets/logo-raptur.png";
import "../styles/RapturStyle.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MotoristaLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [onibusId, setOnibusId] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim() || !onibusId.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data?.erro || "Erro no login.");
        return;
      }

      // Garante que seja perfil motorista!
      const isMotorista =
        data.usuario?.role === "motorista" ||
        data.usuario?.perfil === "motorista";

      if (data.token && isMotorista) {
        // Salva tudo dentro de usuario!
        const usuarioObj = {
          ...data.usuario,
          perfil: "motorista", // força a garantir!
          nome: data.usuario.nome || "Motorista",
          onibusId,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(usuarioObj));

        await sincronizarPassageiros(data.token);
        navigate("/motorista/dashboard");
      } else {
        setErro("Acesso negado: apenas motoristas.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro ao fazer login.");
    }
  };

  const sincronizarPassageiros = async (token) => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const lista = await res.json();
      if (!Array.isArray(lista)) throw new Error("Resposta inesperada da API");

      const passageiros = lista.filter(
        (user) => user.ativo && user.qrCode && user.perfil === "passageiro"
      );

      localStorage.setItem("passageirosQR", JSON.stringify(passageiros));
      console.log(`🧠 ${passageiros.length} passageiros sincronizados localmente.`);
    } catch (err) {
      console.error("❌ Erro ao sincronizar passageiros:", err);
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
          Acesso Motorista
        </h2>
        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <label htmlFor="email" className="user-label">Email</label>
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

          <label htmlFor="senha" className="user-label">Senha</label>
          <input
            id="senha"
            className="user-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            aria-label="Senha"
            type="password"
          />

          <label htmlFor="onibusId" className="user-label">ID do Ônibus</label>
          <input
            id="onibusId"
            className="user-input"
            placeholder="Digite o ID do ônibus"
            value={onibusId}
            onChange={(e) => setOnibusId(e.target.value)}
            aria-label="Ônibus"
            type="text"
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
