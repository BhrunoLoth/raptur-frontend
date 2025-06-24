import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Typography, Button, Box, Alert } from "@mui/material";
import axios from "axios";

const ScannerQRCode = () => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => codeReaderRef.current?.reset();
  }, []);

  const startScan = async () => {
    setMensagem(null);
    setScanning(true);

    try {
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      const selectedDeviceId = devices[0]?.deviceId;
      if (!selectedDeviceId) throw new Error("Nenhuma câmera encontrada");

      codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        async (result, error, controls) => {
          if (result) {
            const texto = result.getText();
            controls.stop();
            setScanning(false);
            await validarQRCode(texto);
          }

          if (error && error.name !== "NotFoundException") {
            console.warn("Erro de leitura:", error);
          }
        }
      );
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setMensagem("⚠️ Erro ao acessar câmera.");
      setScanning(false);
    }
  };

  const validarQRCode = async (qrCode) => {
    try {
      const token = localStorage.getItem("token");
      const onibusId = localStorage.getItem("onibusId");

      const { data } = await axios.post(
        "/api/validacao",
        { qrCode, onibusId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem(`✅ ${data.mensagem}`);
    } catch (err) {
      console.warn("🔌 Falha online, fallback local:", err.message);
      fallbackOffline(qrCode);
    }
  };

  const fallbackOffline = (qrCode) => {
    try {
      const passageiros = JSON.parse(localStorage.getItem("passageirosQR")) || [];
      const passageiro = passageiros.find((p) => p.qrCode === qrCode);

      if (!passageiro) {
        setMensagem("❌ Passageiro não encontrado offline");
        return;
      }

      const embarques = JSON.parse(localStorage.getItem("embarquesPendentes")) || [];
      const hoje = new Date().toISOString().split("T")[0];

      const embarquesHoje = embarques.filter(
        (e) => e.data.startsWith(hoje) && e.usuario_id === passageiro.id
      );

      if (
        passageiro.subtipo_passageiro === "aluno_gratuito" &&
        embarquesHoje.length >= 2
      ) {
        setMensagem("⚠️ Limite diário excedido (aluno gratuito)");
        return;
      }

      const novoEmbarque = {
        usuario_id: passageiro.id,
        nome: passageiro.nome,
        data: new Date().toISOString(),
        veiculo_id: localStorage.getItem("onibusId") || null,
        status: "pendente",
        offline: true
      };

      localStorage.setItem(
        "embarquesPendentes",
        JSON.stringify([...embarques, novoEmbarque])
      );

      setMensagem(`🟢 Embarque offline registrado para ${passageiro.nome}`);
    } catch (err) {
      console.error("Erro no fallback:", err);
      setMensagem("❌ Erro inesperado na validação offline");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        📷 Validação por QR Code
      </Typography>

      <video ref={videoRef} style={{ width: "100%", maxWidth: "500px" }} />

      <Box mt={2} display="flex" gap={2}>
        <Button
          variant="contained"
          color="success"
          onClick={startScan}
          disabled={scanning}
        >
          ▶️ Iniciar
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            codeReaderRef.current?.reset();
            setScanning(false);
            setMensagem(null);
          }}
          disabled={!scanning}
        >
          ⏹️ Parar
        </Button>
      </Box>

      {mensagem && (
        <Box mt={2}>
          <Alert
            severity={
              mensagem.startsWith("✅") || mensagem.startsWith("🟢")
                ? "success"
                : mensagem.startsWith("⚠️")
                ? "warning"
                : "error"
            }
          >
            {mensagem}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default ScannerQRCode;
