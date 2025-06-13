'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useRouter } from 'next/navigation';
import { Product } from '../types/product'; 
import { useAppDispatch } from '../hooks/useAppDispatch'; 
import { addItemToCart } from '../redux/features/cart/cartSlice'; 

interface ProductCardProps {
  product: Product;
  showAddToCartButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showAddToCartButton = true }) => {
  console.log('ProductCard renderizado con producto:', product);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`); 
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({ 
      ...product, 
      quantity: 1,
      imageUrl: product.imageUrl || 'https://via.placeholder.com/150?text=Producto'
    }));
    alert(`${product.name} ha sido añadido al carrito!`); 
  };

  const productDescription = product.description || '';

  return (
    <Card sx={{ maxWidth: 345, m: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="140"
        width="100%"
        image={product.imageUrl || 'https://via.placeholder.com/150?text=Producto'}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1, height: 60 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {productDescription.substring(0, 70)}{productDescription.length > 70 ? '...' : ''}
        </Typography>
        <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        {showAddToCartButton && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            disabled={product.quantity <= 0} 
            onClick={handleAddToCart} 
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {product.quantity > 0 ? 'Añadir' : 'Sin Stock'} {}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;