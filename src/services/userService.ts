import { getAuthHeaders, handleResponse } from './authService'; 

const API_BASE_URL =`${process.env.NEXT_PUBLIC_API_BASE_URL}`; 

interface User {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin'; 
  createdAt: string;
  updatedAt: string;
}

interface SellerRequest {
  id: string;
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId: string, newRole: 'buyer' | 'seller' | 'admin'): Promise<User> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ role: newRole }),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId: string): Promise<void> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return handleResponse(response); 
  },

  getSellerRequests: async (): Promise<SellerRequest[]> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users/seller-requests`, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return handleResponse(response);
  },

  approveSellerRequest: async (requestId: string): Promise<SellerRequest> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users/seller-requests/${requestId}/approve`, { 
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return handleResponse(response);
  },

  rejectSellerRequest: async (requestId: string): Promise<SellerRequest> => {
    const headers = getAuthHeaders();
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida. No hay token disponible.');
    }

    const response = await fetch(`${API_BASE_URL}/users/seller-requests/${requestId}/reject`, { 
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return handleResponse(response);
  },
};

export default userService;