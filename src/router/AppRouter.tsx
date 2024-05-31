import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoutes } from './PublicRoute';
import { RootState } from '../store/store';

const AppRouter: React.FC = () => {
  const { auth } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {auth.status === 'authenticated' ? (
        <Route path='/*' element={<PrivateRoute />} />
      ) : (
        <Route path='/*' element={<AuthRoutes />} />
      )}

      <Route path='/*' element={<Navigate to='/login' />} />

      {/* Login y Registro */}
      {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}

      {/* JournalApp */}
      {/* <Route path="/*" element={ <JournalRoutes /> } /> */}
    </Routes>
  );
};

export default AppRouter;
