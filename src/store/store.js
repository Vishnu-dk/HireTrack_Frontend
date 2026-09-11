// src/store/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/api'; 

const storedToken = localStorage.getItem('ht_token');
const storedRole = localStorage.getItem('ht_role');
const storedEmail = localStorage.getItem('ht_email');

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    token: storedToken || null, 
    role: storedRole || null, 
    email: storedEmail || null,
    isAuthenticated: !!storedToken, 
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.isAuthenticated = true; 
      
      localStorage.setItem('ht_token', action.payload.token);
      localStorage.setItem('ht_role', action.payload.role);
      localStorage.setItem('ht_email', action.payload.email);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.isAuthenticated = false; 
      
      localStorage.removeItem('ht_token');
      localStorage.removeItem('ht_role');
      localStorage.removeItem('ht_email');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});