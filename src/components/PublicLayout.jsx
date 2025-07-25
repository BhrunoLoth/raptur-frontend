import React from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const PublicLayout = ({ children }) => {
  const theme = useTheme();
  const { toggleTheme } = useCustomTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(to right, #6ddf93, #f9f9f9, #f7b891)'
          : 'linear-gradient(to right, #202020, #2c2c2c, #202020)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        position: 'relative'
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: theme.palette.mode === 'light' ? '#ff9800' : '#fff',
          backgroundColor: theme.palette.background.paper,
          boxShadow: 3
        }}
      >
        {theme.palette.mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
      <Box
        sx={{
          width: '100%',
          maxWidth: 800,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: 6,
          p: 4
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PublicLayout;
