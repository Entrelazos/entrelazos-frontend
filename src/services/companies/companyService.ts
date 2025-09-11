import { AxiosResponse } from 'axios';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { FormData } from '../../pages/Companies/components/company.form';
import { createAxiosInstance } from '../axiosFactory';
import { handleApiError } from '../../utils/errorHandler';

const companyServiceWithAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/companies',
});
const companyService = createAxiosInstance({ baseEndpoint: '/companies' });

export const getAllCompanies = async (
  page: number,
  pageSize: number,
  categoryIds: number[],
  search: string = ''
): Promise<CompanyApiResponse> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> =
      await companyService.get('', {
        params: { page, limit: pageSize, categoryIds, search },
      });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCompanyByName = async (name: string): Promise<CompanyItem> => {
  try {
    const response: AxiosResponse<CompanyItem> = await companyService.get(
      `/company/${name}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
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
    return handleApiError(error);
  }
};

export const updateCompany = async (
  companyId: number,
  payload: Partial<FormData>
): Promise<CompanyItem> => {
  try {
    const { data }: AxiosResponse<CompanyItem> =
      await companyServiceWithAuth.put(`/${companyId}`, payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default companyService;
