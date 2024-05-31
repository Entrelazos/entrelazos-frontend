import { useDispatch, connect } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { startLoginWithEmailPassword } from '../../store/auth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import entreLazosLogoImage from '../../assets/entreLazosLogoVertical.png';
import { useFormValidation } from '../../hooks/useFormValidation';
import * as yup from 'yup';
import { AppDispatch } from '../../store/store';
import { AuthState } from '../../types/auth/AuthTypes';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        ENTRELAZOS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function Login({ authError }) {
  const validationSchema = {
    email: yup
      .string()
      .email('Formato de correo invalido')
      .required('El correo es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria'),
  };

  const formik = useFormValidation(
    {
      email: '',
      password: '',
    },
    validationSchema,
    (values) => {
      const { email, password } = values;

      dispatch(startLoginWithEmailPassword({ email, password }));
    }
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoToRegister = () => {
    navigate('/signup', { replace: true });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img width={150} src={entreLazosLogoImage} alt='' />

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
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                formik.touched.email && (formik.errors.email as string)
              }
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password && (formik.errors.password as string)
              }
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            {authError ? (
              <h6 style={{ color: 'red' }}>
                Oops, parece que ha habido un error. Revise su correo y
                contraseña e inténtelo de nuevo.
              </h6>
            ) : null}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 1, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link onClick={handleGoToRegister} variant='body2'>
                  {'No tienes una cuenta? regístrate'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state: AuthState) => ({
  authError: state.authError,
});

export default connect(mapStateToProps)(Login);
