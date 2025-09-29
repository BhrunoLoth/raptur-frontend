import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Verifica apenas se há sessão válida (token + usuario).
 * Use para agrupar rotas protegidas com <Outlet/>.
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    usuario = null;
  }

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
