'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  useMediaQuery, useTheme 
} from '@mui/material';
import Link from 'next/link';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import AuthModal from '../auth/AuthModal';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu'; 
import PersonIcon from '@mui/icons-material/Person'; 

const Header = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    handleCloseNavMenu(); 
  };

  const handleOpenAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
    handleCloseNavMenu(); 
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalInitialTab('login');
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.openAuthModal = handleOpenAuthModal;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.openAuthModal;
      }
    };
  }, []);

  const navItems = [
    { text: 'Productos', href: '/products', show: !isAuthenticated || user?.role === 'buyer' },
    { text: 'Mi Tienda', href: '/seller/products', show: isAuthenticated && user?.role === 'seller' },
    { text: 'Mis \u00D3rdenes', href: '/my-orders', show: isAuthenticated && user?.role === 'buyer' },
    { text: 'Panel Admin', href: '/admin', show: isAuthenticated && user?.role === 'admin' },
  ].filter(item => item.show); 
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          noWrap 
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} 
        >
          <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
            Tech Marketplace
          </Link>
        </Typography>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }} 
        >
          <Link href="/" passHref style={{ color: 'inherit', textDecoration: 'none', fontSize: '1.2rem' }}>
            Tech Mkt
          </Link>
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.href}
              color="inherit"
              component={Link}
              href={item.href}
              passHref
              onClick={handleCloseNavMenu} 
            >
              {item.text}
            </Button>
          ))}

          {(!isAuthenticated || user?.role === 'buyer') && (
            <Button color="inherit" component={Link} href="/cart" passHref sx={{ ml: 1 }}>
              <ShoppingCartIcon />
            </Button>
          )}

          <Box sx={{ ml: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                  Hola, {user?.email}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => handleOpenAuthModal('login')} startIcon={<PersonIcon />}>
                Entrar
              </Button>
            )}
          </Box>
        </Box>


        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {(!isAuthenticated || user?.role === 'buyer') && (
            <IconButton color="inherit" component={Link} href="/cart" passHref size="large" sx={{ mr: 1 }}>
              <ShoppingCartIcon />
            </IconButton>
          )}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.href} onClick={handleCloseNavMenu}>
                <Link href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  <Typography textAlign="center">{item.text}</Typography>
                </Link>
              </MenuItem>
            ))}

            <MenuItem onClick={handleCloseNavMenu}>
              {isAuthenticated ? (
                <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Hola, {user?.email}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ width: '100%' }}
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenAuthModal('login')}
                  startIcon={<PersonIcon />}
                  sx={{ width: '100%' }}
                >
                  Entrar
                </Button>
              )}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      <AuthModal open={isAuthModalOpen} onClose={handleCloseAuthModal} initialTab={authModalInitialTab} />
    </AppBar>
  );
};

export default Header;