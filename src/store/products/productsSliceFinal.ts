// src/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  ProductApiResponse,
  ProductByCompanyApiResponse,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { fetchProductsByCompanyId } from './productsThunks';

// Async thunk for fetching products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({
    categoryId,
    page,
    limit,
  }: {
    categoryId: number;
    page: number;
    limit: number;
  }) => {
    const response = await axios.get(`/api/categories/${categoryId}/products`, {
      params: { page, limit },
    });
    return response.data;
  }
);

interface ProductsState {
  byCompany: ProductByCompanyApiResponse | null;
  byCategory: ProductApiResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  byCompany: null,
  byCategory: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsData: (state) => {
      state.byCompany = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProductsByCompany actions
      .addCase(fetchProductsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByCompanyId.fulfilled,
        (state, action: PayloadAction<ProductByCompanyApiResponse>) => {
          state.loading = false;
          state.byCompany = action.payload;
        }
      )
      .addCase(fetchProductsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch products by company';
      })

      // Handle fetchProductsByCategory actions
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.byCategory = action.payload.items;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch products by category';
      });
  },
});

export default productsSlice.reducer;
