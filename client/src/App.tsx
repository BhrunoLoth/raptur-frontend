import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cobrador from "./pages/Cobrador";
import Register from "./pages/Register";
import Passageiro from "./pages/Passageiro";
import CarteirinhaIdoso from "./pages/CarteirinhaIdoso";
import Motorista from "./pages/Motorista";
import ImportarAlunos from "./pages/ImportarAlunos";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/cobrador"} component={Cobrador} />
      <Route path={"/register"} component={Register} />
      <Route path={"/passageiro"} component={Passageiro} />
      <Route path={"/carteirinha"} component={CarteirinhaIdoso} />
      <Route path={"/motorista"} component={Motorista} />
      <Route path={"/importar-alunos"} component={ImportarAlunos} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
