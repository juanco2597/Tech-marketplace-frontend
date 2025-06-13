import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShippingAddressDto } from '../../../services/orderService'; 

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddressDto | null;
}

const initialState: CartState = {
  items: [],
  shippingAddress: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const itemToUpdate = state.items.find(item => item.id === action.payload.id);
      if (itemToUpdate) {
        itemToUpdate.quantity = action.payload.quantity;
        if (itemToUpdate.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        }
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.shippingAddress = null; 
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress'); 
    },
  
    setShippingAddress: (state, action: PayloadAction<ShippingAddressDto>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload)); 
    },
    initializeCart: (state) => {
      if (typeof window !== 'undefined') {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          state.items = JSON.parse(storedCartItems);
        }
        const storedShippingAddress = localStorage.getItem('shippingAddress'); 
        if (storedShippingAddress) {
          state.shippingAddress = JSON.parse(storedShippingAddress);
        }
      }
    },
  },
});

export const { addItemToCart, removeItemFromCart, updateItemQuantity, clearCart, setShippingAddress, initializeCart } = cartSlice.actions;
export default cartSlice.reducer;