import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Header } from '../components/Header/index';
import { Ofertas } from '../pages/Ofertas';
import { ProductosServicios } from '../pages/ProductosServicios';

export const PrivateRoute = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/ofertas' element={<Ofertas />} />
        <Route path='/productosyservicios' element={<ProductosServicios />} />
        <Route path='/empresas' element={<h1>EMPRESAS</h1>} />
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
};
