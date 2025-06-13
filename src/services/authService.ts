
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`

export const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (response.status === 204 || (contentType && !contentType.includes("application/json"))) {
    if (!response.ok) {
      const text = await response.text();
      const errorMessage = text || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return {};
  }

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || 'Ocurrio un error inesperado.';
    throw new Error(errorMessage);
  }
  return data;
};

export const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

const authService = {
  register: async (email: string, password: string, confirmPassword: string): Promise<User> => { 
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });
    return handleResponse(response); 
  },

  login: async (email: string, password: string): Promise<AuthResponse> => { 
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response); 
  },

  sendSellerRequest: async (email: string): Promise<any> => { 
    console.log(`Sending seller request for: ${email}`);
    const headers = getAuthHeaders(); 
    if (!headers['Authorization']) {
      throw new Error('Autenticación requerida o token invalido.');
    }

    const response = await fetch(`${API_BASE_URL}/users/request-seller-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers, 
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
};

export default authService;