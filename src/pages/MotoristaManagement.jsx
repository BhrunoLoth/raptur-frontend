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
} from "@mui/material";
import axios from "axios";
import AppWrapper from "../components/AppWrapper";

const MotoristaManagement = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [motoristas, setMotoristas] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMotoristas = async () => {
    const res = await axios.get("http://localhost:3000/api/motoristas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMotoristas(res.data);
  };

  const handleCreate = async () => {
    if (!nome || !email) return;
    await axios.post(
      "http://localhost:3000/api/motoristas",
      { nome, email },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setNome("");
    setEmail("");
    fetchMotoristas();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/motoristas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMotoristas();
  };

  useEffect(() => {
    fetchMotoristas();
  }, []);

  return (
    <AppWrapper>
      <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
        <Typography variant="h5" gutterBottom>
          🚌 Gerenciar Motoristas
        </Typography>

        <TextField
          label="Nome"
          value={nome}
          fullWidth
          margin="normal"
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          onClick={handleCreate}
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
        >
          ➕ Criar
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Motoristas Cadastrados
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {motoristas.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.nome}</TableCell>
                  <TableCell>{m.email}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </AppWrapper>
  );
};

export default MotoristaManagement;
