import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protege rotas por perfil (admin, motorista, passageiro).
 * Garante login, e que o perfil no localStorage corresponde ao permitido.
 */
const ProtectedRouteByPerfil = ({ children, permitido = [] }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  let perfil = usuario.perfil;
  // fallback para padrão caso perfil não venha corretamente
  if (!perfil && usuario.tipo) perfil = 'passageiro';

  const location = useLocation();

  // Se não estiver logado ou perfil não permitido, vai para login
  if (!token || !permitido.includes(perfil)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRouteByPerfil;
