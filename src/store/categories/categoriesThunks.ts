import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../services/categories/categoriesService';
import {
  CategoryApiResponse,
  CategoryItem,
} from '../../types/categories/CategoryTypes';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (): Promise<CategoryItem[]> => {
    const response: CategoryItem[] = await getCategories();
    return response;
  }
);
