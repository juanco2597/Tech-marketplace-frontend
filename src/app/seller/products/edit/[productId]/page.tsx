import React from 'react';
import EditProductClientPage from '../../../../../components/products/EditProductClientPage'; 

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
  const { productId } = params;
  return (
    <EditProductClientPage productId={productId} />
  );
};

export default EditProductPage;