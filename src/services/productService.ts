
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`; 

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  sku: string; 
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

const handleResponse = async (response: Response) => {
  if (response.status === 204) { 
    return null; 
  }

  const data = await response.json(); 
  if (!response.ok) {
    const errorMessage = data.message || data.error || 'Ocurrió un error inesperado.';
    throw new Error(errorMessage);
  }
  return data;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllProducts = async (filters?: FilterProductDto): Promise<Product[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    for (const key in filters) {
      if (filters[key as keyof FilterProductDto] !== undefined) {
        queryParams.append(key, String(filters[key as keyof FilterProductDto]));
      }
    }
  }
  const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), 
    },
  });
  return handleResponse(response);
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), 
    },
  });
  return handleResponse(response);
};


export const createProduct = async (
  productData: Omit<Product, 'id' | 'sellerId' | 'createdAt' | 'updatedAt' | 'imageUrl'>,
  image: File 
): Promise<Product> => {
  const formData = new FormData();
  formData.append('image', image); 

  for (const key in productData) {
    if (Object.prototype.hasOwnProperty.call(productData, key)) {
      formData.append(key, String((productData as any)[key])); 
    }
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(), 
    },
    body: formData,
  });
  return handleResponse(response);
};

export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, 'id' | 'sellerId' | 'createdAt' | 'updatedAt' | 'imageUrl'>>,
  image?: File | null 
): Promise<Product> => {
  const formData = new FormData();

  for (const key in productData) {
    if (Object.prototype.hasOwnProperty.call(productData, key)) {
      formData.append(key, String((productData as any)[key]));
    }
  }

  if (image) {
    formData.append('image', image); 
  } 

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH', 
    headers: {
      ...getAuthHeaders(), 
    },
    body: formData,
  });

  console.log('Response', response);
  return handleResponse(response);
};

export const deleteProduct = async (id: string): Promise<any> => { 
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
};