// components/Sidebar.jsx
import {
  LayoutDashboard, Users, Truck, Bus, CreditCard,
  CheckSquare, BarChart2, Settings, Route, LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Typography, Button, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Drawer
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const menuAdmin = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <Users size={20} />, label: 'Usuários', to: '/usuarios' },
  { icon: <Truck size={20} />, label: 'Motoristas', to: '/motoristas' },
  { icon: <Bus size={20} />, label: 'Ônibus', to: '/onibus' },
  { icon: <Route size={20} />, label: 'Viagens', to: '/viagens' },
  { icon: <CreditCard size={20} />, label: 'Pagamentos', to: '/pagamentos' },
  { icon: <CheckSquare size={20} />, label: 'Embarques', to: '/embarques' },
  { icon: <BarChart2 size={20} />, label: 'Relatórios', to: '/relatorios' },
  { icon: <BarChart2 size={20} />, label: 'Painel Visual', to: '/painel-visual' },
  { icon: <Settings size={20} />, label: 'Configurações', to: '/configuracoes' }
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          Administrador Raptur
        </Typography>
        <List>
          {menuAdmin.map(({ icon, label, to }) => (
            <ListItem
              key={label}
              component={Link}
              to={to}
              onClick={() => setMobileOpen(false)}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor:
                  location.pathname === to
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box textAlign="center">
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogOut />}
          onClick={onLogout}
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
      {/* Ícone de menu mobile */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          p: 1,
          bgcolor: '#004225',
          color: 'white'
        }}
      >
        <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" ml={2}>
          Administrador Raptur
        </Typography>
      </Box>
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
