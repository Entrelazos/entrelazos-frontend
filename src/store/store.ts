import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
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

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  // Add other reducers here if you have them
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
  reducer: {
    auth: persistedReducer,
    companies: companiesSlice,
    categories: categoriesSlice,
    products: productsSlice,
    country: countriesSlice.reducer,
    regions: regionsSlice.reducer,
    cities: citiesSlice.reducer,
  },
});

export const persistor = persistStore(store);

// Debugging
persistor.subscribe(() => {
  console.log('Rehydrated state:', store.getState());
});

setupInterceptors(companyService);
setupInterceptors(categoriesService);
setupInterceptors(productService);
setupInterceptors(geoService);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
