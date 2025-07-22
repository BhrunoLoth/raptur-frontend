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
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef(null);

  // Limpa localStorage de tokens/usuario antigos ao montar (opcional)
  // useEffect(() => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("usuario");
  //   localStorage.removeItem("onibusId");
  // }, []);

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

    if (onibusId.trim().length < 2) {
      setErro("Digite o ID do ônibus corretamente.");
      return;
    }

    setCarregando(true);

    try {
      // Remove dados antigos do motorista (evita confusão offline)
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("onibusId");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data?.erro || "Erro no login.");
        setCarregando(false);
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
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(usuarioObj));
        localStorage.setItem("onibusId", onibusId);

        await sincronizarPassageiros(data.token);
        setCarregando(false);
        navigate("/motorista/dashboard");
      } else {
        setErro("Acesso negado: apenas motoristas.");
        setCarregando(false);
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Erro ao fazer login. Tente novamente.");
      setCarregando(false);
    }
  };

  // Limpa mensagem de erro ao digitar novamente
  const clearError = () => erro && setErro("");

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
      // console.log(`🧠 ${passageiros.length} passageiros sincronizados localmente.`);
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
            onChange={e => { setEmail(e.target.value); clearError(); }}
            ref={emailRef}
            autoFocus
            aria-label="Email"
            type="email"
            autoComplete="username"
          />

          <label htmlFor="senha" className="user-label">Senha</label>
          <input
            id="senha"
            className="user-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={e => { setSenha(e.target.value); clearError(); }}
            aria-label="Senha"
            type="password"
            autoComplete="current-password"
          />

          <label htmlFor="onibusId" className="user-label">ID do Ônibus</label>
          <input
            id="onibusId"
            className="user-input"
            placeholder="Digite o ID do ônibus"
            value={onibusId}
            onChange={e => { setOnibusId(e.target.value); clearError(); }}
            aria-label="Ônibus"
            type="text"
          />

          {erro && <div className="user-error">{erro}</div>}

          <button
            type="submit"
            className="action-btn login-btn"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
