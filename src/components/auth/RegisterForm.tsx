'use client';

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import authService from '../../services/authService';
import { loginSuccess } from '../../redux/features/auth/authSlice'; 

interface RegisterFormProps {
  onAuthSuccess: (user: { id: string; email: string; role: string }, token: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onAuthSuccess }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const isSellerIntent = localStorage.getItem('isSellerRegistrationIntent');
    if (isSellerIntent === 'true') {
      setIsSeller(true);
      localStorage.removeItem('isSellerRegistrationIntent');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const registeredUserData = await authService.register(email, password, confirmPassword);
      setSuccess('¡Registro exitoso! Iniciando sesión...');
      console.log('Usuario registrado:', registeredUserData); 

      const loginResponse = await authService.login(email, password);
      console.log('Respuesta de login automatico:', loginResponse); 
      dispatch(loginSuccess({ user: loginResponse.user, token: loginResponse.accessToken }));
      setSuccess(prev => prev + ' Sesión iniciada.');

      if (isSeller) {
        try {
          await authService.sendSellerRequest(email);                     
          setSuccess(prev => prev + ' Tu solicitud para ser vendedor ha sido enviada al administrador.');
        } catch (sellerReqErr: any) {
          console.error('Error al enviar solicitud de vendedor:', sellerReqErr);
          setSuccess(prev => prev + ' Sin embargo, hubo un error al enviar tu solicitud de vendedor.');
          setError(sellerReqErr.message || 'Error al enviar la solicitud de vendedor.');
        }
      }
      
      onAuthSuccess(loginResponse.user, loginResponse.accessToken);

    } catch (err: any) {
      console.error('Error durante el registro o login automotico:', err);
      setError(err.message || 'Error al registrar o iniciar sesión. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Registrarse
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Correo Electronico"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isSeller}
            onChange={(e) => setIsSeller(e.target.checked)}
            name="isSeller"
            color="primary"
          />
        }
        label="Quiero ser un Vendedor"
        sx={{ mt: 1, mb: 1 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </Box>
  );
};

export default RegisterForm;