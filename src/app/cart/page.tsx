'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Alert, Modal, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { removeItemFromCart, updateItemQuantity, clearCart } from '../../redux/features/cart/cartSlice';
import { createOrder } from '../../services/orderService'; 
import { openLoginModalWithRedirect } from '@/redux/features/auth/authSlice';

const ConfirmationModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirmation-modal-title">
      <Box sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography id="confirmation-modal-title" variant="h6" component="h2" gutterBottom>
          ¡Gracias por tu compra!
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Tu orden ha sido procesada exitosamente.
        </Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={onClose}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};


const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const shippingAddress = useAppSelector((state) => state.cart.shippingAddress);
  const user = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveItem = (id: string) => {
    dispatch(removeItemFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateItemQuantity({ id, quantity }));
  };

  const handleCheckout = () => {

    if (!user) {
      dispatch(openLoginModalWithRedirect('/cart')); 
      return; 
    }

    if (!shippingAddress || !shippingAddress.street) {
      router.push('/checkout');
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    if (!user || !user.id) {
      setError('Debes iniciar sesión para completar la compra.');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('Tu carrito esta vacio.');
      setLoading(false);
      return;
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
        setError('La direcci\u00F3n de envio no esta completa. Por favor, regrese a Información de Envio.');
        setLoading(false);
        return;
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: shippingAddress,
      };

      const response = await createOrder(orderData);
      console.log('Orden creada exitosamente:', response);

      dispatch(clearCart());
      setIsModalOpen(true);

    } catch (err: any) {
      console.error('Error al crear la orden:', err);
      setError(err.message || 'Error al procesar tu compra. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/');
  };


  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Tu Carrito de Compras
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h6" align="center">Tu carrito esta vacio.</Typography>
          <Button variant="contained" color="primary" onClick={() => router.push('/products')}>
            Ver Productos
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{xs:12, md:8}}> 
            <Paper elevation={3} sx={{ p: 3 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">${item.price.toFixed(2)}</Typography>
                    <TextField
                      type="number"
                      label="Cantidad"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                      inputProps={{ min: 1 }}
                      sx={{ width: 100, mt: 1 }}
                    />
                  </Box>
                  <Button color="error" onClick={() => handleRemoveItem(item.id)}>Eliminar</Button>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:4}} > 
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Resumen de la Orden</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              {shippingAddress && shippingAddress.street ? (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Dirección de Envio:</Typography>
                  <Typography>{shippingAddress.street}</Typography>
                  <Typography>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</Typography>
                  <Typography>{shippingAddress.country}</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => router.push('/checkout')}>
                    Cambiar Dirección
                  </Button>
                </Box>
              ) : (
                <Typography color="textSecondary" sx={{ mt: 2, mb: 2 }}>
                  No se ha ingresado una dirección de envio.
                </Typography>
              )}

              {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Procesando Orden...' : (shippingAddress && shippingAddress.street ? 'Completar Compra' : 'Proceder al Envio')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      <ConfirmationModal open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default CartPage;