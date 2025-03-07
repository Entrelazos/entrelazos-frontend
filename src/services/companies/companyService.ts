import { AxiosResponse } from 'axios';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { FormData } from '../../pages/Companies/components/company.form';
import { createAxiosInstance } from '../axiosFactory';

const companyServiceWithAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/companies',
});
const companyService = createAxiosInstance({ baseEndpoint: '/companies' });

export const getAllCompanies = async (
  page: number,
  pageSize: number,
  categoryIds: number[]
): Promise<CompanyApiResponse> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> =
      await companyService.get('', {
        params: { page, limit: pageSize, categoryIds },
      });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get companies');
  }
};

export const getCompanyByName = async (name: string): Promise<CompanyItem> => {
  try {
    const response: AxiosResponse<CompanyItem> = await companyService.get(
      `/company/${name}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get company');
  }
};

export const createCompany = async (
  payload: FormData
): Promise<CompanyItem> => {
  try {
    const { data }: AxiosResponse<CompanyItem> =
      await companyServiceWithAuth.post('', payload);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to get create company'
    );
  }
};

export default companyService;
