'use client';

import React from 'react';
import { useProtectRoute } from '../../hooks/useProtectRoute'; 
import AdminLayout from '../../components/admin/AdminLayout'; 
import { Box, CircularProgress, Typography } from '@mui/material';

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  const {isAuthenticated, isAuthorized } = useProtectRoute('admin', '/'); 
  if (!isAuthenticated || !isAuthorized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Cargando panel de administración...</Typography>
      </Box>
    );
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}