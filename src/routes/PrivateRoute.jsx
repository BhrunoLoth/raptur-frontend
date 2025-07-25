import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute
 *
 * Protege rotas que exigem usuário autenticado.
 * Verifica a existência de um token JWT no localStorage.
 *
 * Uso (React Router v6):
 * // Rota isolada:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <PrivateRoute>
 *       <Dashboard />
 *     </PrivateRoute>
 *   }
 * />
 * // Layout com rotas aninhadas:
 * <Route element={<PrivateRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/settings" element={<Settings />} />
 * </Route>
 */
export default function PrivateRoute({ children }) {
  // Busca token JWT no localStorage
  const token = localStorage.getItem('token');

  // Se não tiver token, redireciona para tela de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se houve children, renderiza-os; senão assume rotas aninhadas e usa <Outlet/>
  return children ? children : <Outlet />;
}
