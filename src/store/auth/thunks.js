//import { loginWithEmailPassword, registerUserWithEmailPassword, singInWithGoogle, logoutFirebase } from '../../firebase/providers';
import axios from 'axios';
import {
  checkingCredentials,
  logout,
  login,
  authError,
  registerUserSuccess,
  registerUserError,
  clearAuthStateReducer,
} from './';
import { login as loginService } from '../../services/auth/authService';

export const checkingAuthentication = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    //const result = await singInWithGoogle();
    //if ( !result.ok ) return dispatch( logout( result.errorMessage ) );

    dispatch(login(result));
  };
};

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());

    //const result = await registerUserWithEmailPassword({ email, password, displayName });
    //if ( !result.ok ) return dispatch( logout( result.errorMessage ) );

    dispatch(login(result));
  };
};

export const startLoginWithEmailPassword = (email, password) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    try {
      const { accessToken, refreshToken } = await loginService({
        email,
        password,
      });
      dispatch(
        login({ displayName: 'Juan Diego', email, accessToken, refreshToken })
      );
    } catch (error) {
      console.log(error);
      dispatch(authError(true));
    }
  };
};

export const startRegister = (
  cellphone,
  email,
  password,
  identification,
  is_active,
  name,
  role_id,
  city_id
) => {
  return async (dispatch) => {
    dispatch(checkingCredentials());
    axios
      .post(
        'http://127.0.0.1:3000/user/',
        {
          cellphone: cellphone,
          email: email,
          password: password,
          identification: identification,
          is_active: is_active,
          name: name,
          role_id: role_id,
          city_id: city_id,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      .then(function (response) {
        if (response.status === 201) {
          console.log('response ok');
          dispatch(registerUserSuccess());
        }
      })
      .catch(function (error) {
        console.log(error);
        dispatch(registerUserError());
      });

    //const result = await loginWithEmailPassword({ email, password });
    //console.log(result);

    //if ( !result.ok ) return dispatch( logout( result ) );
  };
};

export const clearAuthState = () => {
  return async (dispatch) => {
    dispatch(clearAuthStateReducer());
  };
};

export const startLogout = () => {
  return async (dispatch) => {
    //  await logoutFirebase();

    dispatch(logout());
  };
};
