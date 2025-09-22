// src/pages/RecargaPix.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Divider,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import { 
  QrCode2, 
  ContentCopy, 
  CheckCircle, 
  Error,
  Refresh,
  AccountBalanceWallet
} from '@mui/icons-material';
import { 
  processarRecargaPix, 
  monitorarPagamentoPix, 
  formatarValor,
  formatarStatusPagamento 
} from '../services/pagamentoService';
import { getCurrentUser } from '../services/api';

export default function RecargaPix() {
  const [valor, setValor] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [copiaCola, setCopiaCola] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [pagamento, setPagamento] = useState(null);
  const [statusPagamento, setStatusPagamento] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(null);

  const monitorRef = useRef(null);
  const timerRef = useRef(null);
  const usuario = getCurrentUser();

  // Valores sugeridos para recarga
  const valoresSugeridos = [10, 20, 50, 100];

  useEffect(() => {
    return () => {
      // Limpar monitoramento e timers ao desmontar
      if (monitorRef.current) {
        monitorRef.current();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Calcular tempo restante para expiração
  useEffect(() => {
    if (pagamento?.expiration_date) {
      const calcularTempo = () => {
        const agora = new Date();
        const expiracao = new Date(pagamento.expiration_date);
        const diferenca = expiracao - agora;
        
        if (diferenca <= 0) {
          setTempoRestante('Expirado');
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return;
        }
        
        const minutos = Math.floor(diferenca / 60000);
        const segundos = Math.floor((diferenca % 60000) / 1000);
        setTempoRestante(`${minutos}:${segundos.toString().padStart(2, '0')}`);
      };
      
      calcularTempo();
      timerRef.current = setInterval(calcularTempo, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [pagamento?.expiration_date]);

  const handleRecarga = async () => {
    setMensagem('');
    setQrCode(null);
    setCopiaCola('');
    setPagamento(null);
    setStatusPagamento(null);

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (!valorNumerico || valorNumerico <= 0) {
      setMensagem('Digite um valor de recarga válido (maior que zero).');
      return;
    }

    if (valorNumerico > 1000) {
      setMensagem('Valor máximo para recarga é R$ 1.000,00.');
      return;
    }

    setCarregando(true);

    try {
      const resultado = await processarRecargaPix(
        valorNumerico, 
        `Recarga de créditos - ${usuario?.nome || 'Usuário'}`
      );

      if (resultado.sucesso) {
        setPagamento(resultado.pagamento);
        setQrCode(resultado.qr_code_base64);
        setCopiaCola(resultado.qr_code);
        setMensagem('PIX gerado com sucesso! Escaneie o QR Code ou copie o código.');
        
        // Iniciar monitoramento do pagamento
        iniciarMonitoramento(resultado.pagamento.id);
      }
    } catch (error) {
      console.error('❌ Erro na recarga:', error);
      setMensagem(`Erro ao gerar PIX: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const iniciarMonitoramento = (pagamentoId) => {
    setVerificando(true);
    
    monitorRef.current = monitorarPagamentoPix(
      pagamentoId,
      (status) => {
        if (status.erro) {
          console.error('Erro no monitoramento:', status.erro);
          return;
        }
        
        setStatusPagamento(status);
        
        const statusLocal = status.pagamento_local?.status;
        if (statusLocal === 'pago') {
          setMensagem('✅ Pagamento aprovado! Seu saldo foi creditado.');
          setVerificando(false);
          // Recarregar dados do usuário ou atualizar saldo
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (['falhou', 'cancelado', 'expirado'].includes(statusLocal)) {
          setMensagem(`❌ Pagamento ${statusLocal}. Tente novamente.`);
          setVerificando(false);
        }
      },
      3000 // Verificar a cada 3 segundos
    );
  };

  const copiarCodigoPixParaClipboard = async () => {
    if (!copiaCola) return;
    
    try {
      await navigator.clipboard.writeText(copiaCola);
      setMensagem('✅ Código PIX copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      setMensagem('❌ Erro ao copiar código. Tente selecionar e copiar manualmente.');
    }
  };

  const selecionarValor = (valorSugerido) => {
    setValor(valorSugerido.toString());
  };

  const resetarFormulario = () => {
    setValor('');
    setQrCode(null);
    setCopiaCola('');
    setPagamento(null);
    setStatusPagamento(null);
    setMensagem('');
    setVerificando(false);
    
    if (monitorRef.current) {
      monitorRef.current();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalanceWallet />
        Recarga via PIX
      </Typography>

      {/* Saldo atual */}
      {usuario?.saldo_credito !== undefined && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Saldo atual:</strong> {formatarValor(parseFloat(usuario.saldo_credito) || 0)}
        </Alert>
      )}

      <Card>
        <CardContent>
          {/* Formulário de recarga */}
          {!pagamento && (
            <>
              <Typography variant="h6" gutterBottom>
                Valor da Recarga
              </Typography>
              
              {/* Valores sugeridos */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Valores sugeridos:
                </Typography>
                <Grid container spacing={1}>
                  {valoresSugeridos.map((valorSugerido) => (
                    <Grid item key={valorSugerido}>
                      <Chip
                        label={formatarValor(valorSugerido)}
                        onClick={() => selecionarValor(valorSugerido)}
                        variant={valor === valorSugerido.toString() ? 'filled' : 'outlined'}
                        color="primary"
                        clickable
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <TextField
                fullWidth
                label="Valor (R$)"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                type="number"
                inputProps={{ min: 0.01, max: 1000, step: 0.01 }}
                sx={{ mb: 2 }}
                helperText="Valor mínimo: R$ 0,01 | Valor máximo: R$ 1.000,00"
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleRecarga}
                disabled={carregando || !valor}
                startIcon={carregando ? <CircularProgress size={20} /> : <QrCode2 />}
                size="large"
              >
                {carregando ? 'Gerando PIX...' : 'Gerar PIX'}
              </Button>
            </>
          )}

          {/* QR Code e informações do pagamento */}
          {pagamento && (
            <>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  PIX Gerado - {formatarValor(pagamento.valor)}
                </Typography>
                
                {tempoRestante && (
                  <Chip
                    label={`Expira em: ${tempoRestante}`}
                    color={tempoRestante === 'Expirado' ? 'error' : 'warning'}
                    sx={{ mb: 2 }}
                  />
                )}
              </Box>

              {/* QR Code */}
              {qrCode && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Paper elevation={2} sx={{ p: 2, display: 'inline-block' }}>
                    <img
                      src={`data:image/png;base64,${qrCode}`}
                      alt="QR Code PIX"
                      style={{ maxWidth: '200px', width: '100%' }}
                    />
                  </Paper>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Escaneie com o app do seu banco
                  </Typography>
                </Box>
              )}

              {/* Código copia e cola */}
              {copiaCola && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Ou copie o código PIX:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={copiaCola}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <Button
                          onClick={copiarCodigoPixParaClipboard}
                          startIcon={<ContentCopy />}
                          size="small"
                        >
                          Copiar
                        </Button>
                      )
                    }}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}

              {/* Status do pagamento */}
              {verificando && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    Aguardando pagamento...
                  </Box>
                </Alert>
              )}

              {statusPagamento && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Status do pagamento:
                  </Typography>
                  {(() => {
                    const status = formatarStatusPagamento(statusPagamento.pagamento_local?.status);
                    return (
                      <Chip
                        label={`${status.icone} ${status.texto}`}
                        color={status.cor}
                        variant="filled"
                      />
                    );
                  })()}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                onClick={resetarFormulario}
                startIcon={<Refresh />}
              >
                Nova Recarga
              </Button>
            </>
          )}

          {/* Mensagens */}
          {mensagem && (
            <Alert 
              severity={
                mensagem.includes('✅') ? 'success' : 
                mensagem.includes('❌') ? 'error' : 'info'
              } 
              sx={{ mt: 2 }}
            >
              {mensagem}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Como funciona?
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Digite o valor que deseja recarregar</li>
              <li>Clique em "Gerar PIX" para criar o código de pagamento</li>
              <li>Escaneie o QR Code com o app do seu banco ou copie o código PIX</li>
              <li>Realize o pagamento no seu banco</li>
              <li>O saldo será creditado automaticamente após a confirmação</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
