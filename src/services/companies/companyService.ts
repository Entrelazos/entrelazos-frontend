import axios, { AxiosResponse } from 'axios';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

const companyService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/companies`
    : 'https://pear-clear-sockeye.cyclic.app/companies',
});

export const getAllCompanies = async (page, pageSize): Promise<any> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> =
      await companyService.get('', { params: { page, limit: pageSize } });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createCompany = async (payload): Promise<any> => {
  try {
    await companyService.post('', payload);
  } catch (error) {
    console.log(error);
  }
};

export default companyService;
