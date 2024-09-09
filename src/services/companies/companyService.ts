import axios, { AxiosResponse } from 'axios';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { FormData } from '../../pages/Companies/components/company.form';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../interceptors/authInterceptors';

const companyService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/companies`
    : 'https://pear-clear-sockeye.cyclic.app/companies',
});

companyService.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

export const getAllCompanies = async (
  page: number,
  pageSize: number,
  categoryIds: number[]
): Promise<any> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> =
      await companyService.get('', {
        params: { page, limit: pageSize, categoryIds },
      });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyByName = async (name: string): Promise<any> => {
  try {
    const response: AxiosResponse<CompanyItem> = await companyService.get(
      `/company/${name}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCompany = async (payload: FormData): Promise<any> => {
  try {
    await companyService.post('', payload);
  } catch (error) {
    console.log(error);
  }
};

export default companyService;
