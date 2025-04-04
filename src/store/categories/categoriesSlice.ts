import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { fetchCategories } from './categoriesThunks';
import { CATEGORIES } from '../../constants/constants';

interface CategoryState {
  data: CategoryItem[] | null;
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
        (state, action: PayloadAction<CategoryItem[]>) => {
          state.loading = false;
          state.data = action.payload.map((categoryItem) => {
            const category = CATEGORIES.find(
              (cat) =>
                cat.name.toLowerCase() ===
                categoryItem.category_name.toLowerCase()
            );
            return {
              ...categoryItem,
              image: category ? category.image : '',
            };
          });
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default categoriesSlice.reducer;
