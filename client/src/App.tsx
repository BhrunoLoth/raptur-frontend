import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuthStore } from "@/lib/store";

// Pages principais
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Perfis
import DashboardAdmin from "./pages/DashboardAdmin";
import Cobrador from "./pages/Cobrador";
import Passageiro from "./pages/Passageiro";
import CarteirinhaIdoso from "./pages/CarteirinhaIdoso";
import Motorista from "./pages/Motorista";

// Administração
import ImportarAlunos from "./pages/ImportarAlunos";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import GerenciarOnibus from "./pages/GerenciarOnibus";
import GerenciarRotas from "./pages/GerenciarRotas";
import GerenciarMotoristas from "./pages/GerenciarMotoristas";
import GerenciarCobradores from "./pages/GerenciarCobradores";
import Relatorios from "./pages/Relatorios";
import AdminIdosos from "./pages/AdminIdosos"; // ✅ novo módulo

// Pagamentos
import PagamentoSucesso from "./pages/PagamentoSucesso";
import PagamentoErro from "./pages/PagamentoErro";
import PagamentoPendente from "./pages/PagamentoPendente";

/* ---------------- PRIVATE ROUTE ---------------- */
function PrivateRoute({ component: Component, roles, ...rest }) {
  const { isAuthenticated, user } = useAuthStore();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (roles && !roles.includes(user?.perfil)) {
    setLocation("/404");
    return null;
  }

  return <Component {...rest} />;
}

/* ---------------- DASHBOARD REDIRECT ---------------- */
function DashboardRedirect() {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/login");
    return null;
  }

  const rotas = {
    admin: "/dashboard/admin",
    passageiro: "/passageiro",
    cobrador: "/cobrador",
    motorista: "/motorista",
  };

  setLocation(rotas[user.perfil] || "/404");
  return null;
}

/* ---------------- ROUTER ---------------- */
function Router() {
  return (
    <Switch>
      {/* Públicas */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Redirecionamento dinâmico */}
      <Route path="/dashboard" component={DashboardRedirect} />

      {/* Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        component={(props) => (
          <PrivateRoute component={DashboardAdmin} roles={["admin"]} {...props} />
        )}
      />

      {/* Perfis */}
      <Route
        path="/cobrador"
        component={(p) => <PrivateRoute component={Cobrador} roles={["cobrador"]} {...p} />}
      />
      <Route
        path="/passageiro"
        component={(p) => <PrivateRoute component={Passageiro} roles={["passageiro"]} {...p} />}
      />
      <Route
        path="/carteirinha"
        component={(p) => (
          <PrivateRoute component={CarteirinhaIdoso} roles={["passageiro"]} {...p} />
        )}
      />
      <Route
        path="/motorista"
        component={(p) => <PrivateRoute component={Motorista} roles={["motorista"]} {...p} />}
      />

      {/* Administração */}
      <Route
        path="/importar-alunos"
        component={(p) => <PrivateRoute component={ImportarAlunos} roles={["admin"]} {...p} />}
      />
      <Route
        path="/gerenciar-usuarios"
        component={(p) => <PrivateRoute component={GerenciarUsuarios} roles={["admin"]} {...p} />}
      />
      <Route
        path="/gerenciar-onibus"
        component={(p) => <PrivateRoute component={GerenciarOnibus} roles={["admin"]} {...p} />}
      />
      <Route
        path="/gerenciar-rotas"
        component={(p) => <PrivateRoute component={GerenciarRotas} roles={["admin"]} {...p} />}
      />
      <Route
        path="/gerenciar-motoristas"
        component={(p) => (
          <PrivateRoute component={GerenciarMotoristas} roles={["admin"]} {...p} />
        )}
      />
      <Route
        path="/gerenciar-cobradores"
        component={(p) => (
          <PrivateRoute component={GerenciarCobradores} roles={["admin"]} {...p} />
        )}
      />
      <Route
        path="/relatorios"
        component={(p) => <PrivateRoute component={Relatorios} roles={["admin"]} {...p} />}
      />

      {/* ✅ Novo módulo: Gestão de Idosos */}
      <Route
        path="/admin/idosos"
        component={(p) => <PrivateRoute component={AdminIdosos} roles={["admin"]} {...p} />}
      />

      {/* Pagamento */}
      <Route path="/pagamento/sucesso" component={PagamentoSucesso} />
      <Route path="/pagamento/erro" component={PagamentoErro} />
      <Route path="/pagamento/pendente" component={PagamentoPendente} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

/* ---------------- APP WRAPPER ---------------- */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
