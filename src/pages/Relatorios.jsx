import React, { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Typography, CircularProgress, TextField, Button, MenuItem, Table, TableHead,
  TableBody, TableCell, TableRow, Paper, TableContainer
} from '@mui/material';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../services/apiService';

export default function Relatorios() {
  const [aba, setAba] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [onibus, setOnibus] = useState([]);

  const [filtros, setFiltros] = useState({
    usuario_id: '',
    motorista_id: '',
    onibus_id: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });

  // Carrega listas básicas ao montar
  useEffect(() => {
    api.get('/usuarios').then(res => setUsuarios(res.data)).catch(console.error);
    api.get('/motoristas').then(res => setMotoristas(res.data)).catch(console.error);
    api.get('/onibus').then(res => setOnibus(res.data)).catch(console.error);
  }, []);

  // Busca dados conforme aba e filtros
  const handleBuscar = async () => {
    if (!filtros.dataInicio || !filtros.dataFim) {
      alert("Informe o intervalo de datas.");
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let params = {};

      switch (aba) {
        case 0:
          endpoint = 'pagamentos';
          params = { ...filtros };
          break;
        case 1:
          endpoint = 'embarques';
          params = { ...filtros };
          break;
        case 2:
          endpoint = 'viagens';
          params = { ...filtros };
          break;
        case 3:
          endpoint = `viagens/${filtros.usuario_id}`;
          params = { inicio: filtros.dataInicio, fim: filtros.dataFim };
          break;
        default:
          return;
      }

      const res = await api.get(`/relatorios/${endpoint}`, { params });
      setResultados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setResultados([]);
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Exporta CSV
  const exportarCSV = () => {
    if (resultados.length === 0) return;
    const keys = Object.keys(resultados[0]);
    const csv = [
      keys.join(','),
      ...resultados.map(obj => keys.map(k => obj[k]).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio.csv";
    a.click();
  };

  // Exporta PDF
  const exportarPDF = () => {
    if (resultados.length === 0) return;
    const doc = new jsPDF();
    const keys = Object.keys(resultados[0]);
    const rows = resultados.map(obj => keys.map(k => obj[k]));

    doc.text("Relatório Raptur", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [keys],
      body: rows
    });
    doc.save("relatorio.pdf");
  };

  // Renderiza a tabela de resultados
  const renderTabela = () => {
    if (loading) return <CircularProgress />;
    if (resultados.length === 0) return <Typography>Nenhum resultado encontrado.</Typography>;

    return (
      <>
        <Box display="flex" flexWrap="wrap" gap={2} my={2}>
          <Button variant="outlined" onClick={exportarCSV}>📥 Exportar CSV</Button>
          <Button variant="outlined" onClick={exportarPDF}>📄 Exportar PDF</Button>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(resultados[0]).map((k, i) => (
                  <TableCell key={i}>{k}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.map((linha, i) => (
                <TableRow key={i}>
                  {Object.values(linha).map((val, j) => (
                    <TableCell key={j}>
                      {typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T/)
                        ? format(new Date(val), 'dd/MM/yyyy HH:mm')
                        : String(val)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <Box p={2} maxWidth="100%">
      <Typography variant="h5" gutterBottom>📈 Relatórios Avançados</Typography>

      <Tabs
        value={aba}
        onChange={(_, v) => setAba(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Pagamentos" />
        <Tab label="Embarques" />
        <Tab label="Viagens" />
        <Tab label="Viagens por Passageiro" />
      </Tabs>

      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        {(aba === 0 || aba === 3) && (
          <TextField
            select label="Passageiro" value={filtros.usuario_id}
            onChange={e => setFiltros({ ...filtros, usuario_id: e.target.value })}
            sx={{ minWidth: 200, flexGrow: 1 }}
          >
            {usuarios.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.nome}</MenuItem>
            ))}
          </TextField>
        )}
        {aba === 1 && (
          <>
            <TextField
              select label="Motorista" value={filtros.motorista_id}
              onChange={e => setFiltros({ ...filtros, motorista_id: e.target.value })}
              sx={{ minWidth: 200, flexGrow: 1 }}
            >
              {motoristas.map(m => (
                <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Ônibus" value={filtros.onibus_id}
              onChange={e => setFiltros({ ...filtros, onibus_id: e.target.value })}
              sx={{ minWidth: 200, flexGrow: 1 }}
            >
              {onibus.map(o => (
                <MenuItem key={o.id} value={o.id}>{o.placa}</MenuItem>
              ))}
            </TextField>
          </>
        )}
        {aba === 2 && (
          <TextField
            select label="Status" value={filtros.status}
            onChange={e => setFiltros({ ...filtros, status: e.target.value })}
            sx={{ minWidth: 150, flexGrow: 1 }}
          >
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="em andamento">Em Andamento</MenuItem>
            <MenuItem value="concluída">Concluída</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </TextField>
        )}
        <TextField
          type="date" label="Início"
          value={filtros.dataInicio}
          onChange={e => setFiltros({ ...filtros, dataInicio: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ flexGrow: 1, minWidth: 150 }}
        />
        <TextField
          type="date" label="Fim"
          value={filtros.dataFim}
          onChange={e => setFiltros({ ...filtros, dataFim: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ flexGrow: 1, minWidth: 150 }}
        />
        <Button
          onClick={handleBuscar}
          variant="contained"
          sx={{ height: 56, flexShrink: 0 }}
          disabled={!filtros.dataInicio || !filtros.dataFim}
        >
          Buscar
        </Button>
      </Box>

      {renderTabela()}
    </Box>
  );
}
