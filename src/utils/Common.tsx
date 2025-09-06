import { ComponentParams } from '../router/AppRouter';

const getComponentWithProps = (
  breadcrumbId: string,
  Component: React.ComponentType<any>,
  params?: ComponentParams | undefined
) => {
  switch (breadcrumbId) {
    case 'perfil-compania':
      return <Component isCompany={params?.profileParam ?? true} />;
    case 'signup':
      return <Component registerUserSuccess={params?.signUpParam ?? false} />;
    // Add more cases as needed for other breadcrumbIds
    default:
      return <Component />;
  }
};

export { getComponentWithProps };
