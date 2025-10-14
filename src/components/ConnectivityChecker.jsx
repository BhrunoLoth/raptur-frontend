// src/components/ConnectivityChecker.jsx
import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Box, Typography, Button } from '@mui/material';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';
import { checkApiHealth } from '../services/api';

export default function ConnectivityChecker({ children }) {
  const [online, setOnline] = useState(navigator.onLine);
  const [apiOnline, setApiOnline] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [checking, setChecking] = useState(false);

  // Verificar conectividade da API
  const verificarAPI = async () => {
    setChecking(true);
    try {
      const isOnline = await checkApiHealth();
      setApiOnline(isOnline);
      
      if (!isOnline && online) {
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Erro ao verificar API:', error);
      setApiOnline(false);
      if (online) {
        setShowAlert(true);
      }
    } finally {
      setChecking(false);
    }
  };

  // Monitorar conectividade de rede
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowAlert(false);
      // Verificar API quando voltar online
      setTimeout(verificarAPI, 1000);
    };

    const handleOffline = () => {
      setOnline(false);
      setApiOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificação inicial da API
    verificarAPI();

    // Verificação periódica da API (a cada 30 segundos)
    const interval = setInterval(verificarAPI, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Determinar status geral
  const isConnected = online && apiOnline;
  const shouldShowAlert = !isConnected && showAlert;

  return (
    <>
      {children}
      
      {/* Alerta de conectividade */}
      <Snackbar
        open={shouldShowAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={<WifiOff />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={verificarAPI}
              disabled={checking}
              startIcon={<Refresh />}
            >
              {checking ? 'Verificando...' : 'Tentar Novamente'}
            </Button>
          }
          onClose={() => setShowAlert(false)}
        >
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {!online ? 'Sem conexão com a internet' : 'Servidor indisponível'}
            </Typography>
            <Typography variant="caption">
              {!online 
                ? 'Verifique sua conexão de rede'
                : 'O servidor está temporariamente indisponível'
              }
            </Typography>
          </Box>
        </Alert>
      </Snackbar>

      {/* Indicador de status na parte inferior (opcional) */}
      {!isConnected && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'error.main',
            color: 'error.contrastText',
            p: 1,
            textAlign: 'center',
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <WifiOff fontSize="small" />
          <Typography variant="body2">
            {!online ? 'Offline' : 'Servidor indisponível'}
          </Typography>
        </Box>
      )}
    </>
  );
}
