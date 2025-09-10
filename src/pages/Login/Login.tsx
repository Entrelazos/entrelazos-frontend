import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { startLoginWithEmailPassword } from '../../store/auth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import interLazosLogoImage from '../../assets/entreLazosLogoVertical.png';
import { useFormValidation } from '../../hooks/useFormValidation';
import * as yup from 'yup';
import { AppDispatch } from '../../store/store';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorHandler';

interface LoginFormValues {
  email: string;
  password: string;
}

const LOGO_WIDTH = 150;
const CONTAINER_MAX_WIDTH = 'xs' as const;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const validationSchema = {
  email: yup
    .string()
    .email('Formato de correo inválido')
    .required('El correo electrónico es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
};

const Copyright = React.memo(
  (props: React.ComponentProps<typeof Typography>) => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        {...props}
      >
        {'Copyright © '}
        <Link color='inherit' href='#' onClick={(e) => e.preventDefault()}>
          INTERLAZOS
        </Link>{' '}
        {currentYear}
        {'.'}
      </Typography>
    );
  }
);

Copyright.displayName = 'Copyright';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const formik = useFormValidation(
    {
      email: '',
      password: '',
    },
    validationSchema,
    async (values: LoginFormValues) => {
      const { email, password } = values;

      setIsLoading(true);
      setLoginError(null);

      try {
        await dispatch(
          startLoginWithEmailPassword({ email, password })
        ).unwrap();

        toast.success('Inicio de sesión exitoso');
        navigate('/', { replace: true });
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error('Login failed:', error);
        setLoginError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoToRegister = () => {
    navigate('/signup', { replace: true });
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    toast.info(
      'La funcionalidad de recuperar contraseña estará disponible pronto'
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component='main' maxWidth={CONTAINER_MAX_WIDTH}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            width={LOGO_WIDTH}
            src={interLazosLogoImage}
            alt='Logo de Interlazos'
          />

          <Box
            component='form'
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Correo electrónico'
              name='email'
              type='email'
              autoComplete='email'
              autoFocus
              disabled={isLoading}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                formik.touched.email && (formik.errors.email as string)
              }
              aria-describedby={
                formik.touched.email && formik.errors.email
                  ? 'email-error'
                  : undefined
              }
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Contraseña'
              type='password'
              id='password'
              autoComplete='current-password'
              disabled={isLoading}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password && (formik.errors.password as string)
              }
              aria-describedby={
                formik.touched.password && formik.errors.password
                  ? 'password-error'
                  : undefined
              }
            />
            {loginError && (
              <Alert
                severity='error'
                sx={{ mt: 2 }}
                role='alert'
                aria-live='polite'
              >
                {loginError}
              </Alert>
            )}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={isLoading || !formik.isValid}
              sx={{
                mt: 3,
                mb: 2,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-describedby={isLoading ? 'loading-text' : undefined}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mt: 2,
              }}
            >
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Link
                  component='button'
                  type='button'
                  variant='body2'
                  onClick={handleForgotPassword}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'right' } }}>
                <Link
                  component='button'
                  type='button'
                  variant='body2'
                  onClick={handleGoToRegister}
                >
                  ¿No tienes una cuenta? Regístrate
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
