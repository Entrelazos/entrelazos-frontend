import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Login/Login';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoutes } from './PublicRoute';
import { RootState } from '../store/store';

const AppRouter: React.FC = () => {
  const { status } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {status === 'authenticated' ? (
        <Route path="/*" element={<PrivateRoute />} />
      ) : (
        <Route
          path="/*"
          element={
            <AuthRoutes>
              {/* <LoginPage /> */}
              <Routes>
                <Route path="/*" element={<Login />} />
              </Routes>
            </AuthRoutes>
          }
        />
      )}

      <Route path="/*" element={<Navigate to="/login" />} />

      {/* Login y Registro */}
      {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}

      {/* JournalApp */}
      {/* <Route path="/*" element={ <JournalRoutes /> } /> */}
    </Routes>
  );
};

export default AppRouter;