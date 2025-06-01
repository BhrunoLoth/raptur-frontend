import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Grid, Card, CardContent, Alert, CircularProgress, useTheme
} from '@mui/material';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [resumo, setResumo] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resResumo, resNotificacoes] = await Promise.all([
          axios.get('http://localhost:3000/api/dashboard/resumo'),
          axios.get('http://localhost:3000/api/dashboard/notificacoes')
        ]);
        setResumo(resResumo.data);
        setNotificacoes(resNotificacoes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        {/* Total Pagamentos */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              bgcolor: 'rgba(0, 66, 37, 0.85)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Pagamentos</Typography>
              <Typography variant="h4" fontWeight="bold">
                R$ {resumo?.totalPagamentos?.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Embarques */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              bgcolor: 'rgba(41, 121, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Embarques</Typography>
              <Typography variant="h4" fontWeight="bold">
                {resumo?.totalEmbarques || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(to right, #004225cc, #2979FFcc)',
              color: 'white'
            }}
          >
            <Typography variant="h6" mb={2}>Resumo Visual</Typography>
            <Bar data={chartData} />
          </Card>
        </Grid>

        {/* Notificações */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Notificações</Typography>
          {Array.isArray(notificacoes) && notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <Alert
                key={notificacao.id || Math.random()}
                severity={notificacao.tipo || 'info'}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
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


