export interface Product {
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

export interface FilterProductDto {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sellerId?: string;
}