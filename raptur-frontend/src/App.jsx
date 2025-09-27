import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box, Alert } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

// Componentes essenciais (carregamento imediato)
import PublicLayout from './components/PublicLayout';
import ProtectedLayout from './components/ProtectedLayout';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import ProtectedRouteByPerfil from './routes/ProtectedRouteByPerfil';

// Páginas com lazy loading para otimização
const Login = lazy(() => import('./pages/Login'));
const CadastroPassageiro = lazy(() => import('./pages/CadastroPassageiro'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const MotoristaLogin = lazy(() => import('./pages/MotoristaLogin'));
const MotoristaDashboard = lazy(() => import('./pages/MotoristaDashboard'));
const MotoristaManagement = lazy(() => import('./pages/MotoristaManagement'));
const QRCodeSimulator = lazy(() => import('./pages/QRCodeSimulator'));
const ScannerQRCode = lazy(() => import('./pages/ScannerQRCode'));
const Simulador = lazy(() => import('./pages/Simulador'));
const Embarques = lazy(() => import('./pages/Embarques'));
const Pagamentos = lazy(() => import('./pages/Pagamentos'));
const Relatorios = lazy(() => import('./pages/Relatorios'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const OnibusManagement = lazy(() => import('./pages/OnibusManagement'));
const EmbarqueManual = lazy(() => import('./pages/EmbarqueManual'));
const DashboardVisual = lazy(() => import('./pages/DashboardVisual'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PassageiroDashboard = lazy(() => import('./pages/PassageiroDashboard'));
const RecargaPix = lazy(() => import('./pages/RecargaPix'));
const HistoricoEmbarques = lazy(() => import('./pages/HistoricoEmbarques'));
const TrocarSenha = lazy(() => import('./pages/TrocarSenha'));
const IdososList = lazy(() => import('./pages/IdososList'));
const IdososForm = lazy(() => import('./pages/IdososForm'));
const IdososView = lazy(() => import('./pages/IdososView'));

import './styles/RapturStyle.css';

// Tema Material-UI personalizado
const muiTheme = createTheme({
  palette: {
    primary: { main: '#61d179', light: '#8ee99f', dark: '#4fc66b' },
    secondary: { main: '#e07828', light: '#ff9800', dark: '#d84315' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8, fontWeight: 500 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, boxShadow: '0px 6px 25px rgba(0,0,0,.15)' } } },
  },
});

// Loading
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
    <CircularProgress size={40} />
    <Box sx={{ textAlign: 'center' }}>Carregando...</Box>
  </Box>
);

// Error Boundary
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      <strong>Ops! Algo deu errado:</strong><br />
      {error.message}
    </Alert>
    <button onClick={resetErrorBoundary}>Tentar novamente</button>
  </Box>
);

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => console.error('Erro capturado pelo Error Boundary:', error, info)}
    >
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <CustomThemeProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* REDIRECT RAIZ */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* ROTAS PÚBLICAS */}
                <Route
                  path="/login"
                  element={
                    <PublicLayout>
                      <Login />
                    </PublicLayout>
                  }
                />

                <Route
                  path="/motorista/login"
                  element={
                    <PublicLayout>
                      <MotoristaLogin />
                    </PublicLayout>
                  }
                />

                <Route
                  path="/cadastro"
                  element={
                    <PublicLayout>
                      <CadastroPassageiro />
                    </PublicLayout>
                  }
                />

                {/* ALIAS PARA DASHBOARD GENÉRICO */}
                <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

                {/* ROTAS PROTEGIDAS - ADMIN */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <AdminDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <AdminDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <UserManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/motoristas"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <MotoristaManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/onibus"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <OnibusManagement />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/embarques"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <Embarques />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/pagamentos"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <Pagamentos />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/relatorios"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <Relatorios />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/configuracoes"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <Configuracoes />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/idosos"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <IdososList />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/idosos/novo"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <IdososForm />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/admin/idosos/:id"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <IdososView />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* ROTAS PROTEGIDAS - MOTORISTA */}
                <Route
                  path="/motorista"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['motorista']}>
                      <ProtectedLayout>
                        <MotoristaDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/motorista/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['motorista']}>
                      <ProtectedLayout>
                        <MotoristaDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/motorista/scanner"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['motorista']}>
                      <ProtectedLayout>
                        <ScannerQRCode />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/motorista/embarque-manual"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['motorista']}>
                      <ProtectedLayout>
                        <EmbarqueManual />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/motorista/historico"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['motorista']}>
                      <ProtectedLayout>
                        <HistoricoEmbarques />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* ROTAS PROTEGIDAS - PASSAGEIRO */}
                <Route
                  path="/passageiro"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['passageiro']}>
                      <ProtectedLayout>
                        <PassageiroDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/passageiro/dashboard"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['passageiro']}>
                      <ProtectedLayout>
                        <PassageiroDashboard />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/passageiro/qrcode"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['passageiro']}>
                      <ProtectedLayout>
                        <QRCodeSimulator />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/passageiro/recarga"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['passageiro']}>
                      <ProtectedLayout>
                        <RecargaPix />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/passageiro/historico"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['passageiro']}>
                      <ProtectedLayout>
                        <HistoricoEmbarques />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* ROTAS COMPARTILHADAS */}
                <Route
                  path="/trocar-senha"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin', 'motorista', 'passageiro']}>
                      <ProtectedLayout>
                        <TrocarSenha />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/dashboard-visual"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin', 'motorista']}>
                      <ProtectedLayout>
                        <DashboardVisual />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                <Route
                  path="/simulador"
                  element={
                    <ProtectedRouteByPerfil perfisPermitidos={['admin']}>
                      <ProtectedLayout>
                        <Simulador />
                      </ProtectedLayout>
                    </ProtectedRouteByPerfil>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <PublicLayout>
                      <Box sx={{ textAlign: 'center', p: 4 }}>
                        <Alert severity="warning">
                          <strong>Página não encontrada</strong><br />
                          A página que você está procurando não existe.
                        </Alert>
                      </Box>
                    </PublicLayout>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </CustomThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
