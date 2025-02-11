import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import MiniDrawer, { DrawerHeader } from '../components/Drawer';
import Breadcrumb from '../components/Breadcrumb';
import { ROUTES_INFO } from '../constants/constants';
import { getComponentWithProps } from '../utils/Common';

export const PrivateRoute: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <MiniDrawer />
      <Box component='main' width='100%' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box marginBottom={3}>
          <Breadcrumb />
        </Box>
        <Routes>
          {ROUTES_INFO.PRIVATE_ROUTES.map(
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
