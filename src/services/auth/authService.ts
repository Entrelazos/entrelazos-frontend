import axios, { AxiosResponse } from 'axios';
import {
  Credentials,
  RegisterData,
  AuthResponse,
} from '../../types/auth/AuthTypes';

const authService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/auth`
    : 'https://pear-clear-sockeye.cyclic.app/auth',
});

export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await authService.post(
    '/register',
    registerData
  );
  const { accessToken } = response.data;
  setAuthToken(accessToken); // Set the authentication token in Axios headers
  return response.data;
};

export const login = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await authService.post(
    '/login',
    credentials
  );
  const { accessToken } = response.data;
  setAuthToken(accessToken); // Set the authentication token in Axios headers
  return response.data;
};

export const logout = (): void => {
  clearAuthToken();
};

export const getNewAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const response = await authService.post('/refresh-token', { refreshToken });
    const { accessToken } = response.data;
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async (): Promise<any> => {
  const response: AxiosResponse<any> = await authService.get('/user');
  return response.data;
};

const setAuthToken = (accessToken: string): void => {
  if (accessToken) {
    authService.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken}`;
  } else {
    delete authService.defaults.headers.common['Authorization'];
  }
};

const clearAuthToken = (): void => {
  delete authService.defaults.headers.common['Authorization'];
};

export default authService;
