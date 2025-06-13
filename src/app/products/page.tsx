'use client'; 

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, TextField, Button } from '@mui/material';
import { getAllProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

interface FilterProductDto {
  name?: string;
  sku?: string;
  minPrice?: number;
  maxPrice?: number;
}


const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [skuSearch, setSkuSearch] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [currentFilters, setCurrentFilters] = useState<FilterProductDto>({});
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllProducts(currentFilters);
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message || "No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [currentFilters]); 

  const handleApplyFilters = () => {
    setCurrentFilters({
      name: searchTerm.trim() !== '' ? searchTerm.trim() : undefined,
      sku: skuSearch.trim() !== '' ? skuSearch.trim() : undefined,
      minPrice: minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSkuSearch('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentFilters({}); 
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando productos...</Typography>
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

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Explora Todos Nuestros Productos
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Buscar por SKU"
          variant="outlined"
          value={skuSearch}
          onChange={(e) => setSkuSearch(e.target.value)}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="Precio Minimo"
          variant="outlined"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ width: 120 }}
          inputProps={{ min: "0" }} 
        />
        <TextField
          label="Precio Maximo"
          variant="outlined"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ width: 120 }}
          inputProps={{ min: "0" }}
        />
        <Button variant="contained" onClick={handleApplyFilters} sx={{ height: 56 }}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleClearFilters} sx={{ height: 56 }}>
          Limpiar Filtros
        </Button>
      </Box>

      {products.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No se encontraron productos con los filtros aplicados.
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid key={product.id} size={{xs:12, sm:6, md:4, lg:3}} >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductsPage;