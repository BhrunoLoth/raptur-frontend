import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, CircularProgress, Paper
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

export default function DashboardVisual() {
  // Estados
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState('');
  const [onibusId, setOnibusId] = useState('');
  const [onibusLista, setOnibusLista] = useState([]);
  const [graficoData, setGraficoData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sempre use APENAS o valor do env
  const BACKEND = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Carrega lista de ônibus ao montar componente
  useEffect(() => {
    axios.get(`${BACKEND}/onibus`, { headers })
      .then(res => setOnibusLista(res.data))
      .catch(err => {
        setOnibusLista([]);
        console.error('❌ Erro ao carregar ônibus:', err);
      });
    // eslint-disable-next-line
  }, []);

  // Função para buscar dados filtrados
  const buscarDados = async () => {
    if (!dataInicio || !dataFim) {
      alert("📆 Selecione o intervalo de datas.");
      return;
    }

    setLoading(true);
    setGraficoData(null);

    try {
      const params = {
        dataInicio,
        dataFim,
        tipo,
        onibus_id: onibusId
      };

      const res = await axios.get(`${BACKEND}/relatorios/embarques`, { params, headers });

      // Agrupa por subtipo_passageiro
      const porTipo = {};
      (res.data || []).forEach(e => {
        const categoria = e.passageiro?.subtipo_passageiro || 'Desconhecido';
        porTipo[categoria] = (porTipo[categoria] || 0) + 1;
      });

      setGraficoData({
        labels: Object.keys(porTipo),
        datasets: [
          {
            label: 'Qtd. Embarques',
            data: Object.values(porTipo),
            backgroundColor: 'rgba(63, 81, 181, 0.7)',
            borderRadius: 4
          }
        ]
      });

    } catch (err) {
      setGraficoData(null);
      console.error('❌ Erro ao buscar embarques:', err);
      alert('Erro ao buscar dados. Verifique a API ou o filtro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={{ xs: 2, sm: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="green" gutterBottom>
        📊 Painel Visual Administrativo
      </Typography>

      <Paper sx={{ p: 2, mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
          sx={{ minWidth: 180 }}
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
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {onibusLista.map(o => (
            <MenuItem key={o.id} value={o.id}>{o.placa}</MenuItem>
          ))}
        </TextField>
        <Button onClick={buscarDados} variant="contained" sx={{ height: 56 }}>
          🔍 Aplicar Filtros
        </Button>
      </Paper>

      {loading && <CircularProgress />}
      {!loading && graficoData && (
        <Box sx={{ width: '100%', height: 400 }}>
          <Bar
            data={graficoData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Distribuição de Embarques por Tipo' },
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}
