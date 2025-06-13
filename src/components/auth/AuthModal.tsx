'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Box, Tabs, Tab } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAppDispatch } from '../../hooks/useAppDispatch'; 
import { loginSuccess, closeLoginModal } from '../../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation'; 
import { useAppSelector } from '@/hooks/useAppSelector';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register'; 
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  outline: 'none',
};

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialTab = 'login' }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(initialTab === 'register' ? 1 : 0);
  const redirectAfterLogin = useAppSelector((state) => state.auth.redirectAfterLogin);

  useEffect(() => {
    if (open) {
      setTabValue(initialTab === 'register' ? 1 : 0);
    }
  }, [initialTab, open]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    dispatch(closeLoginModal());
    onClose();
  };

  const handleAuthSuccess = (user: { id: string; email: string; role: string }, token: string) => {
    dispatch(loginSuccess({ user, token }));
    handleClose(); 

    if (redirectAfterLogin) {
      router.push(redirectAfterLogin);
    } else {
      router.push('/'); 
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleChange} aria-label="auth tabs" centered>
            <Tab label="Iniciar Sesión" {...a11yProps(0)} />
            <Tab label="Registrarse" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <LoginForm onAuthSuccess={handleAuthSuccess} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <RegisterForm onAuthSuccess={handleAuthSuccess} />
        </CustomTabPanel>
      </Box>
    </Modal>
  );
};

export default AuthModal;