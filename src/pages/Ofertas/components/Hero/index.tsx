import {
  HeroContainer,
  HeroContent,
  HeroTitle,
  BenefitsContainer,
} from './styles';

import heroImage from '../../../../assets/hero-image.png';
import { RegularText } from '../../../../components/Typography';
import { InfoWithIcon } from '../../../../components/InfoWithIcon';
import { ShoppingCart, Package, Timer, Coffee } from 'phosphor-react';
import { defaultTheme } from '../../../../styles/themes/default';

export function Hero() {
  return (
    <HeroContainer>
      <HeroContent className='container'>
        <div>
          <section>
            <HeroTitle size='xl'>
              Encontre o café perfeito para qualquer hora do dia
            </HeroTitle>
            <RegularText size='l' color='subtitle' as='h3'>
              Com o Coffe Delivery você recebe seu café onde estiver, a qualquer
              hora
            </RegularText>
          </section>

          <BenefitsContainer>
            <InfoWithIcon
              iconColor={defaultTheme.colors['brand-yellow-dark']}
              icon={<ShoppingCart weight='fill' />}
              text='Compra simples e segura'
            />
            <InfoWithIcon
              iconColor={defaultTheme.colors['base-text']}
              icon={<Package weight='fill' />}
              text='Embalagem mantém o café intacto'
            />
            <InfoWithIcon
              iconColor={defaultTheme.colors['brand-yellow']}
              icon={<Timer weight='fill' />}
              text='Entrega rápida e rastreada'
            />
            <InfoWithIcon
              iconColor={defaultTheme.colors['brand-purple']}
              icon={<Coffee weight='fill' />}
              text='O café chega fresquinho até você'
            />
          </BenefitsContainer>
        </div>

        <div className='imageContainer'>
          <img src={heroImage} alt='' />
        </div>
      </HeroContent>
    </HeroContainer>
  );
}
