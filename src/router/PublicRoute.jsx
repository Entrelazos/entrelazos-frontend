import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Signup from '../pages/signup/Signup'


export const AuthRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={ <Login /> } />

        <Route path="/signup" element={<Signup/>} />
        <Route path='/*' element={ <Navigate to='/login' />  } />

    </Routes>
  )
}
