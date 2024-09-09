import axios, { AxiosResponse } from 'axios';
import {
  ProductApiResponse,
  ProductItem,
} from '../../types/products/ProductsTypes';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../interceptors/authInterceptors';

const productService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/products`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

productService.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

export const getProductsByCompanyId = async (
  companyId: number,
  options: { page: number; limit: number }
): Promise<any> => {
  try {
    const response: AxiosResponse<ProductApiResponse> =
      await productService.get(`/byCompany/${companyId}`, {
        params: options,
      });
    return response.data;
  } catch (error) {}
};

export const getProductsByCategoryId = async (
  categoryId: number
): Promise<any> => {
  try {
    const response: AxiosResponse<ProductApiResponse> =
      await productService.get(`/byCategory/${categoryId}`);
    return response.data;
  } catch (error) {}
};

export default productService;
