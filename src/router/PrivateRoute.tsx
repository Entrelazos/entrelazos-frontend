import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Header } from '../components/Header/index';
import { Ofertas } from '../pages/Ofertas';
import ProductosServicios from '../pages/ProductosServicios';
import CompaniesPage from '../pages/Companies';
import { Box } from '@mui/material';
import AppRouter from './AppRouter';
import MiniDrawer, { DrawerHeader } from '../components/Drawer';
import Dashboard from '../pages/Dashboard';

export const PrivateRoute: React.FC = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MiniDrawer />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader></DrawerHeader>
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/ofertas' element={<Ofertas />} />
            <Route
              path='/productos-servicios'
              element={<ProductosServicios />}
            />
            <Route path='/empresas' element={<CompaniesPage />} />
            <Route path='/*' element={<Navigate to='/dashboard' />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};
