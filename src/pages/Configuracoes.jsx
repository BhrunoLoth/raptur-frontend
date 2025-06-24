import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert
} from '@mui/material';

const Configuracoes = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const criarAdministrador = async () => {
    setMensagem(null);
    setErro(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/configuracoes/admin`, {
        nome,
        email,
        senha
      });
      setMensagem('Administrador criado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      setErro('Erro ao criar administrador. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Configurações
      </Typography>
      <Typography variant="h6" gutterBottom>
        Criar Novo Administrador
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mensagem && <Alert severity="success">{mensagem}</Alert>}
          {erro && <Alert severity="error">{erro}</Alert>}

          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={criarAdministrador}>
            Criar Administrador
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Configuracoes;
