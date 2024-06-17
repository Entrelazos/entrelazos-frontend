import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductsByCategoryId,
  getProductsByCompanyId,
} from '../../services/products/productsService';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

export const fetchProductsByCompanyId = createAsyncThunk(
  'products/fetchProductsByCompanyId',
  async ({
    companyId,
    options,
  }: {
    companyId: number;
    options: { page: number; limit: number };
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getProductsByCompanyId(
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
