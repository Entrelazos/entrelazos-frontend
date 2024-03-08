import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider } from 'styled-components';
import { CartContextProvider } from './contexts/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { GlobalStyle } from './styles/global';
import { defaultTheme } from './styles/themes/default';
import AppRouter from './router/AppRouter';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  typography: {
    fontFamily: [
      'Public Sans',
      'sans-serif', // Backup font
    ].join(','),
  },
  palette: {
    mode: 'dark',
  },
});


export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      <Provider store={store}>
        <BrowserRouter>
          <CartContextProvider>
            <AppRouter />
            <ToastContainer />
          </CartContextProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}
