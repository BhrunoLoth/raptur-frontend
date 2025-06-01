import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import MotoristaLogin from "./pages/MotoristaLogin";
import MotoristaDashboard from "./pages/MotoristaDashboard";
import MotoristaManagement from "./pages/MotoristaManagement";
import QRCodeSimulator from "./pages/QRCodeSimulator";
import ScannerQRCode from "./pages/ScannerQRCode";
import Simulador from "./pages/Simulador";
import Embarques from "./pages/Embarques";
import Pagamentos from "./pages/Pagamentos";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import OnibusManagement from "./pages/OnibusManagement";
import EmbarqueManual from "./pages/EmbarqueManual";

import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout"; // ✅ CORRIGIDO
import { ThemeProvider } from "./contexts/ThemeContext";

import "./styles/RapturStyle.css";

function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/motorista/login" element={<MotoristaLogin />} />

          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/usuarios" element={<MainLayout><UserManagement /></MainLayout>} />
          <Route path="/motoristas" element={<MainLayout><MotoristaManagement /></MainLayout>} />
          <Route path="/motorista/dashboard" element={<MainLayout><MotoristaDashboard /></MainLayout>} />
          <Route path="/pagamentos" element={<MainLayout><Pagamentos /></MainLayout>} />
          <Route path="/embarques" element={<MainLayout><Embarques /></MainLayout>} />
          <Route path="/relatorios" element={<MainLayout><Relatorios /></MainLayout>} />
          <Route path="/configuracoes" element={<MainLayout><Configuracoes /></MainLayout>} />
          <Route path="/qrcodesimulator" element={<MainLayout><QRCodeSimulator /></MainLayout>} />
          <Route path="/scannerqrcode" element={<MainLayout><ScannerQRCode /></MainLayout>} />
          <Route path="/simulador" element={<MainLayout><Simulador /></MainLayout>} />
          <Route path="/onibus" element={<MainLayout><OnibusManagement /></MainLayout>} />
          <Route path="/embarque-manual" element={<MainLayout><EmbarqueManual /></MainLayout>} />

          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;




