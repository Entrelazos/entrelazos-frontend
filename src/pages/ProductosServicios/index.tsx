import { TextAlignCenter } from 'phosphor-react';
import { OurCoffees } from '../../components/OurCoffees';
import { Hero } from './components/Hero';
import { HomeContainer } from './styles';
import { Link, useNavigate, NavLink } from 'react-router-dom';

export function ProductosServicios() {
  return (
    <HomeContainer>
      <Hero />

      <OurCoffees />
    </HomeContainer>
  );
}
