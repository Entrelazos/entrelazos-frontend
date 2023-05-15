import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import {Header} from '../components/Header/index'

export const PrivateRoute = () => {
  return (
    <div>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>

  )
}