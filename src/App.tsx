import { BrowserRouter } from 'react-router-dom';
import { CartContextProvider } from './contexts/CartContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AppRouter from './router/AppRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { esES } from '@mui/x-data-grid/locales';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { mode } = useTheme();

  const theme = createTheme(
    {
      typography: {
        fontFamily: [
          'Public Sans',
          'sans-serif', // Backup font
        ].join(','),
      },
      palette: {
        mode: mode,
      },
    },
    esES
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <GlobalStyle /> */}
      <BrowserRouter>
        <ErrorBoundary>
          <CartContextProvider>
            <AppRouter />
            <ToastContainer />
          </CartContextProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}
