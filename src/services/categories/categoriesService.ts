import { AxiosResponse } from 'axios';
import { CategoryItem } from '../../types/categories/CategoryTypes';
import { createAxiosInstance } from '../axiosFactory';

const categoriesService = createAxiosInstance({ baseEndpoint: '/categories' });

export const getCategories = async (): Promise<CategoryItem[]> => {
  try {
    const response: AxiosResponse<CategoryItem[]> =
      await categoriesService.get('');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to get categories'
    );
  }
};

export default categoriesService;
