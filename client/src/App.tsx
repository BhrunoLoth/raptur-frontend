import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Páginas do sistema
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";
import Cobrador from "./pages/Cobrador";
import Register from "./pages/Register";
import Passageiro from "./pages/Passageiro";
import CarteirinhaIdoso from "./pages/CarteirinhaIdoso";
import Motorista from "./pages/Motorista";
import ImportarAlunos from "./pages/ImportarAlunos";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import GerenciarOnibus from "./pages/GerenciarOnibus";
import GerenciarRotas from "./pages/GerenciarRotas";
import GerenciarMotoristas from "./pages/GerenciarMotoristas";
import GerenciarCobradores from "./pages/GerenciarCobradores";
import Relatorios from "./pages/Relatorios";

// ✅ Páginas novas de pagamento
import PagamentoSucesso from "./pages/PagamentoSucesso";
import PagamentoErro from "./pages/PagamentoErro";
import PagamentoPendente from "./pages/PagamentoPendente";

function Router() {
  return (
    <Switch>
      {/* Rotas principais */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={DashboardAdmin} />
      <Route path="/cobrador" component={Cobrador} />
      <Route path="/register" component={Register} />
      <Route path="/passageiro" component={Passageiro} />
      <Route path="/carteirinha" component={CarteirinhaIdoso} />
      <Route path="/motorista" component={Motorista} />
      <Route path="/importar-alunos" component={ImportarAlunos} />
      <Route path="/gerenciar-usuarios" component={GerenciarUsuarios} />
      <Route path="/gerenciar-onibus" component={GerenciarOnibus} />
      <Route path="/gerenciar-rotas" component={GerenciarRotas} />
      <Route path="/gerenciar-motoristas" component={GerenciarMotoristas} />
      <Route path="/gerenciar-cobradores" component={GerenciarCobradores} />
      <Route path="/relatorios" component={Relatorios} />

      {/* ✅ Rotas do pagamento */}
      <Route path="/pagamento/sucesso" component={PagamentoSucesso} />
      <Route path="/pagamento/erro" component={PagamentoErro} />
      <Route path="/pagamento/pendente" component={PagamentoPendente} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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

export default App;
