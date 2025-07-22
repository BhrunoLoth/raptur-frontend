import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent,
  Divider, Stack
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = import.meta.env.VITE_API_URL;

const OnibusManagement = () => {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [onibus, setOnibus] = useState([]);
  const [erro, setErro] = useState('');
  const [criando, setCriando] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOnibus = async () => {
    try {
      const res = await axios.get(`${API_URL}/onibus`, { headers });
      setOnibus(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setErro("Erro ao carregar ônibus.");
      console.error("Erro ao carregar ônibus:", error);
    }
  };

  const handleCreate = async () => {
    setErro('');
    // Validação básica
    if (!placa.trim() || placa.length < 6) {
      setErro("Digite uma placa válida (mínimo 6 caracteres).");
      return;
    }
    if (!modelo.trim()) {
      setErro("Informe o modelo do ônibus.");
      return;
    }
    if (!capacidade || isNaN(capacidade) || parseInt(capacidade) < 1) {
      setErro("Capacidade deve ser um número inteiro positivo.");
      return;
    }

    try {
      setCriando(true);
      await axios.post(`${API_URL}/onibus`, {
        placa: placa.trim().toUpperCase(),
        modelo: modelo.trim(),
        capacidade: parseInt(capacidade)
      }, { headers });
      setPlaca('');
      setModelo('');
      setCapacidade('');
      await fetchOnibus();
    } catch (error) {
      setErro("Erro ao criar ônibus. Placa pode já estar cadastrada.");
    } finally {
      setCriando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este ônibus?")) return;
    try {
      await axios.delete(`${API_URL}/onibus/${id}`, { headers });
      await fetchOnibus();
    } catch (error) {
      setErro("Erro ao deletar ônibus.");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Ônibus Cadastrados", 14, 16);
    doc.autoTable({
      startY: 22,
      head: [["Placa", "Modelo", "Capacidade"]],
      body: onibus.map((o) => [o.placa, o.modelo, o.capacidade]),
    });
    doc.save("onibus.pdf");
  };

  const exportarCSV = () => {
    const header = ["Placa", "Modelo", "Capacidade"];
    const rows = onibus.map((o) => [o.placa, o.modelo, o.capacidade]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    // BOM para Excel
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "onibus.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOnibus();
    // eslint-disable-next-line
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚌 Gestão de Ônibus
      </Typography>

      <Card sx={{ mb: 4, backgroundColor: '#f5f5f5', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cadastrar Novo Ônibus
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 8 }}
            />
            <TextField
              label="Modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              fullWidth
            />
            <TextField
              label="Capacidade"
              type="number"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              fullWidth
              inputProps={{ min: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ minWidth: '150px' }}
              disabled={criando}
            >
              {criando ? 'Criando...' : 'Criar'}
            </Button>
          </Stack>
          {erro && <Typography mt={2} color="error">{erro}</Typography>}
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">🗂️ Ônibus Cadastrados</Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={exportarPDF} variant="outlined">📄 Exportar PDF</Button>
          <Button onClick={exportarCSV} variant="outlined">📑 Exportar CSV</Button>
        </Stack>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#004225' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Placa</TableCell>
              <TableCell sx={{ color: '#fff' }}>Modelo</TableCell>
              <TableCell sx={{ color: '#fff' }}>Capacidade</TableCell>
              <TableCell sx={{ color: '#fff' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onibus.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum ônibus cadastrado.</TableCell>
              </TableRow>
            ) : (
              onibus.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.placa}</TableCell>
                  <TableCell>{o.modelo}</TableCell>
                  <TableCell>{o.capacidade}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(o.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OnibusManagement;
