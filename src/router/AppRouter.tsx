import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoutes } from './PublicRoute';
import { RootState } from '../store/store';
import { hasRole } from '../store/auth';
import { AdminRoutes } from './AdminRoutes';
import { Box } from '@mui/material';
import Breadcrumb from '../components/Breadcrumb';
import MiniDrawer, { DrawerHeader } from '../components/Drawer';

const AppRouter: React.FC = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const isAdmin = useSelector(hasRole('admin'));

  return (
    <Box sx={{ display: 'flex' }}>
      <MiniDrawer />
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box marginBottom={3}>
          <Breadcrumb />
        </Box>
        <Routes>
          {status === 'authenticated' ? (
            <>
              <Route path='/*' element={<PrivateRoute />} />
              {isAdmin && <Route path='/admin/*' element={<AdminRoutes />} />}
            </>
          ) : (
            <Route path='/*' element={<AuthRoutes />} />
          )}
          <Route path='/*' element={<Navigate to='/login' />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppRouter;
