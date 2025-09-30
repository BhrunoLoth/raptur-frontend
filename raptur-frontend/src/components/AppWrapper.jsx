import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Envolve as páginas, aplica tema e um botão de alternância.
 * Também sincroniza a classe `dark` no <html> (Tailwind).
 */
const AppWrapper = ({ children }) => {
  const { theme, toggleTheme } = useTheme(); // "light" | "dark"

  // Sincroniza a classe `dark` no HTML e persiste no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        padding: "20px",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #232526 0%, #414345 100%)"
            : "linear-gradient(135deg, #60d394 0%, #f8f8f8 50%, #f5b27d 100%)",
        color: theme === "dark" ? "#fff" : "#222",
        transition: "background 0.3s ease, color 0.3s ease",
        position: "relative",
      }}
    >
      {/* Botão de alternância de tema */}
      <div style={{ position: "absolute", top: 16, right: 24, zIndex: 10 }}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            bgcolor: theme === "dark" ? "#333" : "#ffc107",
            color: theme === "dark" ? "#ffd54f" : "#000",
            boxShadow: 1,
            "&:hover": { bgcolor: theme === "dark" ? "#444" : "#ffb300" },
          }}
          size="small"
          aria-label="Alternar tema"
          title={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>
      </div>

      {/* Conteúdo da página */}
      <div style={{ marginTop: 48 }}>{children}</div>
    </div>
  );
};

export default AppWrapper;
