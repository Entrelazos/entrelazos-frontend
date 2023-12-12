import axios, { AxiosResponse } from 'axios';
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

export const getAllCompanies = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await companyService.get('/');
    return response.data
  } catch (error) {
    
  };
};

export default companyService;