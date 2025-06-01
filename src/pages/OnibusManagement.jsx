import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent,
  CardActions, Divider, Stack
} from '@mui/material';
import axios from 'axios';

const OnibusManagement = () => {
  const [placa, setPlaca] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [onibus, setOnibus] = useState([]);

  const token = localStorage.getItem('token');

  const fetchOnibus = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/onibus', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOnibus(res.data);
    } catch (error) {
      console.error("Erro ao carregar ônibus:", error);
    }
  };

  const handleCreate = async () => {
    if (!placa || !capacidade) return;
    try {
      await axios.post('http://localhost:3000/api/onibus', {
        placa,
        capacidade: parseInt(capacidade)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaca('');
      setCapacidade('');
      fetchOnibus();
    } catch (error) {
      console.error("Erro ao criar ônibus:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/onibus/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOnibus();
    } catch (error) {
      console.error("Erro ao deletar ônibus:", error);
    }
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
              label="Capacidade"
              type="number"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{ minWidth: '150px' }}
            >
              Criar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>Ônibus Cadastrados</Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#004225' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>ID</TableCell>
              <TableCell sx={{ color: '#fff' }}>Placa</TableCell>
              <TableCell sx={{ color: '#fff' }}>Capacidade</TableCell>
              <TableCell sx={{ color: '#fff' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onibus.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.placa}</TableCell>
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
            ))}
            {onibus.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum ônibus cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OnibusManagement;


