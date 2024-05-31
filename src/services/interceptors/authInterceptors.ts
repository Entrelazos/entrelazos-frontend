import { InternalAxiosRequestConfig } from 'axios';
import { store } from '../../store/store';
import { decodeJwt, isTokenExpired } from '../../utils/jsonUtils';
import { startGetNewAccessToken } from '../../store/auth';
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const authInfo = store.getState().auth.auth;
  const { accessToken, refreshToken } = authInfo;
  if (accessToken) {
    let newAccessToken = accessToken;
    const jwtData = decodeJwt(accessToken);
    const { exp } = jwtData;
    if (isTokenExpired(exp)) {
      await store.dispatch(startGetNewAccessToken(refreshToken));
      newAccessToken = store.getState().auth.auth.accessToken;
    }
    config.headers.Authorization = `Bearer ${newAccessToken}`;
  }
  return config;
};

const requestErrorInterceptor = (error: any) => {
  // Handle request error
  console.error('Request Error Interceptor:', error);
  return Promise.reject(error);
};

export { requestInterceptor, requestErrorInterceptor };
