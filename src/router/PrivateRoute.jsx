import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import NavBar from '../components/Navbar/index'

export const PrivateRoute = () => {
  return (
    <div>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>

  )
}