import { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { MuiTelInput } from 'mui-tel-input';
import { startRegister, clearAuthState } from '../../store/auth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import entreLazosLogoImage from '../../assets/entreLazosLogoVertical.png';
import { useFormValidation } from '../../hooks/useFormValidation';
import * as yup from 'yup';
import './Signup.scss';
import { AppDispatch } from '../../store/store';

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
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export function Signup({ registerUserSucces }) {
  const validationSchema = {
    email: yup
      .string()
      .email('Correo invalido')
      .required('El correo es obligatorio'),
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe de estar conformada por una letra mayuscula, una letra minuscula, un digito, y un caracter especial'
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('Por favor confirma tu contraseña'),

    identification: yup.string().required('La identificacion es obligatioria'),
    cellphone: yup
      .string()
      .required('El numero de celular es obligatiorio')
      .matches(
        /^\+\d{1,3}\s?\d{1,3}\s?\d{1,10}$/,
        'Formato de numero de celular incorrecto'
      ),
    name: yup.string().required('El nombre es obligatorio'),
  };

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
    (values) => {
      console.log('Form submitted:', values);

      const { cellphone, email, password, identification, name } = values;

      dispatch(
        startRegister({
          cellphone,
          email,
          password,
          identification,
          is_active: true,
          name,
          role_id: 1,
          city_id: 1,
        })
      );
    }
  );

  const handleGoToLogin = () => {
    dispatch(clearAuthState());
    navigate('/', { replace: true });
  };

  const successRegisterNotification = (registerUserSucces) => {
    if (registerUserSucces === true) {
      toast.success('Usuario registrado!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setTimeout(() => {
        handleGoToLogin();
      }, 1000);
    }
  };

  useEffect(() => {
    successRegisterNotification(registerUserSucces);
  }, [registerUserSucces]);

  return (
    <ThemeProvider theme={theme}>
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
            <Grid container spacing={2} className='grid-system-form'>
              <Grid item xs={12} md={6} xl>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='name'
                  label='Nombre completo'
                  name='name'
                  autoComplete='name'
                  autoFocus
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={
                    formik.touched.name && (formik.errors.name as string)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='Correo electrónico'
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='identification'
                  label='Identificación'
                  name='identification'
                  autoComplete='identification'
                  autoFocus
                  value={formik.values.identification}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.identification &&
                    Boolean(formik.errors.identification)
                  }
                  helperText={
                    formik.touched.identification &&
                    (formik.errors.identification as string)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MuiTelInput
                  defaultCountry='CO'
                  margin='normal'
                  required
                  fullWidth
                  id='cellphone'
                  label='Celular'
                  name='cellphone'
                  autoComplete='cellphone'
                  autoFocus
                  value={formik.values.cellphone}
                  onChange={(value) => formik.setFieldValue('cellphone', value)}
                  error={
                    formik.touched.cellphone && Boolean(formik.errors.cellphone)
                  }
                  helperText={
                    formik.touched.cellphone &&
                    (formik.errors.cellphone as string)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label='Contraseña'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password &&
                    (formik.errors.password as string)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='confirmPassword'
                  label='Confirmar contraseña'
                  type='password'
                  id='confirmPassword'
                  autoComplete='confirm-password'
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    (formik.errors.confirmPassword as string)
                  }
                />
              </Grid>
            </Grid>

            {registerUserSucces === false ? (
              <h6 style={{ color: 'red' }}>
                Oops, parece que ha habido un error.
              </h6>
            ) : null}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 1, mb: 1 }}
            >
              REGISTRARSE
            </Button>

            <Typography
              style={{ fontSize: 18, color: '#1976d2', marginTop: '10px' }}
              variant='body2'
              color='text.secondary'
              align='center'
            >
              <Link onClick={handleGoToLogin} color='inherit'>
                <b>¿Ya tienes una cuenta?</b>
              </Link>
            </Typography>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  registerUserSucces: state.auth.registerUserSucces,
});

export default connect(mapStateToProps)(Signup);
