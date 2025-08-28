import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Alert, CircularProgress
} from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../services/api'; // ✅ Usa o axios com token

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [resumo, setResumo] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try {
        setUsuarioLogado(JSON.parse(stored));
      } catch {
        console.error('Erro ao carregar usuário do localStorage');
      }
    }

    const fetchDashboard = async () => {
      try {
        const [rResumo, rNotifs, rStats] = await Promise.all([
          api.get('/admin/dashboard/resumo').then(res => res.data),
          api.get('/admin/dashboard/notificacoes').then(res => res.data),
          api.get('/admin/dashboard/estatisticas').then(res => res.data),
        ]);

        setResumo(rResumo && !rResumo.erro ? rResumo : null);
        setNotificacoes(Array.isArray(rNotifs) ? rNotifs : []);
        setEstatisticas(rStats && !rStats.erro ? rStats : null);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!resumo || !estatisticas) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          ⚠️ Dados incompletos ou não carregados. Verifique a API.
        </Alert>
      </Box>
    );
  }

  const barData = {
    labels: ['Pagamentos', 'Embarques'],
    datasets: [
      {
        label: 'Resumo',
        data: [
          typeof resumo.totalPagamentos === 'number' ? resumo.totalPagamentos : 0,
          typeof resumo.totalEmbarques === 'number' ? resumo.totalEmbarques : 0
        ],
        backgroundColor: ['#00C853', '#2979FF'],
        borderRadius: 6
      }
    ]
  };

  const pieData = {
    labels: Object.keys(estatisticas.distribuicaoTipos ?? {}),
    datasets: [
      {
        data: Object.values(estatisticas.distribuicaoTipos ?? {}),
        backgroundColor: ['#4CAF50', '#FF9800', '#03A9F4', '#E91E63', '#9C27B0']
      }
    ]
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="h6" gutterBottom color="textSecondary">
        Bem-vindo(a), {usuarioLogado?.nome ?? 'Administrador'} 👋
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1b5e20', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">💰 Total Pagamentos</Typography>
              <Typography variant="h5">
                R$ {typeof resumo.totalPagamentos === 'number'
                  ? resumo.totalPagamentos.toFixed(2)
                  : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#1565c0', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🚌 Total Embarques</Typography>
              <Typography variant="h5">
                {typeof resumo.totalEmbarques === 'number'
                  ? resumo.totalEmbarques
                  : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#4a148c', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">👥 Total Usuários</Typography>
              <Typography variant="h5">
                {typeof estatisticas.totalUsuarios === 'number'
                  ? estatisticas.totalUsuarios
                  : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#006064', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🧑‍✈️ Total Motoristas</Typography>
              <Typography variant="h5">
                {typeof estatisticas.totalMotoristas === 'number'
                  ? estatisticas.totalMotoristas
                  : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#880e4f', color: 'white', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">🚌 Total Ônibus</Typography>
              <Typography variant="h5">
                {typeof estatisticas.totalOnibus === 'number'
                  ? estatisticas.totalOnibus
                  : '--'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Resumo Visual
            </Typography>
            <Bar data={barData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>
              Usuários por Categoria
            </Typography>
            <Pie data={pieData} />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            📢 Notificações
          </Typography>
          {notificacoes.length > 0 ? (
            notificacoes.map((n) => (
              <Alert
                key={n.id}
                severity={n.tipo || 'info'}
                sx={{ mb: 1, borderRadius: 2 }}
              >
                {n.mensagem}
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
}
