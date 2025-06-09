// src/routes/ProtectedRouteByPerfil.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRouteByPerfil = ({ children, permitido = [] }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const perfil = usuario.perfil;
  const location = useLocation();

  // Caso não esteja logado ou perfil não permitido
  if (!token || !permitido.includes(perfil)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteByPerfil;

