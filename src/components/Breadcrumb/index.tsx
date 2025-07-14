import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES_INFO } from '../../constants/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Breadcrumb = () => {
  const { byCompany } = useSelector((state: RootState) => state.products);
  const { data } = byCompany;
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const updatedBreadcrumbs = [];

    if (pathnames.includes('login')) {
      setBreadcrumbs(updatedBreadcrumbs);
      return;
    }

    const isHomePage = pathnames.length === 0 || pathnames[0] === 'dashboard';

    if (!isHomePage) {
      updatedBreadcrumbs.push({ name: 'Home', path: '/dashboard' });
    }

    pathnames.forEach((pathname, index) => {
      if (pathname === 'productos-servicios' && pathnames[index + 1]) {
        const productId = pathnames[index + 1];
        const category = data?.items?.find(
          (item) => item.id === parseInt(productId)
        );
        if (category) {
          updatedBreadcrumbs.push({
            name: 'Productos y Servicios',
            path: '/productos-servicios',
          });
          updatedBreadcrumbs.push({
            name: category.company.categories,
            path: `/productos-servicios/${productId}`,
          });
        }
      } else {
        const route = ROUTES_INFO.PRIVATE_ROUTES.find(
          ({ breadcrumbId }) => breadcrumbId === pathname
        );
        if (route) {
          updatedBreadcrumbs.push({ name: route.name, path: route.path });
        }
      }
    });

    setBreadcrumbs(updatedBreadcrumbs);
  }, [location.pathname, data?.items]);

  return (
    <Breadcrumbs aria-label='breadcrumb'>
      {breadcrumbs.map(({ name, path }, index) =>
        index === breadcrumbs.length - 1 ? (
          <Typography color='textPrimary' key={index}>
            {name}
          </Typography>
        ) : (
          <Link component={RouterLink} color='inherit' to={path} key={index}>
            {name}
          </Link>
        )
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
