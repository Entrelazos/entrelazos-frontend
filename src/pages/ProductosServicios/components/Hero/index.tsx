import {
  HeroContainer,
  HeroContent,
  HeroTitle,
  BenefitsContainer,
} from './styles'

import heroImage from '../../../../assets/compras.jpg'
import { RegularText } from '../../../../components/Typography'
import { InfoWithIcon } from '../../../../components/InfoWithIcon'
import { ShoppingCart, Package, Timer, Coffee } from 'phosphor-react'
import { useTheme } from 'styled-components'

export function Hero() {
  const { colors } = useTheme()

  return (
    <HeroContainer>
      <HeroContent className="container">
        <div>
          <h1>PRODUCTOS Y SERVICIOS</h1>
          <h6>A continuación encontraras los productos y servicios ofrecidos por los
            misioneros.
          </h6>
        </div>
      </HeroContent>
    </HeroContainer>
  )
}
