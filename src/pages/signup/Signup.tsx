import { useContext, useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { startRegister, clearAuthState } from '../../store/auth';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import entreLazosLogoImage from '../../assets/entreLazosLogoVertical.png';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export function Signup({ resgisterUserSucces }) {
  //const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(startRegister(data.get('cellphone'), data.get('email'), data.get('password'), data.get('identification'), true, data.get('name'), 1, 1));
    //navigate('/', { replace: true });
  };

  const handleGoToLogin = () => {
    dispatch(clearAuthState());
    navigate('/', { replace: true });
  }

  const successRegisterNotification = (resgisterUserSucces) => {
    if (resgisterUserSucces === true) {
      toast.success('Usuario registrado!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(()=>{
        handleGoToLogin();
      }, 1000);
    };
  }

  useEffect(() => {
    successRegisterNotification(resgisterUserSucces);
  }, [resgisterUserSucces]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img width={150} src={entreLazosLogoImage} alt="" />

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre completo"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="identification"
              label="Identificación"
              name="identification"
              autoComplete="identification"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cellphone"
              label="Celular"
              name="cellphone"
              autoComplete="cellphone"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/*<FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
        />*/}
            {resgisterUserSucces === false ? <h6 style={{ color: "red" }}>Oops, parece que ha habido un error.</h6> : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            >
              REGISTRARSE
            </Button>

            <Typography style={{ fontSize: 18, color: "#1976d2", marginTop: "10px" }} variant="body2" color="text.secondary" align="center">
              <Link onClick={handleGoToLogin} color="inherit">
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

const mapStateToProps = state => ({
  resgisterUserSucces: state.auth.resgisterUserSucces,
});

export default connect(mapStateToProps)(Signup);