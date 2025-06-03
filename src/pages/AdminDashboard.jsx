import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Card, CardContent, Alert, CircularProgress, useTheme
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [resumo, setResumo] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResumo, resNotificacoes, resEstatisticas] = await Promise.all([
          axios.get('http://localhost:3000/api/dashboard/resumo'),
          axios.get('http://localhost:3000/api/dashboard/notificacoes'),
          axios.get('http://localhost:3000/api/dashboard/estatisticas'),
        ]);
        setResumo(resResumo.data);
        setNotificacoes(resNotificacoes.data || []);
        setEstatisticas(resEstatisticas.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Pagamentos', 'Embarques'],
    datasets: [
      {
        label: 'Resumo',
        data: [resumo?.totalPagamentos || 0, resumo?.totalEmbarques || 0],
        backgroundColor: ['#00C853', '#2979FF'],
        borderRadius: 6,
      }
    ]
  };

  const pieData = estatisticas && {
    labels: Object.keys(estatisticas.distribuicaoTipos || {}),
    datasets: [
      {
        data: Object.values(estatisticas.distribuicaoTipos || {}),
        backgroundColor: [
          '#4CAF50',
          '#FF9800',
          '#03A9F4',
          '#E91E63',
          '#9C27B0'
        ]
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards estatísticos */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1b5e20', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">💰 Total Pagamentos</Typography>
              <Typography variant="h5" fontWeight="bold">
                R$ {resumo?.totalPagamentos?.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1565c0', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🚌 Total Embarques</Typography>
              <Typography variant="h5" fontWeight="bold">
                {resumo?.totalEmbarques || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#4a148c', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">👥 Total Usuários</Typography>
              <Typography variant="h5" fontWeight="bold">
                {estatisticas?.totalUsuarios || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#006064', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🧑‍✈️ Total Motoristas</Typography>
              <Typography variant="h5" fontWeight="bold">
                {estatisticas?.totalMotoristas || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#880e4f', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🚌 Total Ônibus</Typography>
              <Typography variant="h5" fontWeight="bold">
                {estatisticas?.totalOnibus || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Barras */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, bgcolor: '#263238', color: 'white' }}>
            <Typography variant="h6" mb={2}>Resumo Visual</Typography>
            <Bar data={chartData} />
          </Card>
        </Grid>

        {/* Gráfico de Pizza */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, bgcolor: '#1a237e', color: 'white' }}>
            <Typography variant="h6" mb={2}>Usuários por Categoria</Typography>
            <Pie data={pieData} />
          </Card>
        </Grid>

        {/* Notificações */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>📢 Notificações</Typography>
          {Array.isArray(notificacoes) && notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <Alert
                key={notificacao.id || Math.random()}
                severity={notificacao.tipo || 'info'}
                sx={{ mb: 1, borderRadius: 2, boxShadow: 2 }}
              >
                {notificacao.mensagem || 'Mensagem não especificada'}
              </Alert>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhuma notificação disponível.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;




