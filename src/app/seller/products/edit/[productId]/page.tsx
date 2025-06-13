import React from 'react';
import EditProductClientPage from '../../../../../components/products/EditProductClientPage'; 

interface EditProductPageProps {
  params: { productId: string }; 
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = params;
  return (
    <div>
      <EditProductClientPage productId={productId} />
    </div>
  );
};

