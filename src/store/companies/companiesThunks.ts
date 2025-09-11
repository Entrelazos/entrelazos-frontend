import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCompanies,
  getCompanyByName,
  updateCompany,
} from '../../services/companies/companyService';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { getUserCompanies } from '../../services/user/userService';
import { FormData } from '../../pages/Companies/components/company.form';

export const fetchCompaniesData = createAsyncThunk(
  'companies/fetchCompaniesData',
  async (options: {
    page: number;
    limit: number;
    categoryIds: number[];
    search?: string;
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getAllCompanies(
      options.page,
      options.limit,
      options.categoryIds,
      options.search ? options.search : ''
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

export const updateCompanyData = createAsyncThunk(
  'companies/updateCompanyData',
  async ({
    companyId,
    formData,
  }: {
    companyId: number;
    formData: Partial<FormData>;
  }): Promise<CompanyItem> => {
    const response: CompanyItem = await updateCompany(companyId, formData);
    return response;
  }
);

export const fetchMoreCompanies = createAsyncThunk(
  'companies/fetchMoreCompanies',
  async (options: {
    page: number;
    limit: number;
    categoryIds: number[];
    search?: string;
  }): Promise<CompanyApiResponse> => {
    const response: CompanyApiResponse = await getAllCompanies(
      options.page,
      options.limit,
      options.categoryIds,
      options.search ? options.search : ''
    );
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
