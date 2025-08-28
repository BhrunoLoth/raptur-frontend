import React, { useState } from 'react';
import {
  Box, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { LogOut, CreditCard, Clock3, Menu, Home, KeyRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuPassageiro = [
  { icon: <Home size={20} />, label: 'Início', to: '/passageiro/dashboard' },
  { icon: <CreditCard size={20} />, label: 'Recarga Pix', to: '/passageiro/recarga' },
  { icon: <Clock3 size={20} />, label: 'Histórico', to: '/passageiro/historico' },
  { icon: <KeyRound size={20} />, label: 'Trocar Senha', to: '/trocar-senha' },
];

export default function SidebarPassageiro({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (to) => {
    setMobileOpen(false);
    navigate(to);
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
      role="navigation"
      aria-label="Navegação Passageiro"
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={4}>
          Painel Passageiro
        </Typography>
        <List>
          {menuPassageiro.map(({ icon, label, to }) => (
            <ListItem
              button
              key={label}
              selected={location.pathname === to}
              onClick={() => handleNavigate(to)}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor:
                  location.pathname === to
                    ? 'rgba(255,255,255,0.14)'
                    : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.09)' },
                minHeight: 44,
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: 15, fontWeight: 500 }} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogOut />}
          onClick={() => {
            localStorage.clear();
            if (onLogout) onLogout();
            navigate('/login');
          }}
          fullWidth
          sx={{
            mt: 4,
            borderColor: 'rgba(255,255,255,0.4)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
          aria-label="Sair do sistema"
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
          p: 1.5,
          bgcolor: '#004225',
          color: 'white',
          alignItems: 'center'
        }}
      >
        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }} aria-label="Abrir menu">
          <Menu />
        </IconButton>
        <Typography variant="h6" ml={2} fontWeight={600} fontSize={18}>
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
