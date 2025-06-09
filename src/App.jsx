// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 📄 Páginas
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

// 🧱 Layouts e Contextos
import Sidebar from './components/Sidebar';
import SidebarPassageiro from './components/SidebarPassageiro';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRouteByPerfil from './routes/ProtectedRouteByPerfil';

import './styles/RapturStyle.css';

// Layout Admin/Motorista
function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

// Layout Passageiro
function PassageiroLayout({ children }) {
  return (
    <div className="flex">
      <SidebarPassageiro />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* 🔓 Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroPassageiro />} />
          <Route path="/motorista/login" element={<MotoristaLogin />} />

          {/* 🔐 Admin */}
          <Route path="/dashboard" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><AdminDashboard /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/usuarios" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><UserManagement /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/motoristas" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><MotoristaManagement /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/onibus" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><OnibusManagement /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/viagens" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><Simulador /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/pagamentos" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><Pagamentos /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/embarques" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><Embarques /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/relatorios" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><Relatorios /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/painel-visual" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><DashboardVisual /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/configuracoes" element={
            <ProtectedRouteByPerfil permitido={['admin']}>
              <MainLayout><Configuracoes /></MainLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* 🔐 Motorista */}
          <Route path="/motorista/dashboard" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <MainLayout><MotoristaDashboard /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/qrcodesimulator" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <MainLayout><QRCodeSimulator /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/scannerqrcode" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <MainLayout><ScannerQRCode /></MainLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/embarque-manual" element={
            <ProtectedRouteByPerfil permitido={['motorista']}>
              <MainLayout><EmbarqueManual /></MainLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* 👤 Passageiro */}
          <Route path="/passageiro/dashboard" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <PassageiroLayout><PassageiroDashboard /></PassageiroLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/passageiro/recarga" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <PassageiroLayout><RecargaPix /></PassageiroLayout>
            </ProtectedRouteByPerfil>
          } />
          <Route path="/passageiro/historico" element={
            <ProtectedRouteByPerfil permitido={['passageiro']}>
              <PassageiroLayout><HistoricoEmbarques /></PassageiroLayout>
            </ProtectedRouteByPerfil>
          } />

          {/* 🧭 Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;










