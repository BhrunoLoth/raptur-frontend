// src/pages/IdososList.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarIdosos,
  removerIdoso,
} from "../services/idosoService";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

import { Pencil, Trash2, RefreshCw, Plus, Printer, Eye } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

// Funções auxiliares para formatação
const fmtCPF = (v = "") =>
  String(v)
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");

const fmtData = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d) ? "-" : d.toLocaleDateString("pt-BR");
};

export default function IdososList() {
  const navigate = useNavigate();

  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const params = useMemo(
    () => ({ page, limit, search, ativo: true, min_age: 60 }),
    [page, limit, search]
  );

  async function carregar() {
    try {
      setLoading(true);
      setErro(null);
      const res = await listarIdosos(params);
      const rows = res?.rows ?? [];
      const totalCount = res?.total ?? rows.length;
      setItens(rows);
      setTotal(totalCount);
    } catch (e) {
      console.error("❌ Erro ao listar idosos:", e);
      setErro(e?.message ?? "Erro ao carregar lista de idosos");
      setItens([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  // Abre o PDF autenticado
  const abrirCarteirinhaPdf = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/idosos/${id}/carteirinha.pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao gerar carteirinha PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
    } catch (err) {
      console.error(err);
      alert("Erro ao abrir carteirinha PDF");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Cabeçalho e busca */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h5"
          sx={{ flex: 1, fontWeight: 700, color: "#136c3a" }}
        >
          Carteirinhas de Idosos
        </Typography>

        <TextField
          size="small"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <Tooltip title="Recarregar">
          <IconButton aria-label="Recarregar" onClick={carregar}>
            <RefreshCw size={18} />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          sx={{
            bgcolor: "#136c3a",
            "&:hover": { bgcolor: "#0f5a2f" },
            textTransform: "none",
          }}
          onClick={() => navigate("/admin/idosos/novo")}
        >
          Novo
        </Button>
      </Box>

      {/* Tabela */}
      <Paper elevation={1}>
        {loading ? (
          <Box
            sx={{
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Carregando...</Typography>
          </Box>
        ) : erro ? (
          <Box sx={{ p: 4 }}>
            <Typography color="error" sx={{ mb: 2 }}>
              {erro}
            </Typography>
            <Button variant="outlined" onClick={carregar}>
              Tentar novamente
            </Button>
          </Box>
        ) : itens.length === 0 ? (
          <Box sx={{ p: 4 }}>
            <Typography sx={{ opacity: 0.7 }}>
              Nenhum idoso cadastrado.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Nº Carteira</TableCell>
                  <TableCell>Data Nasc.</TableCell>
                  <TableCell>Validade</TableCell>
                  <TableCell>Ativo</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((it) => {
                  const id = it.id ?? it._id;
                  return (
                    <TableRow key={id}>
                      <TableCell>{it.nome ?? "-"}</TableCell>
                      <TableCell>{fmtCPF(it.cpf)}</TableCell>
                      <TableCell>{it.numeroCarteira ?? "-"}</TableCell>
                      <TableCell>{fmtData(it.dataNascimento)}</TableCell>
                      <TableCell>{fmtData(it.dataValidade)}</TableCell>
                      <TableCell>{it.ativo ? "Sim" : "Não"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/admin/idosos/${id}`)}
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Imprimir Carteirinha">
                          <IconButton
                            size="small"
                            onClick={() => abrirCarteirinhaPdf(id)}
                          >
                            <Printer size={16} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/admin/idosos/${id}?edit=true`)
                            }
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Remover">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                              if (!confirm("Remover este idoso?")) return;
                              try {
                                await removerIdoso(id);
                                await carregar();
                              } catch (e) {
                                alert(e?.message ?? "Erro ao remover");
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Paginação */}
      {total > limit && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            size="small"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <Typography variant="body2">
            Página {page} de {Math.ceil(total / limit)}
          </Typography>
          <Button
            size="small"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </Box>
      )}
    </Box>
  );
}
