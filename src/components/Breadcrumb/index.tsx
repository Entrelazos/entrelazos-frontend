// Breadcrumb.js
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.length > 0 ? (
        <Link component={RouterLink} color="inherit" to="/dashboard">
          Home
        </Link>
      ) : (
        <Typography>Home</Typography>
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return isLast ? (
          <Typography key={name} color='text.primary'>{name}</Typography>
        ) : (
          <Link key={name} component={RouterLink} color="inherit" to={routeTo}>
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
