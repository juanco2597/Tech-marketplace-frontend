'use client'; 

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store'; 
import { initializeAuth, closeLoginModal } from '../../redux/features/auth/authSlice'; 
import { initializeCart } from '../../redux/features/cart/cartSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch'; 
import { useAppSelector } from '../../hooks/useAppSelector'; 

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import { Box } from '@mui/material';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import AuthModal from '../auth/AuthModal';
import { usePathname } from 'next/navigation';

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AppContentInternal> 
        {children}
      </AppContentInternal>
    </Provider>
  );
};

const AppContentInternal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isLoginModalOpen = useAppSelector((state) => state.auth.isLoginModalOpen);
  const routerPathname = usePathname(); 

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeCart());
  }, [dispatch]);

  const handleCloseAuthModal = () => {
    dispatch(closeLoginModal());
  };

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>

      <AuthModal
        open={isLoginModalOpen}
        onClose={handleCloseAuthModal}
      />
    </ThemeProvider>
  );
};

export default ClientProviders;