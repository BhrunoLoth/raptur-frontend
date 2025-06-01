import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid'
import { TextField, Button, Box } from '@mui/material'

const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [pagamentos, setPagamentos] = useState([])

  const buscarPagamentos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/relatorios/pagamentos`, {
        params: { dataInicio, dataFim }
      })
      setPagamentos(res.data)
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'valor', headerName: 'Valor', width: 150 },
    { field: 'data', headerName: 'Data', width: 200 },
    // Adicione mais colunas conforme necessário
  ]

  return (
    <Box sx={{ padding: 2 }}>
      <h2>Relatório de Pagamentos</h2>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
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
        <Button variant="contained" onClick={buscarPagamentos}>
          Buscar
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={pagamentos} columns={columns} pageSize={5} />
      </div>
    </Box>
  )
}

export default Relatorios