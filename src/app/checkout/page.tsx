'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, } from '../../hooks/useAppDispatch';
import { useAppSelector, } from '../../hooks/useAppSelector';
import { setShippingAddress } from '../../redux/features/cart/cartSlice'; 
import { ShippingAddressDto } from '../../services/orderService'; 

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();


  const currentShippingAddress = useAppSelector((state) => state.cart.shippingAddress); 

  const [shippingAddress, setShippingAddressForm] = useState<ShippingAddressDto>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentShippingAddress) {
      setShippingAddressForm(currentShippingAddress);
    }
  }, [currentShippingAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddressForm((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

  
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      setError('Todos los campos de dirección son obligatorios.');
      return;
    }

    dispatch(setShippingAddress(shippingAddress));
    router.push('/cart');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Información de Envio
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{xs:12}}>
              <TextField
                label="Direccion"
                name="street"
                fullWidth
                value={shippingAddress.street}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Ciudad"
                name="city"
                fullWidth
                value={shippingAddress.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Estado/Provincia"
                name="state"
                fullWidth
                value={shippingAddress.state}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}} >
              <TextField
                label="Codigo Postal"
                name="zipCode"
                fullWidth
                value={shippingAddress.zipCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Pais"
                name="country"
                fullWidth
                value={shippingAddress.country}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                Continuar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CheckoutPage;