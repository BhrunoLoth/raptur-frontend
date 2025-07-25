import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { IconButton } from "@mui/material";
import { Sun, Moon } from "lucide-react";

const AppWrapper = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

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
        transition: "background 0.3s, color 0.3s",
        position: "relative",
      }}
    >
      {/* Botão de tema */}
      <div style={{ position: "absolute", top: 16, right: 24, zIndex: 10 }}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            bgcolor: theme === "dark" ? "#333" : "#ffc107",
            color: theme === "dark" ? "#ffd54f" : "#000",
            "&:hover": { bgcolor: theme === "dark" ? "#444" : "#ffb300" },
          }}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </IconButton>
      </div>

      {/* Conteúdo da Página */}
      <div style={{ marginTop: 48 }}>{children}</div>
    </div>
  );
};

export default AppWrapper;
