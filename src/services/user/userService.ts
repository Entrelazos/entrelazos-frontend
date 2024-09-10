import axios, { AxiosResponse } from 'axios';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';

const userService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/user`
    : 'https://pear-clear-sockeye.cyclic.app/user',
});

export const getAllUsers = async (): Promise<any> => {
  const response: AxiosResponse<any> = await userService.get('/list');
  return response.data;
};

export const getUserCompanies = async (
  userId: number,
  options: { page: number; limit: number }
): Promise<any> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> = await userService.get(
      `/${userId}/companies`,
      { params: options }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export default userService;
