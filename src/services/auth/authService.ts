// authService.ts
import axios, { AxiosResponse } from 'axios';

interface Credentials {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

const authService = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/auth`,
});

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
  clearAuthToken(); // Clear the authentication token from Axios headers
  // Additional logout logic (e.g., redirecting, clearing local storage, etc.)
};

export const getCurrentUser = async (): Promise<any> => {
  const response: AxiosResponse<any> = await authService.get('/user');
  return response.data;
};

const setAuthToken = (accessToken: string): void => {
  if (accessToken) {
    // Set the authentication token in Axios headers
    authService.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`;
  } else {
    delete authService.defaults.headers.common['Authorization'];
  }
};

const clearAuthToken = (): void => {
  delete authService.defaults.headers.common['Authorization'];
};

export default authService;
