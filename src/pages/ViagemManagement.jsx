// src/pages/ViagemManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Stack,
  MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

export default function ViagemManagement() {
  const [viagens, setViagens] = useState([]);
  const [destino, setDestino] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [onibusId, setOnibusId] = useState('');
  const [motoristaId, setMotoristaId] = useState('');
  const [motoristas, setMotoristas] = useState([]);
  const [onibus, setOnibus] = useState([]);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchViagens = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/viagens', {
        headers,
        params: {
          status: statusFiltro,
          dataInicio,
          dataFim
        }
      });
      setViagens(res.data);
    } catch (err) {
      console.error('Erro ao buscar viagens:', err);
    }
  };

  const fetchMotoristas = async () => {
    const res = await axios.get('http://localhost:3000/api/motoristas', { headers });
    setMotoristas(res.data);
  };

  const fetchOnibus = async () => {
    const res = await axios.get('http://localhost:3000/api/onibus', { headers });
    setOnibus(res.data);
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/viagens', {
        destino,
        data_hora: dataHora,
        onibus_id: onibusId,
        motorista_id: motoristaId
      }, { headers });
      setDestino('');
      setDataHora('');
      setOnibusId('');
      setMotoristaId('');
      fetchViagens();
    } catch (err) {
      console.error('Erro ao criar viagem:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta viagem?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/viagens/${id}`, { headers });
      fetchViagens();
    } catch (err) {
      console.error('Erro ao deletar viagem:', err);
    }
  };

  useEffect(() => {
    fetchViagens();
    fetchMotoristas();
    fetchOnibus();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📍 Gerenciamento de Viagens
      </Typography>

      <Stack spacing={2} mb={4}>
        <TextField label="Destino" value={destino} onChange={e => setDestino(e.target.value)} fullWidth />
        <TextField
          label="Data e Hora"
          type="datetime-local"
          value={dataHora}
          onChange={e => setDataHora(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Ônibus</InputLabel>
          <Select value={onibusId} onChange={e => setOnibusId(e.target.value)} label="Ônibus">
            {onibus.map(o => (
              <MenuItem key={o.id} value={o.id}>{o.placa}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Motorista</InputLabel>
          <Select value={motoristaId} onChange={e => setMotoristaId(e.target.value)} label="Motorista">
            {motoristas.map(m => (
              <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCreate}>➕ Criar Viagem</Button>
      </Stack>

      <Typography variant="h6" gutterBottom>📅 Filtros</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFiltro} label="Status" onChange={e => setStatusFiltro(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="em andamento">Em Andamento</MenuItem>
            <MenuItem value="concluída">Concluída</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Data Início"
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Fim"
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={fetchViagens}>🔍 Filtrar</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#263238' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Destino</TableCell>
              <TableCell sx={{ color: '#fff' }}>Data/Hora</TableCell>
              <TableCell sx={{ color: '#fff' }}>Ônibus</TableCell>
              <TableCell sx={{ color: '#fff' }}>Motorista</TableCell>
              <TableCell sx={{ color: '#fff' }}>Status</TableCell>
              <TableCell sx={{ color: '#fff' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viagens.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.destino}</TableCell>
                <TableCell>{new Date(v.data_hora).toLocaleString()}</TableCell>
                <TableCell>{v.onibus?.placa || v.onibus_id}</TableCell>
                <TableCell>{v.motorista?.nome || v.motorista_id}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(v.id)}>Remover</Button>
                </TableCell>
              </TableRow>
            ))}
            {viagens.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhuma viagem encontrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
