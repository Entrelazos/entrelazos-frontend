import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoutes } from './PublicRoute';
import { RootState } from '../store/store';
import { hasRole } from '../store/auth';
import { AdminRoutes } from './AdminRoutes';

const AppRouter: React.FC = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const isAdmin = useSelector(hasRole('admin'));

  return (
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

      {/* Login y Registro */}
      {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}

      {/* JournalApp */}
      {/* <Route path="/*" element={ <JournalRoutes /> } /> */}
    </Routes>
  );
};

export default AppRouter;
