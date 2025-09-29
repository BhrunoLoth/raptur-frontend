// src/pages/IdososList.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  listarIdosos,
  criarIdoso,
  atualizarIdoso,
  removerIdoso,
} from '../services/idosoService';

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
} from '@mui/material';

// Correção: esses são os nomes válidos em lucide-react
import { Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function IdososList() {
  const [itens, setItens] = useState([]);        // lista
  const [total, setTotal] = useState(0);         // total para paginação
  const [page, setPage] = useState(1);           // página atual (1-based)
  const [limit] = useState(10);                  // por página
  const [search, setSearch] = useState('');      // filtro
  const [loading, setLoading] = useState(true);  // carregando
  const [erro, setErro] = useState(null);        // erro

  const params = useMemo(
    () => ({ page, limit, search, ativo: true }),
    [page, limit, search]
  );

  async function carregar() {
    try {
      setLoading(true);
      setErro(null);
      const res = await listarIdosos(params);

      // API pode retornar { rows, total } ou um array simples; normalizamos:
      const rows = Array.isArray(res) ? res : (res.rows ?? []);
      const totalCount = Array.isArray(res) ? rows.length : (res.total ?? rows.length);

      setItens(rows);
      setTotal(totalCount);
    } catch (e) {
      console.error('❌ Erro ao listar idosos:', e);
      setErro(e?.message ?? 'Erro ao carregar lista de idosos');
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 700 }}>
          Carteirinha Idoso
        </Typography>

        <TextField
          size="small"
          placeholder="Buscar por nome/CPF..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <IconButton aria-label="Recarregar" onClick={carregar}>
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      <Paper elevation={1}>
        {loading ? (
          <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <Typography sx={{ opacity: 0.7 }}>Nenhum idoso cadastrado.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Data Nasc.</TableCell>
                  <TableCell>Ativo</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((it) => (
                  <TableRow key={it.id ?? it._id ?? `${it.cpf}-${it.email}`}>
                    <TableCell>{it.nome ?? '-'}</TableCell>
                    <TableCell>{it.cpf ?? '-'}</TableCell>
                    <TableCell>{it.email ?? '-'}</TableCell>
                    <TableCell>
                      {it.data_nascimento
                        ? new Date(it.data_nascimento).toLocaleDateString('pt-BR')
                        : '-'}
                    </TableCell>
                    <TableCell>{it.ativo ? 'Sim' : 'Não'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label="Editar"
                        onClick={() => {
                          // TODO: abrir modal/rota de edição
                          console.log('Editar', it);
                        }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Remover"
                        onClick={async () => {
                          if (!confirm('Remover este idoso?')) return;
                          try {
                            await removerIdoso(it.id ?? it._id);
                            await carregar();
                          } catch (e) {
                            alert(e?.message ?? 'Erro ao remover');
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Paginação simples (evolua depois para MUI TablePagination se quiser) */}
      {total > limit && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
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
