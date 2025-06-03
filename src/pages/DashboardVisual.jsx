import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button,
  CircularProgress
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

export default function DashboardVisual() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState('');
  const [onibusId, setOnibusId] = useState('');
  const [onibusLista, setOnibusLista] = useState([]);
  const [graficoData, setGraficoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://localhost:3000/api/onibus', { headers })
      .then(res => setOnibusLista(res.data))
      .catch(err => console.error('Erro ao carregar ônibus:', err));
  }, []);

  const buscarDados = async () => {
    if (!dataInicio || !dataFim) {
      alert("Selecione o intervalo de datas.");
      return;
    }

    setLoading(true);
    try {
      const params = { dataInicio, dataFim, tipo, onibus_id: onibusId };
      const res = await axios.get('http://localhost:3000/api/relatorios/embarques', { params, headers });

      const porTipo = {};
      res.data.forEach(e => {
        const categoria = e.passageiro?.subtipo_passageiro || 'Desconhecido';
        porTipo[categoria] = (porTipo[categoria] || 0) + 1;
      });

      const labels = Object.keys(porTipo);
      const valores = Object.values(porTipo);

      setGraficoData({
        labels,
        datasets: [{
          label: 'Qtd. Embarques',
          data: valores,
          backgroundColor: 'rgba(63, 81, 181, 0.7)',
          borderRadius: 4,
        }]
      });
    } catch (err) {
      console.error('Erro ao buscar embarques:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>📊 Painel Visual Administrativo</Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          type="date"
          label="Data Início"
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Data Fim"
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Tipo de Passageiro"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="aluno_gratuito">Aluno Gratuito</MenuItem>
          <MenuItem value="aluno_pagante">Aluno Pagante</MenuItem>
          <MenuItem value="idoso">Idoso</MenuItem>
          <MenuItem value="servidor_publico">Servidor Público</MenuItem>
          <MenuItem value="passageiro">Passageiro</MenuItem>
        </TextField>
        <TextField
          select
          label="Ônibus"
          value={onibusId}
          onChange={e => setOnibusId(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {onibusLista.map(o => (
            <MenuItem key={o.id} value={o.id}>{o.placa}</MenuItem>
          ))}
        </TextField>
        <Button onClick={buscarDados} variant="contained" sx={{ height: 56 }}>
          🔍 Aplicar Filtros
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {!loading && graficoData && (
        <Bar
          data={graficoData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Distribuição de Embarques por Tipo' },
            },
          }}
        />
      )}
    </Box>
  );
}
