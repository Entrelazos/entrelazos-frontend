import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import MiniDrawer, { DrawerHeader } from '../components/Drawer';
import Breadcrumb from '../components/Breadcrumb';
import { ROUTES_INFO } from '../constants/constants';

export const PrivateRoute: React.FC = () => {
  const getComponentWithProps = (breadcrumbId, Component) => {
    switch (breadcrumbId) {
      case 'company-profile':
        return <Component isCompany={true} />;
      // Add more cases as needed for other breadcrumbIds
      default:
        return <Component />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MiniDrawer />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box marginBottom={3}>
          <Breadcrumb />
        </Box>
        <Routes>
          {ROUTES_INFO.map(
            ({ id, path, breadcrumbId, component: Component }) => (
              <Route
                path={path}
                element={getComponentWithProps(breadcrumbId, Component)}
                key={id}
              />
            )
          )}
          <Route path='/*' element={<Navigate to='/dashboard' />} />
        </Routes>
      </Box>
    </Box>
  );
};
