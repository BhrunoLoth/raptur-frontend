import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Stack,
  MenuItem, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
  const [statusEdit, setStatusEdit] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Função centralizada para url correta
  const endpoint = (path) => `${API_URL}${path}`;

  const fetchViagens = async () => {
    try {
      const res = await axios.get(endpoint('/admin/viagens'), {
        headers,
        params: {
          status: statusFiltro,
          dataInicio,
          dataFim
        }
      });
      setViagens(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setViagens([]);
      console.error('Erro ao buscar viagens:', err);
    }
  };

  const fetchMotoristas = async () => {
    try {
      const res = await axios.get(endpoint('/motoristas'), { headers });
      setMotoristas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMotoristas([]);
      console.error('Erro ao carregar motoristas:', err);
    }
  };

  const fetchOnibus = async () => {
    try {
      const res = await axios.get(endpoint('/onibus'), { headers });
      setOnibus(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setOnibus([]);
      console.error('Erro ao carregar ônibus:', err);
    }
  };

  const handleCreate = async () => {
    if (!destino || !dataHora || !onibusId || !motoristaId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await axios.post(endpoint('/admin/viagens'), {
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
      alert('Erro ao criar viagem. Verifique os dados e tente novamente.');
      console.error('Erro ao criar viagem:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente remover esta viagem?')) return;
    try {
      await axios.delete(endpoint(`/admin/viagens/${id}`), { headers });
      fetchViagens();
    } catch (err) {
      alert('Erro ao deletar viagem.');
      console.error('Erro ao deletar viagem:', err);
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusEdit({ ...statusEdit, [id]: value });
  };

  const salvarStatus = async (id) => {
    try {
      await axios.patch(endpoint(`/admin/viagens/${id}`), { status: statusEdit[id] }, { headers });
      setStatusEdit({ ...statusEdit, [id]: undefined });
      fetchViagens();
    } catch (err) {
      alert('Erro ao atualizar status.');
      console.error('Erro ao atualizar status:', err);
    }
  };

  useEffect(() => {
    fetchViagens();
    fetchMotoristas();
    fetchOnibus();
    // eslint-disable-next-line
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📍 Gerenciamento de Viagens
      </Typography>

      <Stack spacing={2} mb={4}>
        <TextField
          label="Destino"
          value={destino}
          onChange={e => setDestino(e.target.value)}
          placeholder="Ex: Terminal Central"
          fullWidth
        />
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
          <Select
            value={onibusId}
            onChange={e => setOnibusId(e.target.value)}
            label="Ônibus"
          >
            {onibus.map(o => (
              <MenuItem key={o.id} value={o.id}>{o.placa}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Motorista</InputLabel>
          <Select
            value={motoristaId}
            onChange={e => setMotoristaId(e.target.value)}
            label="Motorista"
          >
            {motoristas.map(m => (
              <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCreate}>
          ➕ Criar Viagem
        </Button>
      </Stack>

      <Typography variant="h6" gutterBottom>📅 Filtros</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFiltro}
            label="Status"
            onChange={e => setStatusFiltro(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="em andamento">Em Andamento</MenuItem>
            <MenuItem value="concluida">Concluída</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Data Início"
          type="date"
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Fim"
          type="date"
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={fetchViagens}>
          🔍 Filtrar
        </Button>
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
            {viagens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma viagem encontrada.
                </TableCell>
              </TableRow>
            ) : (
              viagens.map(v => (
                <TableRow key={v.id}>
                  <TableCell>{v.destino || <em>—</em>}</TableCell>
                  <TableCell>{v.data_hora ? new Date(v.data_hora).toLocaleString() : <em>—</em>}</TableCell>
                  <TableCell>{v.onibus?.placa || v.onibus_id || <em>—</em>}</TableCell>
                  <TableCell>{v.motorista?.nome || v.motorista_id || <em>—</em>}</TableCell>
                  <TableCell>
                    {statusEdit[v.id] !== undefined ? (
                      <>
                        <Select
                          size="small"
                          value={statusEdit[v.id]}
                          onChange={e => handleStatusChange(v.id, e.target.value)}
                        >
                          <MenuItem value="pendente">Pendente</MenuItem>
                          <MenuItem value="em andamento">Em Andamento</MenuItem>
                          <MenuItem value="concluida">Concluída</MenuItem>
                          <MenuItem value="cancelada">Cancelada</MenuItem>
                        </Select>
                        <Button
                          color="success"
                          size="small"
                          sx={{ ml: 1 }}
                          onClick={() => salvarStatus(v.id)}
                        >Salvar</Button>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => setStatusEdit({ ...statusEdit, [v.id]: undefined })}
                        >Cancelar</Button>
                      </>
                    ) : (
                      <span>
                        <b>{v.status}</b>{" "}
                        <Button size="small" onClick={() => setStatusEdit({ ...statusEdit, [v.id]: v.status })}>
                          Editar
                        </Button>
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDelete(v.id)}
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
}
