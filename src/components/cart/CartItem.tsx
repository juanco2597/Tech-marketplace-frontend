'use client';

import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CartItem as ICartItem } from '../../redux/features/cart/cartSlice'; 

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleRemoveItem = () => {
    onRemoveItem(item.id);
  };

  return (
    <Card sx={{ display: 'flex', marginBottom: 2, p: 1, boxShadow: 1, alignItems: 'center' }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, objectFit: 'contain', mr: 2 }}
        image={item.imageUrl}
        alt={item.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Precio: ${item.price.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton size="small" onClick={handleDecreaseQuantity} disabled={item.quantity <= 1}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 1 }}>
            {item.quantity}
          </Typography>
          <IconButton size="small" onClick={handleIncreaseQuantity} disabled={item.quantity >= item.stock}>
            <AddIcon />
          </IconButton>
          <IconButton size="small" color="error" sx={{ ml: 2 }} onClick={handleRemoveItem}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;