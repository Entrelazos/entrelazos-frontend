import axios, { AxiosResponse } from 'axios';
import { CategoryItem } from '../../types/categories/CategoryTypes';

const categoriesService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_PORT
    ? `${import.meta.env.VITE_BASE_URL_PORT}/categories`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

export const getCategories = async (): Promise<any> => {
  try {
    const response: AxiosResponse<CategoryItem[]> =
      await categoriesService.get('');
    return response.data;
  } catch (error) {}
};

export default categoriesService;
