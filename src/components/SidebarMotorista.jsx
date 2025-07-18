import { Route, CheckSquare, LogOut, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';

const motoristaMenu = [
  { icon: <CheckSquare size={20} />, label: 'Painel do Motorista', to: '/motorista/dashboard' },
  { icon: <Route size={20} />, label: 'Embarques', to: '/motorista/embarques' },
  { icon: <Clock size={20} />, label: 'Histórico de Embarques', to: '/motorista/historico-embarques' },
];

export default function SidebarMotorista({ onLogout }) {
  const location = useLocation();
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#1b5e20',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        boxShadow: 3,
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={4}>
          Painel Motorista
        </Typography>
        <List>
          {motoristaMenu.map(({ icon, label, to }) => (
            <ListItem
              button
              key={label}
              component={Link}
              to={to}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: location.pathname === to ? 'rgba(255,255,255,0.10)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.07)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: 15 }} />
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
            '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}
