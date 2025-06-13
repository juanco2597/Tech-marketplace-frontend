'use client'; 

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getProductById, Product } from '../../services/productService'; 
import ProductForm from './ProductForm'; 

interface EditProductClientPageProps {
  productId: string; 
}

const EditProductClientPage: React.FC<EditProductClientPageProps> = ({ productId }) => {
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId); 
        setProduct(data);
      } catch (err: any) {
        console.error("Error fetching product for edit:", err);
        setError(err.message || "No se pudo cargar el producto para editar.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]); 

  const handleSave = () => {
    router.push('/seller/products');
  };

  const handleCancel = () => {
    router.push('/seller/products');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando producto...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Producto no encontrado.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <ProductForm initialProduct={product} onSave={handleSave} onCancel={handleCancel} />
    </Box>
  );
};

export default EditProductClientPage;