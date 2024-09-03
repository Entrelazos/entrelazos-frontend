import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ProductApiResponse,
  ProductItem,
} from '../../types/products/ProductsTypes';
import { AxiosResponse } from 'axios';
import {
  getProductsByCategoryId,
  getProductsByCompanyId,
} from '../../services/products/productsService';

interface ProductState {
  data: ProductApiResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchProductsByCompanyId = createAsyncThunk(
  'products/fetchProductsByCompanyId',
  async ({
    companyId,
    options,
  }: {
    companyId: number;
    options: { page: number; limit: number };
  }): Promise<ProductApiResponse> => {
    const response: AxiosResponse<any> = await getProductsByCompanyId(
      companyId,
      options
    );
    return response.data;
  }
);

export const fetchProductsByCategoryId = createAsyncThunk(
  'products/fetchProductsByCategoryId',
  async (categoryId: number): Promise<ProductApiResponse> => {
    const response: AxiosResponse<any> =
      await getProductsByCategoryId(categoryId);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCompanyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByCompanyId.fulfilled,
        (state, action: PayloadAction<ProductApiResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProductsByCompanyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchProductsByCategoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByCategoryId.fulfilled,
        (state, action: PayloadAction<ProductApiResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProductsByCategoryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { clearProductsData } = productsSlice.actions;

export default productsSlice.reducer;
