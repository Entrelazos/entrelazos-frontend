import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../services/categories/categoriesService';
import { CategoryApiResponse } from '../../types/categories/CategoryTypes';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (): Promise<CategoryApiResponse> => {
    const response: CategoryApiResponse = await getCategories();
    return response;
  }
);
