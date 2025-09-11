import { AxiosResponse } from 'axios';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { createAxiosInstance } from '../axiosFactory';

const categoriesService = createAxiosInstance({ baseEndpoint: '/categories' });

export const getCategories = async (): Promise<CategoryItem[]> => {
  try {
    const response: AxiosResponse<CategoryItem[]> =
      await categoriesService.get('');
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      throw new Error(
        apiError.response?.data?.message || 'Failed to get categories'
      );
    }
    throw new Error('Failed to get categories');
  }
};

export default categoriesService;
