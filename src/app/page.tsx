'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Container, Grid, CircularProgress, Alert, 
  Card, CardContent 
} from '@mui/material';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import {getAllProducts} from '../services/productService';
import { Product } from '../types/product';


declare global {
  interface Window {
    openAuthModal?: (tab: 'login' | 'register') => void;
  }
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const popularCategories = [
    { name: 'Laptops',  link: '/products' },
    { name: 'Smartphones',  link: '/products' },
    { name: 'Accesorios', link: '/products'},
    { name: 'Componentes PC', link: '/products' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message || 'Error al cargar productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log('Producto añadido al carrito:', product.name);
    alert(`"${product.name}" añadido al carrito.`);
  };

  const handleOpenRegisterModalForSeller = () => {
    if (window.openAuthModal) {
      localStorage.setItem('isSellerRegistrationIntent', 'true');
      window.openAuthModal('register'); 
    } else {
      console.warn('openAuthModal no está disponible en window. Probablemente el Header no se ha renderizado o configurado.');
      alert('Para registrarte como vendedor, por favor usa el botón "Entrar" y selecciona "Registrarse".');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          textAlign: 'center', bgcolor: 'primary.main', color: 'white', py: 8,
          borderRadius: 2, mb: 6, backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: 3, position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'rotate(20deg)', zIndex: 0, }} />
        <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'rotate(-40deg)', zIndex: 0, }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
          ¡Bienvenido a Tech Marketplace!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          Tu destino ideal para la tecnología más avanzada.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} href="/products" sx={{ position: 'relative', zIndex: 1 }}>
          Explorar Productos
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Productos Destacados
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : products.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No hay productos destacados disponibles en este momento.
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.slice(0, 4).map((product) => (
            <Grid key={product.id} size={{xs:12, sm:6, md:4, lg:3}}  display="flex">
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Explora por Categorías
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {popularCategories.map((category) => (
            <Grid key={category.name}  size={{ xs: 12, sm: 6, md: 3 }} >
              <Card sx={{ textAlign: 'center', py: 2, '&:hover': { boxShadow: 6, transform: 'scale(1.02)' }, transition: '0.3s' }}>
                <Link href={category.link || '#'} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {products.length > 4 && (
        <Box sx={{ my: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Nuevos en la Tienda
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {products.slice(4, 8).map((product) => (
              <Grid key={product.id}  size={{ xs: 12, sm: 6, md: 4, lg:3 }}  display="flex">
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box
        sx={{
          textAlign: 'center',
          bgcolor: 'secondary.main',
          color: 'white',
          py: 6,
          borderRadius: 2,
          mt: 6,
          mb: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          ¿Eres un Vendedor? ¡Únete a nuestra comunidad Tech!
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Regístrate hoy para empezar a vender tus productos.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          onClick={handleOpenRegisterModalForSeller}
        >
          Registrarse Ahora
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;