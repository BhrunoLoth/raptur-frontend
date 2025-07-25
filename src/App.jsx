import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
          {/* ROTAS PÚBLICAS: SEMPRE DENTRO DE PublicLayout */}
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

          {/* ROTAS ADMIN (Protegidas): SEMPRE DENTRO DE ProtectedLayout */}
          <Route path="/dashboard" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/usuarios" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <UserManagement />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/motoristas" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <MotoristaManagement />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/onibus" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <OnibusManagement />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/viagens" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <Simulador />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/pagamentos" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <Pagamentos />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/embarques" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <Embarques />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/relatorios" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <Relatorios />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/painel-visual" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <DashboardVisual />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/configuracoes" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <ProtectedLayout>
                <Configuracoes />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* ROTAS MOTORISTA */}
          <Route path="/motorista/dashboard" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <MotoristaDashboard />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/motorista/embarques" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <Embarques />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/motorista/historico-embarques" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <HistoricoEmbarques />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/qrcodesimulator" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <QRCodeSimulator />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/scannerqrcode" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <ScannerQRCode />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/embarque-manual" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <ProtectedLayout>
                <EmbarqueManual />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* ROTAS PASSAGEIRO */}
          <Route path="/passageiro/dashboard" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <ProtectedLayout>
                <PassageiroDashboard />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/passageiro/recarga" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <ProtectedLayout>
                <RecargaPix />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/passageiro/historico" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <ProtectedLayout>
                <HistoricoEmbarques />
              </ProtectedLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* Fallback: tudo que não for reconhecido */}
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
