import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import companiesSlice from './companies/companiesSlice';
import companyService from '../services/companies/companyService';
import categoriesSlice from './categories/categoriesSlice';
import categoriesService from '../services/categories/categoriesService';
import productsSlice from './products/productsSlice';
import productService from '../services/products/productsService';
import { setupInterceptors } from '../utils/common';
import { citiesSlice, regionsSlice, countriesSlice } from './geo/geoSlice';
import geoService from '../services/geo/geoService';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    companies: companiesSlice,
    categories: categoriesSlice,
    products: productsSlice,
    country: countriesSlice.reducer,
    regions: regionsSlice.reducer,
    cities: citiesSlice.reducer,
  },
});

setupInterceptors(companyService);
setupInterceptors(categoriesService);
setupInterceptors(productService);
setupInterceptors(geoService);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
