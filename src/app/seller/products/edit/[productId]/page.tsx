import React from 'react';
import EditProductClientPage from '../../../../../components/products/EditProductClientPage'; 


export default async function EditProductPage({ params }: { params: any }) {
  const { productId } = params;
  return (
    <div>
      <EditProductClientPage productId={productId} />
    </div>
  );
};

