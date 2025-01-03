import axios, { AxiosResponse } from 'axios';
import { ProductApiResponse } from '../../types/products/ProductsTypes';

const productService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_PORT
    ? `${import.meta.env.VITE_BASE_URL_PORT}/products`
    : 'https://pear-clear-sockeye.cyclic.app/products',
});

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
