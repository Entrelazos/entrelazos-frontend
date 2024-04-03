import axios, { AxiosResponse } from 'axios';
import {
  ProductApiResponse,
  ProductItem,
} from '../../types/products/ProductsTypes';

const productService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/products`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

export const getProductsByCompanyId = async (): Promise<any> => {
  try {
    const response: AxiosResponse<ProductApiResponse> =
      await productService.get('');
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
