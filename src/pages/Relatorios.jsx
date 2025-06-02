import React, { useState } from 'react'
import axios from 'axios'
import {
  DataGrid
} from '@mui/x-data-grid'
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'

export default function Relatorios() {
  const [tipo, setTipo] = useState('pagamentos')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [usuarioId, setUsuarioId] = useState('') // ✅ novo
  const [dados, setDados] = useState([])

  const buscar = async () => {
    try {
      const endpoint = {
        pagamentos: 'pagamentos',
        embarques: 'embarques',
        viagens: `viagens/${usuarioId || '0000-uuid-fake'}`
      }[tipo]

      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/relatorios/${endpoint}`, {
        params: { dataInicio, dataFim }
      })

      setDados(data)
    } catch (err) {
      console.error('Erro ao buscar relatório:', err)
    }
  }

  const exportarCSV = () => {
    if (dados.length === 0) return

    const csv = [
      Object.keys(dados[0]).join(','),
      ...dados.map(obj => Object.values(obj).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${tipo}_relatorio.csv`
    a.click()
  }

  const colunasDinamicas = dados[0]
    ? Object.keys(dados[0]).map((key) => ({
        field: key,
        headerName: key.toUpperCase(),
        width: 150
      }))
    : []

  return (
    <Box sx={{ padding: 2 }}>
      <h2>📊 Relatórios</h2>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="tipo-select-label">Tipo</InputLabel>
        <Select
          labelId="tipo-select-label"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          label="Tipo"
        >
          <MenuItem value="pagamentos">Pagamentos</MenuItem>
          <MenuItem value="embarques">Embarques</MenuItem>
          <MenuItem value="viagens">Viagens por Passageiro</MenuItem>
        </Select>
      </FormControl>

      {tipo === 'viagens' && (
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          label="ID do Passageiro"
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
        />
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Data Início"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />
        <TextField
          label="Data Fim"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />
        <Button variant="contained" onClick={buscar}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={exportarCSV}>
          ⬇ Exportar CSV
        </Button>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={dados} columns={colunasDinamicas} pageSize={5} />
      </div>
    </Box>
  )
}