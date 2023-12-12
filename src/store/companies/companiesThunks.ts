import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCompanies } from '../../services/companies/companyService';
import { CompanyApiResponse } from '../../types/api/ApiTypes';

export const fetchCompaniesData = createAsyncThunk(
  'companies/fetchCompaniesData',
  async (): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getAllCompanies();
    return response;
  }
);
