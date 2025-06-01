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
        padding: "20px",
        background: "linear-gradient(135deg, #60d394 0%, #f8f8f8 50%, #f5b27d 100%)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Botão de tema */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <IconButton
          onClick={toggleTheme}
          style={{ backgroundColor: "#ffc107", color: "#000" }}
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </IconButton>
      </div>

      {/* Conteúdo da Página */}
      {children}
    </div>
  );
};

export default AppWrapper;
