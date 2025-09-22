// src/components/QRCodeEmbarque.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper
} from '@mui/material';
import {
  QrCode2,
  Refresh,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import QRCode from 'qrcode.react';
import { gerarQRCodeEmbarque } from '../services/embarqueService';
import { getCurrentUser } from '../services/api';

export default function QRCodeEmbarque({ onQRCodeGerado, autoRefresh = true }) {
  const [qrCode, setQrCode] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [tempoRestante, setTempoRestante] = useState(null);
  const [expirado, setExpirado] = useState(false);

  const usuario = getCurrentUser();

  useEffect(() => {
    if (usuario) {
      gerarNovoQRCode();
    }
  }, [usuario]);

  // Timer para atualizar tempo restante
  useEffect(() => {
    if (!qrCode) return;

    const interval = setInterval(() => {
      try {
        const dados = JSON.parse(qrCode);
        const agora = Date.now();
        const validoAte = dados.valido_ate;
        const diferenca = validoAte - agora;

        if (diferenca <= 0) {
          setExpirado(true);
          setTempoRestante('Expirado');
          if (autoRefresh) {
            setTimeout(() => gerarNovoQRCode(), 1000);
          }
        } else {
          setExpirado(false);
          const segundos = Math.floor(diferenca / 1000);
          const minutos = Math.floor(segundos / 60);
          const segsRestantes = segundos % 60;
          setTempoRestante(`${minutos}:${segsRestantes.toString().padStart(2, '0')}`);
        }
      } catch (error) {
        console.error('Erro ao calcular tempo restante:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCode, autoRefresh]);

  const gerarNovoQRCode = async () => {
    if (!usuario?.id) {
      setErro('Usuário não identificado');
      return;
    }

    setCarregando(true);
    setErro('');
    setExpirado(false);

    try {
      const novoQRCode = await gerarQRCodeEmbarque(usuario.id);
      setQrCode(novoQRCode);
      
      if (onQRCodeGerado) {
        onQRCodeGerado(novoQRCode);
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      setErro('Erro ao gerar QR Code. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const obterCorStatus = () => {
    if (expirado) return 'error';
    if (tempoRestante && parseInt(tempoRestante.split(':')[0]) < 1) return 'warning';
    return 'success';
  };

  const obterTextoStatus = () => {
    if (expirado) return 'QR Code Expirado';
    if (tempoRestante) return `Válido por: ${tempoRestante}`;
    return 'Gerando...';
  };

  if (!usuario) {
    return (
      <Alert severity="error">
        Usuário não autenticado. Faça login para gerar o QR Code.
      </Alert>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <QrCode2 />
          QR Code para Embarque
        </Typography>

        {/* Informações do usuário */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {usuario.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {usuario.email}
          </Typography>
          {usuario.subtipo_passageiro && (
            <Chip
              label={formatarSubtipo(usuario.subtipo_passageiro)}
              size="small"
              color="primary"
              sx={{ mt: 1 }}
            />
          )}
        </Box>

        {/* Status do QR Code */}
        {(tempoRestante || carregando) && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={expirado ? <AccessTime /> : <CheckCircle />}
              label={obterTextoStatus()}
              color={obterCorStatus()}
              variant={expirado ? 'outlined' : 'filled'}
            />
          </Box>
        )}

        {/* QR Code */}
        {carregando ? (
          <Box sx={{ py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Gerando QR Code...
            </Typography>
          </Box>
        ) : qrCode && !expirado ? (
          <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'inline-block' }}>
            <QRCode
              value={qrCode}
              size={200}
              level="M"
              includeMargin={true}
            />
          </Paper>
        ) : (
          <Box sx={{ py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {expirado ? 'QR Code expirado' : 'QR Code não disponível'}
            </Typography>
          </Box>
        )}

        {/* Instruções */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Apresente este QR Code ao motorista para embarcar
        </Typography>

        {/* Botão de atualizar */}
        <Button
          variant={expirado ? 'contained' : 'outlined'}
          onClick={gerarNovoQRCode}
          disabled={carregando}
          startIcon={carregando ? <CircularProgress size={16} /> : <Refresh />}
          color={expirado ? 'primary' : 'inherit'}
        >
          {expirado ? 'Gerar Novo QR Code' : 'Atualizar'}
        </Button>

        {/* Mensagem de erro */}
        {erro && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {erro}
          </Alert>
        )}

        {/* Informações adicionais */}
        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            • QR Code válido por 5 minutos<br/>
            • Renovação automática quando expira<br/>
            • Mantenha a tela ligada durante o embarque
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Formatar subtipo de passageiro para exibição
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
