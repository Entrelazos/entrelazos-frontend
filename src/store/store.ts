import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import apiSlice from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    api: apiSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
