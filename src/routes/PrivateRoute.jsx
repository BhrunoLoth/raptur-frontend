import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Rota protegida básica.
 * - Requer `token` e `usuario` no localStorage
 * - Se o token for JWT, checa expiração (opcional)
 * - Opcional: `requiredRoles` para validar papel do usuário (array de strings)
 *
 * Uso:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/admin" element={<AdminHome />} />
 *   </Route>
 *
 *   // Com papéis:
 *   <Route element={<PrivateRoute requiredRoles={['ADMIN']} />}>
 *     <Route path="/admin/secret" element={<Secret />} />
 *   </Route>
 */
export default function PrivateRoute({ children, requiredRoles }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    usuario = null;
  }

  // rejeita se não houver token/usuario
  if (!token || !usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
    // opcional: você pode logar aqui o motivo
  }

  // Se o token for um JWT, checa expiração (best-effort)
  try {
    const [, payloadB64] = token.split(".");
    if (payloadB64) {
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.exp && Date.now() / 1000 > payload.exp) {
        // expirado
        localStorage.removeItem("token");
        return (
          <Navigate
            to="/login"
            replace
            state={{ from: location.pathname + location.search, reason: "expired" }}
          />
        );
      }
    }
  } catch {
    // se não for JWT válido, não quebra o fluxo — segue em frente
  }

  // Checagem opcional de papéis
  if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    const roles = Array.isArray(usuario?.roles) ? usuario.roles : [];
    const ok = requiredRoles.some((r) => roles.includes(r));
    if (!ok) {
      // sem permissão → opcionalmente envie para / ou /403
      return <Navigate to="/" replace />;
    }
  }

  // OK
  return children ? children : <Outlet />;
}
