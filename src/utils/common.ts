import { AxiosInstance } from 'axios';
import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../services/interceptors/authInterceptors';

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );
};

export { setupInterceptors };
