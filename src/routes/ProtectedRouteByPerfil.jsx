import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protege rotas por perfil e garante que exista sessão válida.
 * Props aceitos (equivalentes): `perfisPermitidos`, `permitido`, `allow`
 */
export default function ProtectedRouteByPerfil(props) {
  // nomes compatíveis para não quebrar chamadas antigas
  const allow =
    props.perfisPermitidos ||
    props.permitido ||
    props.allow ||
    [];

  const location = useLocation();

  const token = localStorage.getItem('token');
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    usuario = null;
  }

  if (!token || !usuario) {
    // guarda a rota de origem pra voltar depois do login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const perfil = usuario.perfil || (usuario.tipo ? 'passageiro' : null);
  if (!perfil) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // se perfil não tem acesso a essa rota, manda para o dashboard correto dele
  if (allow.length > 0 && !allow.includes(perfil)) {
    const destinoPorPerfil = {
      admin: '/admin/dashboard',
      motorista: '/motorista/dashboard',
      passageiro: '/passageiro/dashboard',
    };
    return <Navigate to={destinoPorPerfil[perfil] || '/login'} replace />;
  }

  return props.children;
}
