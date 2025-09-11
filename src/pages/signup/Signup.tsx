import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MuiTelInput } from 'mui-tel-input';
import { useNavigate } from 'react-router-dom';
import interLazosLogoImage from '../../assets/entreLazosLogoVertical.png';
import { useFormValidation } from '../../hooks/useFormValidation';
import * as yup from 'yup';
import { startRegister } from '../../store/auth';
import { AppDispatch, RootState } from '../../store/store';
import { getErrorMessage } from '../../utils/errorHandler';
import { Copyright } from '../../components/common/Copyright';

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  identification: string;
  cellphone: string;
  name: string;
}

const LOGO_WIDTH = 150;
const CONTAINER_MAX_WIDTH = 'sm' as const;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const validationSchema = {
  name: yup.string().required('El nombre completo es obligatorio'),
  email: yup
    .string()
    .email('Formato de correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  identification: yup.string().required('La identificación es obligatoria'),
  cellphone: yup
    .string()
    .required('El número de celular es obligatorio')
    .matches(
      /^\+\d{1,3}\s?\d{1,3}\s?\d{1,10}$/,
      'Formato de número de celular incorrecto'
    ),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Las contraseñas no coinciden')
    .required('Por favor confirma tu contraseña'),
};

export const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const registerUserSuccess = useSelector(
    (state: RootState) => state.auth.registerUserSuccess
  );

  const formik = useFormValidation(
    {
      email: '',
      password: '',
      confirmPassword: '',
      identification: '',
      cellphone: '',
      name: '',
    },
    validationSchema,
    async (values: SignupFormValues) => {
      const { cellphone, email, password, identification, name } = values;

      setIsLoading(true);
      setSignupError(null);

      try {
        await dispatch(
          startRegister({
            name,
            cellphone,
            email,
            password,
            identification,
            is_active: true,
            roleIds: [2],
          })
        ).unwrap();

        toast.success(
          '¡Registro exitoso! Redirigiendo al inicio de sesión...',
          {
            autoClose: 2000,
          }
        );

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        console.error('Registration failed:', error);
        setSignupError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const handleGoToLogin = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  // Handle success state from Redux if needed
  React.useEffect(() => {
    if (registerUserSuccess === true) {
      toast.success('¡Usuario registrado exitosamente!');
      setTimeout(() => {
        handleGoToLogin();
      }, 1000);
    }
  }, [registerUserSuccess, handleGoToLogin]);

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
            sx={{ mt: 3, width: '100%' }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                label='Nombre completo'
                name='name'
                autoComplete='name'
                autoFocus
                disabled={isLoading}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && (formik.errors.name as string)
                }
                aria-describedby={
                  formik.touched.name && formik.errors.name
                    ? 'name-error'
                    : undefined
                }
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Correo electrónico'
                name='email'
                type='email'
                autoComplete='email'
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
                id='identification'
                label='Identificación'
                name='identification'
                autoComplete='off'
                disabled={isLoading}
                value={formik.values.identification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.identification &&
                  Boolean(formik.errors.identification)
                }
                helperText={
                  formik.touched.identification &&
                  (formik.errors.identification as string)
                }
                aria-describedby={
                  formik.touched.identification && formik.errors.identification
                    ? 'identification-error'
                    : undefined
                }
              />
              <MuiTelInput
                defaultCountry='CO'
                margin='normal'
                required
                fullWidth
                id='cellphone'
                label='Número de celular'
                name='cellphone'
                disabled={isLoading}
                value={formik.values.cellphone}
                onChange={(value) => {
                  formik.setFieldValue('cellphone', value);
                  formik.setFieldTouched('cellphone', true);
                }}
                error={
                  formik.touched.cellphone && Boolean(formik.errors.cellphone)
                }
                helperText={
                  formik.touched.cellphone &&
                  (formik.errors.cellphone as string)
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
                autoComplete='new-password'
                disabled={isLoading}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  formik.touched.password && (formik.errors.password as string)
                }
                aria-describedby={
                  formik.touched.password && formik.errors.password
                    ? 'password-error'
                    : undefined
                }
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirmar contraseña'
                type='password'
                id='confirmPassword'
                autoComplete='new-password'
                disabled={isLoading}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  (formik.errors.confirmPassword as string)
                }
                aria-describedby={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? 'confirmPassword-error'
                    : undefined
                }
              />
            </Box>

            {signupError && (
              <Alert
                severity='error'
                sx={{ mt: 2 }}
                role='alert'
                aria-live='polite'
              >
                {signupError}
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
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
              {isLoading && (
                <span id='loading-text' className='sr-only'>
                  Procesando registro de usuario
                </span>
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant='body2'>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  component='button'
                  type='button'
                  variant='body2'
                  onClick={handleGoToLogin}
                  disabled={isLoading}
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
