// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme
} from "@mui/material/styles";
import {
  CssBaseline,
  CircularProgress,
  Box,
  Alert,
  Button,
  Typography,
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import ProtectedLayout from "./components/ProtectedLayout";
import { ThemeProvider as CustomThemeProvider } from "./contexts/ThemeContext";
import ProtectedRouteByPerfil from "./routes/ProtectedRouteByPerfil";
import "./styles/RapturStyle.css";

/* ========================== Lazy Pages ========================== */
const Login = lazy(() => import("./pages/Login"));
const CadastroPassageiro = lazy(() => import("./pages/CadastroPassageiro"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const MotoristaLogin = lazy(() => import("./pages/MotoristaLogin"));
const MotoristaDashboard = lazy(() => import("./pages/MotoristaDashboard"));
const MotoristaManagement = lazy(() => import("./pages/MotoristaManagement"));
const QRCodeSimulator = lazy(() => import("./pages/QRCodeSimulator"));
const ScannerQRCode = lazy(() => import("./pages/ScannerQRCode"));
const Simulador = lazy(() => import("./pages/Simulador"));
const Embarques = lazy(() => import("./pages/Embarques"));
const Pagamentos = lazy(() => import("./pages/Pagamentos"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const OnibusManagement = lazy(() => import("./pages/OnibusManagement"));
const EmbarqueManual = lazy(() => import("./pages/EmbarqueManual"));
const DashboardVisual = lazy(() => import("./pages/DashboardVisual"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PassageiroDashboard = lazy(() => import("./pages/PassageiroDashboard"));
const RecargaPix = lazy(() => import("./pages/RecargaPix"));
const HistoricoEmbarques = lazy(() => import("./pages/HistoricoEmbarques"));
const TrocarSenha = lazy(() => import("./pages/TrocarSenha"));

/* Idosos */
const IdososList = lazy(() => import("./pages/IdososList"));
const IdososForm = lazy(() => import("./pages/IdososForm"));
const IdososView = lazy(() => import("./pages/IdososView"));

/* Validação pública via QR Code */
const CarteirinhaView = lazy(() => import("./pages/CarteirinhaView"));

/* ============================ Tema MUI ============================ */
const muiTheme = createTheme({
  palette: {
    primary: { main: "#136c3a", light: "#61d179", dark: "#0f5a2f" },
    secondary: { main: "#e07828", light: "#ffa040", dark: "#c85f1a" },
    background: { default: "#f4f6f4", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.6rem", fontWeight: 500 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8, fontWeight: 500 },
      },
    },
  },
});

/* =========================== Fallbacks =========================== */
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <CircularProgress size={40} color="success" />
    <Typography sx={{ textAlign: "center", color: "#136c3a" }}>
      Carregando...
    </Typography>
  </Box>
);

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <strong>Ops! Algo deu errado.</strong>
        <br />
        {error?.message || "Erro desconhecido"}
      </Alert>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        Tentar novamente
      </Button>
    </Box>
  );
}

// Faz o ErrorBoundary “resetar” ao trocar de rota
function WithErrorBoundary({ children }) {
  const location = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      resetKeys={[location.pathname]}
    >
      {children}
    </ErrorBoundary>
  );
}

/* ============================== App ============================== */
function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <CustomThemeProvider>
        <Router>
          <WithErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>

                {/* 🔸 Redirecionamento padrão */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 🔸 Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/motorista/login" element={<MotoristaLogin />} />
                <Route path="/cadastro" element={<CadastroPassageiro />} />
                <Route path="/validar/:id" element={<CarteirinhaView />} />

                {/* =========================== Admin =========================== */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <AdminDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <UserManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/motoristas"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <MotoristaManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/onibus"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <OnibusManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/embarques"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <Embarques />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/relatorios"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <Relatorios />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/pagamentos"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <Pagamentos />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/configuracoes"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <Configuracoes />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/dashboard-visual"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <DashboardVisual />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* 🧓 Carteirinhas do Idoso */}
                <Route
                  path="/admin/idosos"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <IdososList />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />
                <Route
                  path="/admin/idosos/novo"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <IdososForm />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />
                <Route
                  path="/admin/idosos/:id"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["admin"]}>
                      <ProtectedLayout>
                        <IdososView />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* =========================== Motorista =========================== */}
                <Route
                  path="/motorista/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["motorista"]}>
                      <ProtectedLayout>
                        <MotoristaDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />
                <Route
                  path="/motorista/scanner"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["motorista"]}>
                      <ProtectedLayout>
                        <ScannerQRCode />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* =========================== Passageiro =========================== */}
                <Route
                  path="/passageiro/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={["passageiro"]}>
                      <ProtectedLayout>
                        <PassageiroDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* =========================== Outras =========================== */}
                <Route
                  path="/trocar-senha"
                  element={
                    <ProtectedRouteByPerfil
                      perfisPermitidos={["admin", "motorista", "passageiro"]}
                    >
                      <ProtectedLayout>
                        <TrocarSenha />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* 🔸 Página 404 */}
                <Route
                  path="*"
                  element={
                    <Box sx={{ textAlign: "center", p: 4 }}>
                      <Alert severity="warning" sx={{ maxWidth: 420, margin: "auto" }}>
                        <strong>Página não encontrada</strong>
                        <br />
                        O endereço acessado não existe.
                      </Alert>
                    </Box>
                  }
                />

              </Routes>
            </Suspense>
          </WithErrorBoundary>
        </Router>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
