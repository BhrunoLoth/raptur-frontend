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
} from "@mui/material";
import axios from "axios";
import AppWrapper from "../components/AppWrapper";

export default function MotoristaManagement() {
  const [motoristas, setMotoristas] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");
  const [senha, setSenha] = useState("123456");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchMotoristas = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/motoristas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMotoristas(res.data);
    } catch (err) {
      console.error("Erro ao carregar motoristas:", err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!nome.trim() || !email.trim() || !cnh.trim()) return;

    try {
      await axios.post(
        "http://localhost:3000/api/admin/motoristas",
        { nome, email, senha, cnh },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNome("");
      setEmail("");
      setCnh("");
      fetchMotoristas();
    } catch (err) {
      console.error("Erro ao criar motorista:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este motorista?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/motoristas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMotoristas();
    } catch (err) {
      console.error("Erro ao remover motorista:", err);
    }
  };

  useEffect(() => {
    fetchMotoristas();
  }, []);

  return (
    <AppWrapper>
      <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", p: 4 }}>
        <Typography variant="h5" gutterBottom>
          🧑‍✈️ Gerenciar Motoristas
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
          type="email"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="CNH"
          value={cnh}
          fullWidth
          margin="normal"
          onChange={(e) => setCnh(e.target.value)}
        />
        <TextField
          label="Senha (padrão)"
          value={senha}
          fullWidth
          margin="normal"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          ➕ Cadastrar Motorista
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          📋 Lista de Motoristas
        </Typography>

        {loading ? (
          <CircularProgress sx={{ my: 4 }} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CNH</TableCell>
                  <TableCell>Ações</TableCell>
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
      </Paper>
    </AppWrapper>
  );
}


