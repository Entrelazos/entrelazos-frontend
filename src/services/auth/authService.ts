import { AxiosResponse } from 'axios';
import {
  Credentials,
  RegisterData,
  AuthResponse,
} from '../../types/auth/AuthTypes';
import { createAxiosInstance } from '../axiosFactory';
import { User } from '../../types/user/UserTypes';

const authServiceWithAuth = createAxiosInstance({
  useAuth: true,
  handleErrors: true,
  baseEndpoint: '/auth',
});

const authService = createAxiosInstance({
  useAuth: false,
  handleErrors: false,
  baseEndpoint: '/auth',
});

export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await authService.post(
      '/register',
      registerData
    );
    const { accessToken } = response.data;
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get register');
  }
};

export const login = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await authService.post(
      '/login',
      credentials
    );
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  clearAuthToken();
};

export const getNewAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    const response = await authServiceWithAuth.post('/refresh-token', {
      refreshToken,
    });
    const { accessToken } = response.data;
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get token');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response: AxiosResponse<User> =
      await authServiceWithAuth.get('/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};

const setAuthToken = (accessToken: string): void => {
  if (accessToken) {
    authServiceWithAuth.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken}`;
  } else {
    delete authServiceWithAuth.defaults.headers.common['Authorization'];
  }
};

const clearAuthToken = (): void => {
  delete authServiceWithAuth.defaults.headers.common['Authorization'];
};
