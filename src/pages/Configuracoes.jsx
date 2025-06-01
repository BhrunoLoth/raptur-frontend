import React, { useState } from 'react'
import axios from 'axios'
import { TextField, Button, Box } from '@mui/material'

const Configuracoes = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const criarAdministrador = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/configuracoes/admin`, {
        nome,
        email,
        senha
      })
      alert('Administrador criado com sucesso!')
      setNome('')
      setEmail('')
      setSenha('')
    } catch (error) {
      console.error('Erro ao criar administrador:', error)
      alert('Erro ao criar administrador.')
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <h2>Configurações</h2>
      <h3>Criar Novo Administrador</h3>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button variant="contained" onClick={criarAdministrador}>
          Criar Administrador
        </Button>
      </Box>
    </Box>
  )
}

export default Configuracoes