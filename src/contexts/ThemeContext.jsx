import React, { createContext, useContext, useEffect, useState } from "react";

// Criação do contexto do tema
const ThemeContext = createContext();

// Provider do tema (envolva seu app com ele)
export const ThemeProvider = ({ children }) => {
  // Estado inicial pega o valor do localStorage (dark/light)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Sincroniza darkMode com localStorage e a classe do <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Alterna o tema
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o tema em qualquer componente
export const useTheme = () => useContext(ThemeContext);

// Não existe mais useThemeContext! Use apenas useTheme.
