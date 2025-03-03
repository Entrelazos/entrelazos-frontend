import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { authSlice } from './auth';
import { companiesSlice, companySlice } from './companies/companiesSlice';
import companyService from '../services/companies/companyService';
import categoriesSlice from './categories/categoriesSlice';
import categoriesService from '../services/categories/categoriesService';
import productsSliceFinal from './products/productsSliceFinal';

import productService from '../services/products/productsService';
import { citiesSlice, regionsSlice, countriesSlice } from './geo/geoSlice';
import geoService from '../services/geo/geoService';
import { setupInterceptors } from '../utils/common';

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  company: companySlice.reducer,
  companies: companiesSlice.reducer,
  categories: categoriesSlice,
  products: productsSliceFinal,
  country: countriesSlice.reducer,
  regions: regionsSlice.reducer,
  cities: citiesSlice.reducer,
});

// Configure persist options
const persistConfig = {
  key: 'root', // Root key for the persisted state
  storage, // Storage method (e.g., localStorage, AsyncStorage)
  whitelist: ['auth'], // List of reducers to persist
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducers
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Debugging
persistor.subscribe(() => {
  console.log('Rehydrated state:', store.getState());
});

// setTimeout(() => {
//   setupInterceptors(companyService);
//   setupInterceptors(categoriesService);
//   setupInterceptors(productService);
//   setupInterceptors(geoService);
// }, 300);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
