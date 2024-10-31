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

const getComponentWithProps = (
  breadcrumbId: string,
  Component: React.ComponentType<any>
) => {
  switch (breadcrumbId) {
    case 'perfil-compania':
      return <Component isCompany={true} />;
    // Add more cases as needed for other breadcrumbIds
    default:
      return <Component />;
  }
};

export { setupInterceptors, getComponentWithProps };
