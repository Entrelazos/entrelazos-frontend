import { HeaderButton, HeaderButtonsContainer, HeaderContainer } from './styles'

import { MapPin, ShoppingCart } from 'phosphor-react'

import coffeLogoImage from '../../assets/coffe-delivery-logo.svg'
import { NavLink } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export function Header() {
  const { cartQuantity } = useCart()

  return (
    <HeaderContainer>
      <div className="container">
        <div style={{display:"flex"}}>
          <NavLink to="/">
            <img src={coffeLogoImage} alt="" />
          </NavLink>

          <NavLink to="/productosyservicios" style={{marginLeft: "40px", color: "gray", marginTop:"6px", textDecoration: "none"}}>
            <h5 style={{fontWeight: "800", lineHeight: "130%"}}>Productos y servicios</h5>
          </NavLink>

          <NavLink to="/pruebas" style={{marginLeft: "40px", color: "gray", marginTop:"6px", fontWeight: "800", textDecoration: "none"}}>
            <h5 style={{fontWeight: "800", lineHeight: "130%"}}>Pruebas</h5>
          </NavLink>
        </div>


        <HeaderButtonsContainer>
          <HeaderButton variant="purple">
            <MapPin size={20} weight="fill" />
            Fortaleza, CE
          </HeaderButton>
          <NavLink to="/completeOrder">
            <HeaderButton variant="yellow">
              {cartQuantity >= 1 && <span>{cartQuantity}</span>}
              <ShoppingCart size={20} weight="fill" />
            </HeaderButton>
          </NavLink>
        </HeaderButtonsContainer>
      </div>
    </HeaderContainer>

  )
}
