import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Header } from '../components/Header/index';
import { Ofertas } from '../pages/Ofertas';
import { ProductosServicios } from '../pages/ProductosServicios';
import CompaniesPage from '../pages/Companies';

export const PrivateRoute: React.FC = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/ofertas' element={<Ofertas />} />
        <Route path='/productos-servicios' element={<ProductosServicios />} />
        <Route path='/empresas' element={<CompaniesPage />} />
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
};
