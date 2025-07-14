import { HeroContainer, HeroContent } from './styles';

export function Hero() {
  return (
    <HeroContainer>
      <HeroContent className='container'>
        <div>
          <h1>PRODUCTOS Y SERVICIOS</h1>
          <h6>
            A continuación encontraras los productos y servicios ofrecidos por
            los misioneros.
          </h6>
        </div>
      </HeroContent>
    </HeroContainer>
  );
}
