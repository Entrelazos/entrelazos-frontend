import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../pages/Login/Login';
import { PrivateRoute } from './PrivateRoute';
import { AuthRoutes } from './PublicRoute';
import { Navigate } from 'react-router-dom';


export const AppRouter = () => {
  const { status } = useSelector( state => state.auth );
  return (
    <>

        <Routes>

        {
          (status === 'authenticated')
           ? <Route path="/*" element={
              <PrivateRoute />
            } />
           : <Route path="/*" element={
                <AuthRoutes>
                  {/* <LoginPage /> */}
                  <Routes>
                    <Route path="/*" element={<Login />} />
                  </Routes>
                </AuthRoutes>
              }
            />
        }

        <Route path='/*' element={ <Navigate to='/login' />  } />

        {/* Login y Registro */}
        {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}

        {/* JournalApp */}
        {/* <Route path="/*" element={ <JournalRoutes /> } /> */}

    </Routes>
    
    </>
  )
}