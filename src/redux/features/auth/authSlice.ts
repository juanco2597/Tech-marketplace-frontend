import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: string; 
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  redirectAfterLogin: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  redirectAfterLogin: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoginModalOpen = false;
      state.redirectAfterLogin = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userString = localStorage.getItem('user'); 

        if (token && userString && userString !== 'undefined' && userString !== 'null') {
          try {
            state.token = token;
            state.user = JSON.parse(userString);
          } catch (e) {
            console.error("Error al parsear el usuario desde localStorage:", e);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('accessToken'); 
          localStorage.removeItem('user');
        }
      }
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.redirectAfterLogin = null;
    },
    openLoginModalWithRedirect: (state, action: PayloadAction<string>) => {
      state.isLoginModalOpen = true;
      state.redirectAfterLogin = action.payload;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
      state.redirectAfterLogin = null;
    },
  },
});

export const { loginSuccess, logout, initializeAuth, openLoginModal, openLoginModalWithRedirect, closeLoginModal } = authSlice.actions;
export default authSlice.reducer;