// src/components/QRCodeScanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from '@mui/material';
import {
  QrCodeScanner,
  CameraAlt,
  CheckCircle,
  Error,
  Person,
  DirectionsBus
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { processarEmbarqueQR, formatarEmbarque } from '../services/embarqueService';

export default function QRCodeScanner({ 
  onEmbarqueProcessado, 
  viagemAtiva = null, 
  onibusAtivo = null 
}) {
  const [scanner, setScanner] = useState(null);
  const [escaneando, setEscaneando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const scannerRef = useRef(null);
  const scannerElementId = 'qr-scanner';

  useEffect(() => {
    return () => {
      // Limpar scanner ao desmontar componente
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const iniciarScanner = () => {
    if (!viagemAtiva || !onibusAtivo) {
      setErro('Viagem e ônibus devem estar selecionados para escanear QR Codes');
      return;
    }

    setErro('');
    setResultado(null);
    setEscaneando(true);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
      supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA]
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerElementId,
      config,
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        // Sucesso no scan
        html5QrcodeScanner.clear();
        setEscaneando(false);
        processarQRCode(decodedText);
      },
      (error) => {
        // Erro no scan (normal durante o processo)
        console.debug('Erro de scan (normal):', error);
      }
    );

    setScanner(html5QrcodeScanner);
  };

  const pararScanner = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
      setScanner(null);
    }
    setEscaneando(false);
  };

  const processarQRCode = async (qrCodeData) => {
    setProcessando(true);
    setErro('');

    try {
      const resultado = await processarEmbarqueQR(
        qrCodeData,
        onibusAtivo.id,
        viagemAtiva.id
      );

      if (resultado.sucesso) {
        setResultado({
          ...resultado,
          embarque_formatado: formatarEmbarque(resultado.embarque)
        });
        setDialogAberto(true);
        
        if (onEmbarqueProcessado) {
          onEmbarqueProcessado(resultado);
        }
      } else {
        setErro(resultado.mensagem || 'Erro ao processar embarque');
      }
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      setErro(`Erro ao processar QR Code: ${error.message}`);
    } finally {
      setProcessando(false);
    }
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setResultado(null);
  };

  const escanearNovamente = () => {
    fecharDialog();
    setTimeout(() => iniciarScanner(), 500);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeScanner />
            Scanner QR Code
          </Typography>

          {/* Informações da viagem/ônibus */}
          {(viagemAtiva || onibusAtivo) && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              {viagemAtiva && (
                <Typography variant="body2">
                  <strong>Viagem:</strong> {viagemAtiva.origem} → {viagemAtiva.destino}
                </Typography>
              )}
              {onibusAtivo && (
                <Typography variant="body2">
                  <strong>Ônibus:</strong> {onibusAtivo.placa} ({onibusAtivo.modelo})
                </Typography>
              )}
            </Box>
          )}

          {/* Área do scanner */}
          {!escaneando && !processando && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CameraAlt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Clique no botão abaixo para iniciar o scanner
              </Typography>
              <Button
                variant="contained"
                onClick={iniciarScanner}
                startIcon={<QrCodeScanner />}
                size="large"
                disabled={!viagemAtiva || !onibusAtivo}
              >
                Iniciar Scanner
              </Button>
              
              {(!viagemAtiva || !onibusAtivo) && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  Selecione uma viagem e ônibus antes de escanear
                </Typography>
              )}
            </Box>
          )}

          {/* Scanner ativo */}
          {escaneando && (
            <Box>
              <Box id={scannerElementId} sx={{ mb: 2 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={pararScanner}
                  color="error"
                >
                  Parar Scanner
                </Button>
              </Box>
            </Box>
          )}

          {/* Processando */}
          {processando && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1">
                Processando embarque...
              </Typography>
            </Box>
          )}

          {/* Mensagem de erro */}
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {erro}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog de resultado */}
      <Dialog
        open={dialogAberto}
        onClose={fecharDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle color="success" />
          Embarque Processado
        </DialogTitle>
        
        <DialogContent>
          {resultado && (
            <Box>
              {/* Informações do usuário */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person />
                  {resultado.usuario.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {resultado.usuario.email}
                </Typography>
                {resultado.usuario.subtipo_passageiro && (
                  <Chip
                    label={formatarSubtipo(resultado.usuario.subtipo_passageiro)}
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Informações do embarque */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Detalhes do Embarque
                </Typography>
                
                <Typography variant="body2">
                  <strong>Valor:</strong> {resultado.embarque_formatado?.valor_formatado || 'R$ 0,00'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Tipo:</strong> {resultado.embarque_formatado?.tipo_formatado?.texto || 'Normal'}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Data/Hora:</strong> {resultado.embarque_formatado?.data_formatada || new Date().toLocaleString('pt-BR')}
                </Typography>

                {resultado.usuario.saldo_credito !== undefined && (
                  <Typography variant="body2">
                    <strong>Saldo Restante:</strong> R$ {(parseFloat(resultado.usuario.saldo_credito) || 0).toFixed(2)}
                  </Typography>
                )}
              </Box>

              {/* Mensagem de sucesso */}
              <Alert severity="success" sx={{ mt: 2 }}>
                {resultado.mensagem}
              </Alert>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={fecharDialog}>
            Fechar
          </Button>
          <Button onClick={escanearNovamente} variant="contained">
            Escanear Próximo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/**
 * Formatar subtipo de passageiro
 */
function formatarSubtipo(subtipo) {
  const subtipos = {
    'aluno_gratuito': 'Estudante Gratuito',
    'aluno_pagante': 'Estudante',
    'idoso': 'Idoso',
    'comum': 'Comum'
  };
  
  return subtipos[subtipo] || subtipo;
}
