// src/store/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/api'; 

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    token: null|| localStorage.getItem('ht_token'), 
    role: null|| localStorage.getItem('ht_role'), 
    email: null|| localStorage.getItem('ht_email') },
  reducers: {

    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      localStorage.setItem('ht_token', action.payload.token);
      localStorage.setItem('ht_role', action.payload.role);
      localStorage.setItem('ht_email', action.payload.email);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      localStorage.removeItem('ht_token');
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