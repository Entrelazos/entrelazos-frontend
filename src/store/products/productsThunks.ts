import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductsByCategoryId,
  getProductsByCompanyId,
  getAllProducts,
} from '../../services/products/productsService';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';
import { ProductByCompanyApiResponse } from '../../types/products/ProductsTypes';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async ({
    page,
    limit,
    search = '',
  }: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<ProductByCompanyApiResponse> => {
    const response: ProductByCompanyApiResponse = await getAllProducts({
      page,
      limit,
      search,
    });
    return response;
  }
);

export const fetchProductsByCompanyId = createAsyncThunk(
  'products/fetchProductsByCompanyId',
  async ({
    companyId,
    options,
  }: {
    companyId: number;
    options: { page: number; limit: number };
  }): Promise<ProductByCompanyApiResponse> => {
    const response: ProductByCompanyApiResponse = await getProductsByCompanyId(
      companyId,
      options
    );
    return response;
  }
);

export const fetchProductsByCategoryId = createAsyncThunk(
  'products/fetchProductsByCategoryId',
  async (categoryId: number): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse =
      await getProductsByCategoryId(categoryId);
    return response;
  }
);
