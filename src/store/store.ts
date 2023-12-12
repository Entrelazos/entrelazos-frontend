import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import companiesSlice from './companies/companiesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    companies: companiesSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
