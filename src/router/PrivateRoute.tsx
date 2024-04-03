import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Ofertas } from '../pages/Ofertas';
import ProductosServicios from '../pages/ProductosServicios';
import CompaniesPage from '../pages/Companies';
import { Box } from '@mui/material';
import MiniDrawer, { DrawerHeader } from '../components/Drawer';
import Dashboard from '../pages/Dashboard';
import Breadcrumb from '../components/Breadcrumb';
import AddCompanies from '../pages/Companies/add/companies.add';
import ProfilePage from '../pages/Profile/profile.page';
import ProductsByCategory from '../pages/ProductosServicios/ProductsByCategory/ProductsByCategory';
import { ROUTES_INFO } from '../constants/constants';

export const PrivateRoute: React.FC = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MiniDrawer />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader></DrawerHeader>
          <Box marginBottom={3}>
            <Breadcrumb />
          </Box>
          <Routes>
            {ROUTES_INFO.map(({ path, component: Component }) => (
              <Route path={path} element={<Component />} key={path}></Route>
            ))}
            <Route path='/*' element={<Navigate to='/dashboard' />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};
