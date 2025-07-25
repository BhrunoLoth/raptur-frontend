import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Stack
} from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function MotoristaManagement() {
  const [motoristas, setMotoristas] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMotoristas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/motoristas`, { headers });
      setMotoristas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao carregar motoristas:", err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!nome.trim() || !email.trim() || !cnh.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/motoristas`,
        { nome, email, senha, cnh },
        { headers }
      );
      setNome("");
      setEmail("");
      setCnh("");
      setSenha("123456");
      fetchMotoristas();
    } catch (err) {
      console.error("Erro ao criar motorista:", err);
      alert("Erro ao criar motorista.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este motorista?")) return;
    try {
      await axios.delete(`${API_URL}/motoristas/${id}`, { headers });
      fetchMotoristas();
    } catch (err) {
      console.error("Erro ao remover motorista:", err);
      alert("Erro ao remover motorista.");
    }
  };

  useEffect(() => {
    fetchMotoristas();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          🧑‍✈️ Gerenciar Motoristas
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Nome"
            value={nome}
            fullWidth
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="CNH"
            value={cnh}
            fullWidth
            onChange={(e) => setCnh(e.target.value)}
          />
          <TextField
            label="Senha (padrão)"
            value={senha}
            type="password"
            fullWidth
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button
            onClick={handleCreate}
            variant="contained"
            fullWidth
            sx={{ mt: 1 }}
          >
            ➕ Cadastrar Motorista
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" gutterBottom>
        📋 Lista de Motoristas
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#004225" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Nome</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>CNH</TableCell>
                <TableCell sx={{ color: "#fff" }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {motoristas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ opacity: 0.7 }}>
                    Nenhum motorista cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                motoristas.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.nome}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.cnh || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(m.id)}
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
      )}
    </Box>
  );
}
