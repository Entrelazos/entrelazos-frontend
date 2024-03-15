import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../services/interceptors/authInterceptors';

const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );
};

export { setupInterceptors };
