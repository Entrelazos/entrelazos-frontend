import axios, { AxiosResponse } from 'axios';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../interceptors/authInterceptors';

const userService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/user`
    : 'https://pear-clear-sockeye.cyclic.app/user',
});
userService.interceptors.request.use(
  requestInterceptor,
  requestErrorInterceptor
);

export const getAllUsers = async (): Promise<any> => {
  const response: AxiosResponse<any> = await userService.get('/list');
  return response.data;
};

export default userService;
