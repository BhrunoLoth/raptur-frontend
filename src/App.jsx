import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Páginas
import Login from './pages/Login';
import CadastroPassageiro from './pages/CadastroPassageiro';
import UserManagement from './pages/UserManagement';
import MotoristaLogin from './pages/MotoristaLogin';
import MotoristaDashboard from './pages/MotoristaDashboard';
import MotoristaManagement from './pages/MotoristaManagement';
import QRCodeSimulator from './pages/QRCodeSimulator';
import ScannerQRCode from './pages/ScannerQRCode';
import Simulador from './pages/Simulador';
import Embarques from './pages/Embarques';
import Pagamentos from './pages/Pagamentos';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import OnibusManagement from './pages/OnibusManagement';
import EmbarqueManual from './pages/EmbarqueManual';
import DashboardVisual from './pages/DashboardVisual';
import AdminDashboard from './pages/AdminDashboard';
import PassageiroDashboard from './pages/PassageiroDashboard';
import RecargaPix from './pages/RecargaPix';
import HistoricoEmbarques from './pages/HistoricoEmbarques';
import TrocarSenha from './pages/TrocarSenha';

// Layouts e Contextos
import PublicLayout from './components/PublicLayout';
import ProtectedLayout from './components/ProtectedLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRouteByPerfil from './routes/ProtectedRouteByPerfil';

import './styles/RapturStyle.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/cadastro" element={
            <PublicLayout>
              <CadastroPassageiro />
            </PublicLayout>
          } />
          <Route path="/motorista/login" element={
            <PublicLayout>
              <MotoristaLogin />
            </PublicLayout>
          } />
          <Route path="/trocar-senha" element={
            <PublicLayout>
              <TrocarSenha />
            </PublicLayout>
          } />

          {/* ROTAS PROTEGIDAS (apenas UM ProtectedLayout aqui) */}
          <Route
            element={
              <ProtectedRouteByPerfil permitido={['admin', 'motorista', 'passageiro']}>
                <ProtectedLayout>
                  <Outlet />
                </ProtectedLayout>
              </ProtectedRouteByPerfil>
            }
          >
            {/* Rotas ADMIN */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/usuarios" element={<UserManagement />} />
            <Route path="/motoristas" element={<MotoristaManagement />} />
            <Route path="/onibus" element={<OnibusManagement />} />
            <Route path="/viagens" element={<Simulador />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/embarques" element={<Embarques />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/painel-visual" element={<DashboardVisual />} />
            <Route path="/configuracoes" element={<Configuracoes />} />

            {/* Rotas MOTORISTA */}
            <Route path="/motorista/dashboard" element={<MotoristaDashboard />} />
            <Route path="/motorista/embarques" element={<Embarques />} />
            <Route path="/motorista/historico-embarques" element={<HistoricoEmbarques />} />
            <Route path="/qrcodesimulator" element={<QRCodeSimulator />} />
            <Route path="/scannerqrcode" element={<ScannerQRCode />} />
            <Route path="/embarque-manual" element={<EmbarqueManual />} />

            {/* Rotas PASSAGEIRO */}
            <Route path="/passageiro/dashboard" element={<PassageiroDashboard />} />
            <Route path="/passageiro/recarga" element={<RecargaPix />} />
            <Route path="/passageiro/historico" element={<HistoricoEmbarques />} />
          </Route>

          {/* Fallback para rotas desconhecidas */}
          <Route path="*" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
