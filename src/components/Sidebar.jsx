import {
  LayoutDashboard,
  Users,
  Truck,
  Bus,
  CreditCard,
  CheckSquare,
  BarChart2,
  Settings,
  Route,
  LogOut
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
  { icon: <Users size={20} />, label: 'Usuários', to: '/usuarios' },
  { icon: <Truck size={20} />, label: 'Motoristas', to: '/motoristas' },
  { icon: <Bus size={20} />, label: 'Ônibus', to: '/onibus' },
  { icon: <Route size={20} />, label: 'Viagens', to: '/viagens' }, // 🚀 NOVO
  { icon: <CreditCard size={20} />, label: 'Pagamentos', to: '/pagamentos' },
  { icon: <CheckSquare size={20} />, label: 'Embarques', to: '/embarques' },
  { icon: <BarChart2 size={20} />, label: 'Relatórios', to: '/relatorios' },
  { icon: <BarChart2 size={20} />, label: 'Painel Visual', to: '/painel-visual' }, // ✅ NOVO
  { icon: <Settings size={20} />, label: 'Configurações', to: '/configuracoes' }
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#004225',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        boxShadow: 3
      }}
    >
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Raptur Admin
        </Typography>

        <List>
          {menuItems.map(({ icon, label, to }) => (
            <ListItem
              key={label}
              component={Link}
              to={to}
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
}




