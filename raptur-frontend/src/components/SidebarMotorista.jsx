// components/SidebarMotorista.jsx
import { Route, CheckSquare, LogOut, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Typography, List, ListItem, ListItemIcon, ListItemText, Button, IconButton, Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const motoristaMenu = [
  { icon: <CheckSquare size={20} />, label: 'Painel do Motorista', to: '/motorista/dashboard' },
  { icon: <Route size={20} />, label: 'Embarques', to: '/motorista/embarques' },
  { icon: <Clock size={20} />, label: 'Histórico de Embarques', to: '/motorista/historico-embarques' },
];

export default function SidebarMotorista({ onLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Box
      sx={{
        width: 240,
        height: '100%',
        bgcolor: '#1b5e20',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2
      }}
      role="navigation"
      aria-label="Navegação do Motorista"
    >
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          sx={{ letterSpacing: 1 }}
        >
          Painel Motorista
        </Typography>
        <List>
          {motoristaMenu.map(({ icon, label, to }) => (
            <ListItem
              button
              key={label}
              component={Link}
              to={to}
              onClick={() => setMobileOpen(false)}
              selected={location.pathname === to}
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
      <Box textAlign="center" mt={2}>
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
            fontWeight: 'bold',
            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
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
          bgcolor: '#1b5e20',
          color: 'white',
          alignItems: 'center'
        }}
      >
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{ color: 'white' }}
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" ml={2} fontWeight={600} fontSize={18}>
          Painel Motorista
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
          '& .MuiDrawer-paper': { width: 240, bgcolor: '#1b5e20' }
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Sidebar desktop */}
      <Box
        sx={{
          width: 240,
          height: '100vh',
          bgcolor: '#1b5e20',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          boxShadow: 3,
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
}
