'use client'; 

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AdminOrdersPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', 
        textAlign: 'center',
        p: 3,
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          ¡Página de Gestión de Pedidos!
        </Typography>
        <Typography
          variant="h4"
          component="p"
          color="text.secondary"
          sx={{
            mt: 2,
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontSize: '2em', color: 'error.main', display: 'block', marginTop: 2 }}>🚧</span>
          Actualmente, esta sección se encuentra en un estado avanzado de desarrollo y optimización.
          <br />
          Estamos trabajando diligentemente para traerles una experiencia completa y funcional para la administración de órdenes.
          <br />
          ¡Agradecemos su paciencia!
          <span style={{ fontSize: '2em', color: 'error.main', display: 'block', marginTop: 2 }}>🚧</span>
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.hint"
          sx={{ mt: 4 }}
        >
          Pronto estará disponible con todas las funcionalidades de monitoreo, actualización y gestión de pedidos.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminOrdersPage;