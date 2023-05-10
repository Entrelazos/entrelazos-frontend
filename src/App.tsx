import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { CartContextProvider } from './contexts/CartContext'
import { Router } from './Router'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'
import { AuthProvider } from './auth'
import {AppRouter} from './router/AppRouter'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />

      <BrowserRouter>
        <CartContextProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </CartContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
