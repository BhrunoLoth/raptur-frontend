import React, { useContext } from "react";
import { useTheme } from "../contexts/ThemeContext"; // ✅ CORRIGIDO
import Sidebar from "./Sidebar";
import "../styles/RapturStyle.css";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`main-bg ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Claro" : "☀️ Escuro"}
      </button>
      <div className="center-content">{children}</div>
    </div>
  );
};

export default Layout;
