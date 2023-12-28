import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ProductApiResponse } from '../../types/products/ProductsTypes';
import { AxiosResponse } from 'axios';
import { getProductsByCompanyId } from '../../services/products/productsService';

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

export const fetchProductsData = createAsyncThunk(
  'products/fetchProductsData',
  async (): Promise<ProductApiResponse> => {
    const response: AxiosResponse<any> = await getProductsByCompanyId();
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsData.fulfilled,
        (state, action: PayloadAction<ProductApiResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchProductsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default productsSlice.reducer;
