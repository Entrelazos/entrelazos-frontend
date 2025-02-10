import {
  requestInterceptor,
  requestErrorInterceptor,
} from '../services/interceptors/authInterceptors';
import { ComponentParams } from '../router/AppRouter';

const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );
};

const getComponentWithProps = (
  breadcrumbId: string,
  Component: React.ComponentType<any>,
  params?: ComponentParams
) => {
  switch (breadcrumbId) {
    case 'perfil-compania':
      return <Component isCompany={params.profileParam} />;
    case 'signup':
      return <Component registerUserSuccess={params.signUpParam} />;
    // Add more cases as needed for other breadcrumbIds
    default:
      return <Component />;
  }
};

export { setupInterceptors, getComponentWithProps };
