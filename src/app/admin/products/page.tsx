'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import {getAllProducts, deleteProduct} from '../../../services/productService'; 

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Error desconocido al cargar productos.');
      toast.error(`Error al cargar productos: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('\u00BFEst\u00E1 seguro de que desea eliminar este producto? Esta acción es irreversible.')) {
      setLoading(true);
      setError(null);
      try {
        await deleteProduct(productId);
        toast.success('Producto eliminado exitosamente.');
        setProducts(products.filter(p => p.id !== productId)); 
      } catch (err: any) {
        console.error('Error deleting product:', err);
        setError(err.message || 'Error desconocido al eliminar el producto.');
        toast.error(`Error al eliminar el producto: ${err.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  console.log('products =>', products);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion de Productos
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Cargando productos...</Typography>
        </Box>
      )}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      {!loading && products.length === 0 && !error ? (
         <Alert severity="info" sx={{ my: 2 }}>No hay productos registrados.</Alert>
      ) : (
        <Paper>
          <StyledTableContainer>
            <Table aria-label="productos table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Vendedor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.seller?.email || 'N/A'}</TableCell> 
                    
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(product.id)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AdminProductsPage;