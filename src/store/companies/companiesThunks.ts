import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCompanies } from '../../services/companies/companyService';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

export const fetchCompaniesData = createAsyncThunk(
  'companies/fetchCompaniesData',
  async (options: {
    page: number;
    limit: number;
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getAllCompanies(
      options.page,
      options.limit
    );
    return response;
  }
);
