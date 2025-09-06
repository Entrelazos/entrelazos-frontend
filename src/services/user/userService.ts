import { AxiosResponse } from 'axios';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';
import { User } from '../../types/user/UserTypes';
import { createAxiosInstance } from '../axiosFactory';
import { handleApiError } from '../../utils/errorHandler';

const userServiceAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/user',
});

const userService = createAxiosInstance({
  useAuth: false,
  handleErrors: false,
  baseEndpoint: '/user',
});

export const getAllUsers = async (): Promise<User> => {
  const response: AxiosResponse<User> = await userService.get('/list');
  return response.data;
};

export const getUserCompanies = async (
  userId: number,
  options: { page: number; limit: number }
): Promise<CompanyApiResponse> => {
  try {
    const response: AxiosResponse<CompanyApiResponse> =
      await userServiceAuth.get(`/${userId}/companies`, { params: options });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
export default userService;
