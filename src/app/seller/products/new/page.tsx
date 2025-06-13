'use client';

import React from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ProductForm from '../../../../components/products/ProductForm'; 

const NewProductPage: React.FC = () => {
  const router = useRouter();

  const handleSave = () => {
    router.push('/seller/products');
  };

  const handleCancel = () => {
    router.push('/seller/products');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <ProductForm onSave={handleSave} onCancel={handleCancel} />
    </Box>
  );
};

export default NewProductPage;