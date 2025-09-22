import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Box, IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import "../styles/RapturStyle.css";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box
      className={`main-bg ${theme}`}
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden', // Previne scroll horizontal
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Sidebar opcional, ative se quiser navegação lateral */}
      {/* <Sidebar /> */}

      {/* Botão de tema otimizado */}
      <Tooltip title={theme === "light" ? "Modo escuro" : "Modo claro"}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1300, // Acima de modais do Material-UI
            backgroundColor: theme === "dark" ? "#fffbe8" : "#222",
            color: theme === "dark" ? "#333" : "#ffd600",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease-in-out",
            '&:hover': {
              backgroundColor: theme === "dark" ? "#fff8d1" : "#333",
              transform: 'scale(1.05)',
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            },
            '&:active': {
              transform: 'scale(0.95)'
            }
          }}
        >
          {theme === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Tooltip>

      {/* Conteúdo principal com container responsivo */}
      <Box
        className="center-content"
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: '100vw', // Previne overflow horizontal
          margin: '0 auto',
          padding: { xs: 1, sm: 2, md: 3 }, // Padding responsivo
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // Previne tela dançante
          position: 'relative',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
