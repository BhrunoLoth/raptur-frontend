import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Sidebar from "./Sidebar";
import "../styles/RapturStyle.css";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`main-bg ${theme}`}>
      {/* Sidebar opcional, ative se quiser navegação lateral */}
      {/* <Sidebar /> */}

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Alternar tema"
        title={theme === "light" ? "Modo escuro" : "Modo claro"}
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          padding: "8px 14px",
          borderRadius: 24,
          fontWeight: "bold",
          fontSize: 16,
          zIndex: 10,
          background: theme === "dark" ? "#fffbe8" : "#222",
          color: theme === "dark" ? "#333" : "#ffd600",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          cursor: "pointer",
          transition: "all .2s"
        }}
      >
        {theme === "light" ? "🌙 Claro" : "☀️ Escuro"}
      </button>

      <div className="center-content">{children}</div>
    </div>
  );
};

export default Layout;
