import { Route, Routes } from 'react-router-dom'
import { DefaultLayout } from './layout/Default'
import { Home } from './pages/Home'
import { CompleteOrderPage } from './pages/CompleteOrder'
import { OrderConfirmedPage } from './pages/OrderConfirmed'
import { OurCoffees } from './components/OurCoffees'
import Login from './pages/Login/Login'
import NavBar from './components/Navbar/index'

export function Router() {
  return (
    <div>
      <NavBar/>
      
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/completeOrder" element={<CompleteOrderPage />} />
          <Route path="/orderConfirmed" element={<OrderConfirmedPage />} />
          <Route path="/pruebas" element={<h1>Pruebas</h1>} />
          <Route path="/productosyservicios" element={<OurCoffees />} />

        </Route>
      </Routes>
    </div>

  )
}
