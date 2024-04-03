import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductsByCategoryId,
  getProductsByCompanyId,
} from '../../services/products/productsService';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

export const fetchProductsByCompanyIdData = createAsyncThunk(
  'products/fetchProductsByCompanyIdData',
  async (): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getProductsByCompanyId();
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
