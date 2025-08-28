import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
    </button>
  );
};

export default ThemeToggle;


