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
import { ROUTES_INFO } from '../constants/constants';
import { getComponentWithProps } from '../utils/Common';

export interface ComponentParams {
  signUpParam: boolean;
  profileParam: boolean;
}

const AppRouter: React.FC = () => {
  const { status, registerUserSuccess } = useSelector(
    (state: RootState) => state.auth
  );
  const isAdmin = useSelector(hasRole('admin'));
  console.log('====================================');
  console.log(isAdmin);
  console.log('====================================');

  const params: ComponentParams = {
    signUpParam: registerUserSuccess,
    profileParam: true,
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <MiniDrawer />
      <Box
        component='main'
        width='100%'
        sx={{ flexGrow: 1, p: 3 }}
        overflow='hidden'
      >
        <DrawerHeader />
        <Box marginBottom={3}>
          <Breadcrumb />
        </Box>
        <Routes>
          {/* Redirect authenticated users from root path to /dashboard */}
          {status === 'authenticated' && (
            <Route path='/' element={<Navigate to='/dashboard' replace />} />
          )}

          {/* Public Routes */}
          {ROUTES_INFO.PUBLIC_ROUTES.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={getComponentWithProps(
                route.breadcrumbId,
                route.component,
                params
              )}
            />
          ))}

          {/* Private Routes - only accessible if authenticated */}
          {status === 'authenticated' &&
            ROUTES_INFO.PRIVATE_ROUTES.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={getComponentWithProps(
                  route.breadcrumbId,
                  route.component,
                  params
                )}
              />
            ))}

          {/* Admin Routes - only accessible if authenticated and isAdmin */}
          {status === 'authenticated' &&
            isAdmin &&
            ROUTES_INFO.ADMIN_ROUTES_INFO.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}

          {/* Redirect unauthenticated users */}
          {status !== 'authenticated' && (
            <Route path='/' element={<Navigate to='/empresas' replace />} />
          )}

          {/* Unknown routes redirect based on authentication */}
          <Route
            path='*'
            element={
              status === 'authenticated' ? (
                <Navigate to='/dashboard' replace />
              ) : (
                <Navigate to='/empresas' replace />
              )
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppRouter;
