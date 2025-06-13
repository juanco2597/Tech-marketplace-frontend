'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Paper, Grid, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getProductById, updateProduct} from '../../../../../services/productService'; 

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
  imageUrl?: string; 
  sellerId: string;
  seller?: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: '',
    category: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct as Product);
        setFormData({
          name: fetchedProduct.name,
          sku: fetchedProduct.sku,
          quantity: fetchedProduct.quantity.toString(),
          price: fetchedProduct.price.toString(),
          category: fetchedProduct.category || '',
          description: fetchedProduct.description || '',
        });
        setPreviewImage(fetchedProduct.imageUrl ?? null);
      } catch (err: any) {
        console.error('Error fetching product for edit:', err);
        setError(err.message || 'No se pudo cargar el producto para edici\u00F3n.');
        toast.error(`Error al cargar producto: ${err.message || 'Error desconocido'}`);
        router.push('/admin/products'); 
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setLoading(true);
    setError(null);

    const productUpdatePayload = {
      name: formData.name,
      sku: formData.sku,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
    };


    try {
      await updateProduct(productId, productUpdatePayload);
      toast.success('Producto actualizado exitosamente.');
      router.push('/admin/products'); 
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Error desconocido al actualizar el producto.');
      toast.error(`Error al actualizar el producto: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando datos del producto...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => router.push('/admin/products')} sx={{ mt: 2 }}>Volver a la lista de productos</Button>
      </Box>
    );
  }

  if (!product) { 
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Producto no encontrado.</Alert>
        <Button onClick={() => router.push('/admin/products')} sx={{ mt: 2 }}>Volver a la lista de productos</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Producto: {product.name}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Nombre del Producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Cantidad"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
           <Grid size={{xs:12}}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Imagen del Producto</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage && (
                <Box sx={{ mt: 2 }}>
                  <img src={previewImage} alt="Previsualizacion del producto" style={{ maxWidth: '200px', height: 'auto', border: '1px solid #ddd' }} />
                </Box>
              )}
            </Grid>
            <Grid size={{xs:12}}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Actualizar Producto'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => router.push('/admin/products')}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProductPage;