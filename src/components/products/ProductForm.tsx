'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Product, createProduct, updateProduct } from '../../services/productService'; 

interface ProductFormProps {
  initialProduct?: Product; 
  onSave: () => void; 
  onCancel: () => void; 
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    sku: '', 
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [
    'Laptops',
    'Smartphones',
    'Accesorios',
    'Componentes PC',
    'Gaming',
    'Audio',
    'Periféricos',
    'Software',
  ];

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        description: initialProduct.description || '',
        price: initialProduct.price.toString() || '',
        quantity: initialProduct.quantity.toString() || '',
        category: initialProduct.category || '',
        sku: initialProduct.sku || '', 
      });
      setCurrentImageUrl(initialProduct.imageUrl);
      setSelectedFile(null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        sku: '', 
      });
      setSelectedFile(null);
      setCurrentImageUrl(undefined);
    }
  }, [initialProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0])); 
    } else {
      setSelectedFile(null);
      setCurrentImageUrl(initialProduct?.imageUrl || undefined); 
    }
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.price || !formData.quantity || !formData.category || !formData.sku) { 
      setError('Por favor, completa todos los campos requeridos (Nombre, SKU, Precio, Cantidad, Categoría).'); 
      setLoading(false);
      return;
    }

    
    if (!initialProduct && !selectedFile) {
        setError('Por favor, selecciona una imagen para el producto nuevo.');
        setLoading(false);
        return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        sku: formData.sku, 
      };

      if (initialProduct) {
        await updateProduct(initialProduct.id, productData, selectedFile);
        setSuccess('Producto actualizado exitosamente.');
      } else {
        if (!selectedFile) { 
            setError('La imagen es obligatoria para crear un producto.');
            setLoading(false);
            return;
        }
        await createProduct(productData, selectedFile);
        setSuccess('Producto creado exitosamente.');
        setFormData({
          name: '',
          description: '',
          price: '',
          quantity: '',
          category: '',
          sku: '', 
        });
        setSelectedFile(null);
        setCurrentImageUrl(undefined);
      }
      onSave(); 
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err.message || "Ocurrió un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {initialProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre del Producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField 
          label="SKU del Producto"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required 
        />
        <TextField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Precio"
          name="price"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          inputProps={{ step: "0.01" }}
          required
        />
        <TextField
          label="Cantidad (Stock)"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          inputProps={{ min: "0" }}
          required
        />
        <TextField
          select
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
                Imagen del Producto:
            </Typography>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'block', marginBottom: '10px' }}
            />
            {currentImageUrl && (
                <Box sx={{ mt: 1 }}>
                    <img src={currentImageUrl} alt="Vista previa" style={{ maxWidth: '200px', height: 'auto', border: '1px solid #ddd' }} />
                    <Typography variant="caption" display="block" color="text.secondary">
                        {selectedFile ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                    </Typography>
                </Box>
            )}
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ flexGrow: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : (initialProduct ? 'Actualizar Producto' : 'Crear Producto')}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            disabled={loading}
            sx={{ flexGrow: 1 }}
          >
            Cancelar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ProductForm;