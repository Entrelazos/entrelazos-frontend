import {
  HeaderButton,
  HeaderButtonsContainer,
  HeaderContainer,
} from './styles';

import { MapPin, ShoppingCart } from 'phosphor-react';

import coffeLogoImage from '../../assets/entreLazosLogo.png';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Navbar from '../../components/Navbar/index';

export function Header() {
  const { cartQuantity } = useCart();

  return (
    <HeaderContainer>
      <Navbar />
    </HeaderContainer>
  );
}
