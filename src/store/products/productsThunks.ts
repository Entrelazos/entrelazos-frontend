import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductsByCompanyId } from '../../services/products/productsService';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

export const fetchProductsByCompanyIdData = createAsyncThunk(
  'products/fetchProductsByCompanyIdData',
  async (): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getProductsByCompanyId();
    return response;
  }
);
