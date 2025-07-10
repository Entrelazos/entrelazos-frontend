// src/slices/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  ProductApiResponse,
  ProductByCompanyApiResponse,
} from '../../types/products/ProductsTypes';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async ({
    page,
    limit,
    search = '',
  }: {
    page: number;
    limit: number;
    search?: string;
  }) => {
    const response = await axios.get(`/api/products`, {
      params: { page, limit, search },
    });
    return response.data;
  }
);

// Async thunk for fetching products by company
export const fetchProductsByCompanyId = createAsyncThunk(
  'products/fetchProductsByCompanyId',
  async ({
    companyId,
    page,
    limit,
  }: {
    companyId: number;
    page: number;
    limit: number;
  }) => {
    const response = await axios.get(`/api/companies/${companyId}/products`, {
      params: { page, limit },
    });
    return response.data;
  }
);

// Async thunk for fetching products by category
export const fetchProductsByCategoryId = createAsyncThunk(
  'products/fetchProductsByCategoryId',
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

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ProductsState {
  byCompany: AsyncState<ProductByCompanyApiResponse>;
  byCategory: AsyncState<ProductApiResponse>;
  all: AsyncState<ProductByCompanyApiResponse>;
}

const initialAsyncState = <T>(): AsyncState<T> => ({
  data: null,
  loading: false,
  error: null,
});

const initialState: ProductsState = {
  byCompany: initialAsyncState<ProductByCompanyApiResponse>(),
  byCategory: initialAsyncState<ProductApiResponse>(),
  all: initialAsyncState<ProductByCompanyApiResponse>(),
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsData: (state) => {
      state.byCompany = initialAsyncState<ProductByCompanyApiResponse>();
      state.byCategory = initialAsyncState<ProductApiResponse>();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.all.loading = true;
        state.all.error = null;
      })
      .addCase(
        fetchAllProducts.fulfilled,
        (state, action: PayloadAction<ProductByCompanyApiResponse>) => {
          state.all.loading = false;
          state.all.data = action.payload;
        }
      )
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.all.loading = false;
        state.all.error =
          action.error.message || 'Failed to fetch all products';
      })
      // Handle fetchProductsByCompanyId
      .addCase(fetchProductsByCompanyId.pending, (state) => {
        state.byCompany.loading = true;
        state.byCompany.error = null;
      })
      .addCase(
        fetchProductsByCompanyId.fulfilled,
        (state, action: PayloadAction<ProductByCompanyApiResponse>) => {
          state.byCompany.loading = false;
          state.byCompany.data = action.payload;
        }
      )
      .addCase(fetchProductsByCompanyId.rejected, (state, action) => {
        state.byCompany.loading = false;
        state.byCompany.error =
          action.error.message || 'Failed to fetch products by company';
      })

      // Handle fetchProductsByCategoryId
      .addCase(fetchProductsByCategoryId.pending, (state) => {
        state.byCategory.loading = true;
        state.byCategory.error = null;
      })
      .addCase(
        fetchProductsByCategoryId.fulfilled,
        (state, action: PayloadAction<ProductApiResponse>) => {
          state.byCategory.loading = false;
          state.byCategory.data = action.payload;
        }
      )
      .addCase(fetchProductsByCategoryId.rejected, (state, action) => {
        state.byCategory.loading = false;
        state.byCategory.error =
          action.error.message || 'Failed to fetch products by category';
      });
  },
});

export const { clearProductsData } = productsSlice.actions;

export default productsSlice.reducer;
