import axios, { AxiosResponse } from 'axios';
import { CategoryApiResponse } from '../../types/categories/CategoryTypes';

const categoriesService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/categories`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

export const getCategories = async (): Promise<any> => {
  try {
    const response: AxiosResponse<CategoryApiResponse> =
      await categoriesService.get('');
    return response.data;
  } catch (error) {}
};

export default categoriesService;
