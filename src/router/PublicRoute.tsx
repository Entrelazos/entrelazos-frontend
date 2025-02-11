import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES_INFO } from '../constants/constants';
import { getComponentWithProps } from '../utils/Common';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      {ROUTES_INFO.PUBLIC_ROUTES.map(
        ({ id, path, breadcrumbId, component: Component }) => (
          <Route
            path={path}
            element={getComponentWithProps(breadcrumbId, Component, null)}
            key={id}
          />
        )
      )}
      <Route path='/*' element={<Navigate to='/empresas' />} />
    </Routes>
  );
};
