import { BrowserRouter } from 'react-router-dom';
import { CartContextProvider } from './contexts/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AppRouter from './router/AppRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { esES } from '@mui/x-data-grid/locales';

const darkTheme = createTheme(
  {
    typography: {
      fontFamily: [
        'Public Sans',
        'sans-serif', // Backup font
      ].join(','),
    },
    palette: {
      mode: 'dark',
    },
  },
  esES
);

export function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      <BrowserRouter>
        <CartContextProvider>
          <AppRouter />
          <ToastContainer />
        </CartContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
