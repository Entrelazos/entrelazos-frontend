import axios, { AxiosResponse } from 'axios';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../interceptors/authInterceptors';
import { ProductApiResponse } from '../../types/products/ProductsTypes';

const productService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/products`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});
productService.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

export const getProductsByCompanyId = async (): Promise<any> => {
  try {
    const response: AxiosResponse<ProductApiResponse> =
      await productService.get('');
    return response.data;
  } catch (error) {}
};

export default productService;
