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
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./routes/PrivateRoute";

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
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/motorista/login" element={<MotoristaLogin />} />

          {/* Rotas protegidas com PrivateRoute */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute>
                <MainLayout>
                  <UserManagement />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/motoristas"
            element={
              <PrivateRoute>
                <MainLayout>
                  <MotoristaManagement />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/motorista/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <MotoristaDashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pagamentos"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Pagamentos />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/embarques"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Embarques />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Relatorios />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Configuracoes />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/qrcodesimulator"
            element={
              <PrivateRoute>
                <MainLayout>
                  <QRCodeSimulator />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/scannerqrcode"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ScannerQRCode />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/simulador"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Simulador />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/onibus"
            element={
              <PrivateRoute>
                <MainLayout>
                  <OnibusManagement />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/embarque-manual"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EmbarqueManual />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;





