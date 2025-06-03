import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent,
  Divider, Stack
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OnibusManagement = () => {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [onibus, setOnibus] = useState([]);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  const fetchOnibus = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/onibus', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOnibus(res.data);
    } catch (error) {
      console.error("Erro ao carregar ônibus:", error);
    }
  };

  const handleCreate = async () => {
    setErro('');
    if (!placa || !modelo || !capacidade) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/admin/onibus', {
        placa,
        modelo,
        capacidade: parseInt(capacidade)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaca('');
      setModelo('');
      setCapacidade('');
      fetchOnibus();
    } catch (error) {
      setErro("Erro ao criar ônibus. Placa pode já estar cadastrada.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/onibus/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOnibus();
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
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "onibus.csv";
    link.click();
  };

  useEffect(() => {
    fetchOnibus();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestão de Ônibus
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
            />
            <Button variant="contained" onClick={handleCreate} sx={{ minWidth: '150px' }}>
              Criar
            </Button>
          </Stack>
          {erro && <Typography mt={2} color="error">{erro}</Typography>}
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Ônibus Cadastrados</Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={exportarPDF} variant="outlined">📄 PDF</Button>
          <Button onClick={exportarCSV} variant="outlined">📑 CSV</Button>
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


