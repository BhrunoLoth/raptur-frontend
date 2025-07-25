// components/SidebarPassageiro.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Stack, IconButton, Drawer } from '@mui/material';
import { LogOut, CreditCard, Clock3, Menu, Home, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarPassageiro({ onLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const btnStyle = {
    borderColor: 'rgba(255,255,255,0.4)',
    color: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)',
    }
  };

  const drawerContent = (
    <Box
      sx={{
        width: 240,
        height: '100%',
        bgcolor: '#004225',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={4}>
          Painel Passageiro
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={() => handleNavigate('/passageiro/dashboard')}
            fullWidth
            sx={btnStyle}
          >
            Início
          </Button>
          <Button
            variant="outlined"
            startIcon={<CreditCard />}
            onClick={() => handleNavigate('/passageiro/recarga')}
            fullWidth
            sx={btnStyle}
          >
            Recarga Pix
          </Button>
          <Button
            variant="outlined"
            startIcon={<Clock3 />}
            onClick={() => handleNavigate('/passageiro/historico')}
            fullWidth
            sx={btnStyle}
          >
            Histórico
          </Button>
          <Button
            variant="outlined"
            startIcon={<KeyRound />}
            onClick={() => handleNavigate('/trocar-senha')}
            fullWidth
            sx={btnStyle}
          >
            Trocar Senha
          </Button>
        </Stack>
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogOut />}
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          fullWidth
          sx={{
            mt: 4,
            borderColor: 'rgba(255,255,255,0.4)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Topbar mobile */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          p: 1,
          bgcolor: '#004225',
          color: 'white',
          alignItems: 'center'
        }}
      >
        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}>
          <Menu />
        </IconButton>
        <Typography variant="h6" ml={2}>
          Passageiro
        </Typography>
      </Box>
      {/* Drawer mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240, bgcolor: '#004225' }
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Sidebar desktop */}
      <Box
        sx={{
          width: 240,
          height: '100vh',
          bgcolor: '#004225',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          boxShadow: 3
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
}
