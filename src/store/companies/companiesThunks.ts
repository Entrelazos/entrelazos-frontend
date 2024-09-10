import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCompanies,
  getCompanyByName,
} from '../../services/companies/companyService';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { getUserCompanies } from '../../services/user/userService';

export const fetchCompaniesData = createAsyncThunk(
  'companies/fetchCompaniesData',
  async (options: {
    page: number;
    limit: number;
    categoryIds: number[];
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getAllCompanies(
      options.page,
      options.limit,
      options.categoryIds
    );
    return response;
  }
);

export const fetchCompanyByName = createAsyncThunk(
  'companies/fetchCompanyByName',
  async (name: string): Promise<CompanyItem> => {
    const response: CompanyItem = await getCompanyByName(name);
    return response;
  }
);

export const fetchUserCompanies = createAsyncThunk(
  'companies/fetchUserCompanies',
  async ({
    userId,
    options,
  }: {
    userId: number;
    options: { page: number; limit: number };
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getUserCompanies(
      userId,
      options
    );
    return response;
  }
);
