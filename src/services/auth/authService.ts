import axios, { AxiosResponse } from 'axios';
import {
  Credentials,
  RegisterData,
  AuthResponse,
} from '../../types/auth/AuthTypes';
import { createAxiosInstance } from '../axiosFactory';
import { User } from '../../types/user/UserTypes';
import { ERROR_CODES } from '../../constants/error-codes';

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

const SOY_MISIONERO_URL = 'https://back.misioneroslam.com/api/misionero';

export const checkActiveMissionary = async (id: number) => {
  try {
    const response = await axios.get(`${SOY_MISIONERO_URL}/${id}`, {
      headers: {
        'lam-token': import.meta.env.VITE_LAM_TOKEN,
      },
    });
    const { misionero } = response.data;
    return misionero;
  } catch (error) {
    throw new Error(error || 'Failed to check activeness');
  }
};

export const register = async (
  registerData: RegisterData
): Promise<AuthResponse> => {
  try {
    const { activo } = await checkActiveMissionary(
      parseInt(registerData.identification)
    );
    if (!activo || activo?.toLowerCase() === 'n') {
      const error = new Error('Misionero no encontrado o inactivo');
       
      (error as any).code = ERROR_CODES.NOT_ACTIVE_MISSIONARY;
      throw error;
    }
    const response: AxiosResponse<AuthResponse> = await authService.post(
      '/register',
      registerData
    );
    const { accessToken } = response.data;
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Misionero no encontrado o inactivo');
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
    const { accessToken, refreshToken, identification } = response.data;
    const { activo } = await checkActiveMissionary(parseInt(identification));
    if (!activo || activo?.toLowerCase() === 'n') {
      const error = new Error('Misionero no encontrado o inactivo');
       
      (error as any).code = ERROR_CODES.NOT_ACTIVE_MISSIONARY;
      throw error;
    }
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuthToken(accessToken); // Set the authentication token in Axios headers
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Misionero no encontrado o inactivo');
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
