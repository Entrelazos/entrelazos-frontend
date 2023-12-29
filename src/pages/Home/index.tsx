import { TextAlignCenter } from 'phosphor-react';
import { OurCoffees } from '../../components/OurCoffees';
import { Hero } from './components/Hero';
import { HomeContainer } from './styles';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import imgOfertas from '../../assets/ofertas.jpeg';
import imgProductosServicios from '../../assets/shopping.png';
import imgEmpresas from '../../assets/company.png';

export function Home() {
  return (
    <HomeContainer>
      {/*
     <Hero />

      <OurCoffees />
     */}

      <div className='card-deck-wrapper container' style={{ marginTop: '5%' }}>
        <div className='card-deck'>
          <div className='card p-2' style={{ borderRadius: '15px' }}>
            <Link
              className='normalButtons'
              to='/ofertas'
              style={{ textDecoration: 'none' }}
            >
              <img
                src={imgOfertas}
                alt=''
                style={{ width: '100%', height: '280px', borderRadius: '15px' }}
              />
              <h3
                style={{
                  margin: '20px',
                  color: 'gray',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '20px',
                }}
              >
                OFERTAS
              </h3>
            </Link>
          </div>
          <div className='card p-2' style={{ borderRadius: '15px' }}>
            <Link
              className='normalButtons'
              to='/productos-servicios'
              style={{ textDecoration: 'none' }}
            >
              <img
                src={imgProductosServicios}
                alt=''
                style={{ width: '100%', height: '280px', borderRadius: '15px' }}
              />
              <h3
                style={{
                  margin: '20px',
                  color: 'gray',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '20px',
                }}
              >
                PRODUCTOS Y SERVICIOS
              </h3>
            </Link>
          </div>
          <div className='card p-2' style={{ borderRadius: '15px' }}>
            <Link
              className='normalButtons'
              to='/empresas'
              style={{ textDecoration: 'none' }}
            >
              <img
                src={imgEmpresas}
                alt=''
                style={{ width: '100%', height: '280px', borderRadius: '15px' }}
              />
              <h3
                style={{
                  margin: '20px',
                  color: 'gray',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '20px',
                }}
              >
                EMPRESAS
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </HomeContainer>
  );
}
