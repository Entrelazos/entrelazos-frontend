import axios, { AxiosResponse } from 'axios';
import {
  CategoryApiResponse,
  CategoryItem,
} from '../../types/categories/CategoryTypes';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../interceptors/authInterceptors';

const categoriesService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/categories`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

categoriesService.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

export const getCategories = async (): Promise<any> => {
  try {
    const response: AxiosResponse<CategoryItem[]> =
      await categoriesService.get('');
    return response.data;
  } catch (error) {}
};

export default categoriesService;
