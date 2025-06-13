
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`;

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface ShippingAddressDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  shippingAddress: ShippingAddressDto;
}


export interface OrderItem { 
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    priceAtOrder: number;
    imageUrl: string;
    sellerId: string;
}

export interface Order {
    id: string;
    buyerId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: ShippingAddressDto;
    createdAt: string;
    updatedAt: string;
    sellerIds: string[];
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

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(orderData),
    });
    return handleResponse(response);
};


export const getOrder = async (): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    return handleResponse(response);
};

export const getOrderById = async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    return handleResponse(response);
};

export const getMyOrders = async (): Promise<Order[]> => {
    const response = await fetch(API_BASE_URL, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), 
        },
    });
    return handleResponse(response);
};