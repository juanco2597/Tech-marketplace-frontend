'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '../../../hooks/useAppSelector'; 
import { getAllProducts, deleteProduct, Product } from '../../../services/productService'; 
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface SellerProductCardProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const SellerProductCard: React.FC<SellerProductCardProps> = ({ product, onEdit, onDelete }) => {
    console.log('Que nos trae producto ', product);
  return (
    <Grid size={{xs:12, sm:6, md:4, lg:3}} >
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/150?text=Producto'} 
          alt={product.name} 
          style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '10px' }} 
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">SKU: {product.sku}</Typography>
        <Typography variant="body2" color="text.secondary">Cantidad: {product.quantity}</Typography>
        <Typography variant="body1" color="primary">${product.price.toFixed(2)}</Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={() => onEdit(product.id)}
            size="small"
          >
            Editar
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={() => onDelete(product.id)}
            size="small"
          >
            Eliminar
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

const SellerProductsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  interface User {
    id: string;
    role: string;
  }
  const user = useAppSelector((state) => state.auth.user) as User | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerProducts = async () => {
    if (!user || user.role !== 'seller') {
      setError('Acceso denegado. Debes ser un vendedor para ver esta página.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts({ sellerId: user.id });
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching seller products:", err);
      setError(err.message || "No se pudieron cargar tus productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [user]);

  const handleEditProduct = (productId: string) => {
    router.push(`/seller/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteProduct(productId);
        alert('Producto eliminado exitosamente.');
        fetchSellerProducts();
      } catch (err: any) {
        console.error("Error deleting product:", err);
        setError(err.message || "No se pudo eliminar el producto.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando tus productos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Aún no tienes productos listados.
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => router.push('/seller/products/new')}
        >
          Añadir Mi Primer Producto
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mis Productos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => router.push('/seller/products/new')}
        >
          Añadir Nuevo Producto
        </Button>
      </Box>
      <Grid container spacing={3}>
        {products.map((product) => (
          <SellerProductCard
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default SellerProductsPage;