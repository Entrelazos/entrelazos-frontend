import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CategoryApiResponse } from '../../types/categories/CategoryTypes';
import { fetchCategories } from './categoriesThunks';

interface CategoryState {
  data: CategoryApiResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  data: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<CategoryApiResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default categoriesSlice.reducer;
