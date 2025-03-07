import axios, { AxiosInstance } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL_PORT || 'http://localhost:3000';

interface AxiosFactoryOptions {
  useAuth?: boolean;
  handleErrors?: boolean;
  baseEndpoint?: string;
}

export const createAxiosInstance = ({
  useAuth = false,
  handleErrors = false,
  baseEndpoint = '',
}: AxiosFactoryOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}${baseEndpoint}`,
    headers: { 'Content-Type': 'application/json' },
  });

  // ✅ Attach Authorization Interceptor (Only for protected requests)
  if (useAuth) {
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // ✅ Attach Token Refresh & Error Handling (Only for protected requests)
  if (useAuth && handleErrors) {
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const originalRequest = error.config;

          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return instance(originalRequest); // Retry request with new token
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return instance;
};

// ✅ Function to Refresh Access Token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Store new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect to login if refresh fails
    return null;
  }
};
