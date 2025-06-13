'use client';

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DashboardOverview: React.FC = () => {
  const stats = {
    totalUsers: 1250,
    activeSellers: 50,
    pendingSellerRequests: 5, 
    totalProducts: 2500,
    totalOrders: 890,
    revenue: 125000.75, 
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resumen del Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GroupIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">{stats.totalUsers}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Usuarios Totales</Typography>
          </Paper>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StoreIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h6">{stats.activeSellers}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Vendedores Activos</Typography>
          </Paper>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AssignmentIcon color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h6">{stats.pendingSellerRequests}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Solicitudes Pendientes</Typography>
          </Paper>
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ShoppingCartIcon color="info" sx={{ fontSize: 40 }} />
            <Typography variant="h6">{stats.totalProducts}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Productos Totales</Typography>
          </Paper>
        </Grid>

      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Actividad Reciente
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">Graficos o tablas de actividad reciente iran aqui.</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardOverview;