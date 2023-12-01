import {
  checkingCredentials,
  logout,
  login,
  setNewAccessToken,
  authError,
  registerUserSuccess,
  registerUserError,
  clearAuthStateReducer,
} from '.';
import {
  getNewAccessToken as getNewAccessTokenService,
  login as loginService,
  register,
} from '../../services/auth/authService';
import { Credentials, RegisterData } from '../../types/auth/AuthTypes';
import { Dispatch } from 'redux';

export const checkingAuthentication = () => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());
  };
};

// export const startGoogleSignIn = () => {
//   return async (dispatch: Dispatch) => {
//     dispatch(checkingCredentials());

//     // const result = await singInWithGoogle();
//     // if ( !result.ok ) return dispatch( logout( result.errorMessage ) );

//     // dispatch(login(result));
//   };
// };

// export const startCreatingUserWithEmailPassword = ({
//   email,
//   password,
//   displayName,
// }: StartCreatingUserWithEmailPasswordParams) => {
//   return async (dispatch: Dispatch) => {
//     dispatch(checkingCredentials());

//     // const result = await registerUserWithEmailPassword({ email, password, displayName });
//     // if ( !result.ok ) return dispatch( logout( result.errorMessage ) );

//     // dispatch(login(result));
//   };
// };

export const startLoginWithEmailPassword = ({
  email,
  password,
}: Credentials) => {
  return async (dispatch: Dispatch) => {
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

export const startRegister = ({
  cellphone,
  email,
  password,
  identification,
  is_active,
  name,
  role_id,
  city_id,
}: RegisterData) => {
  return async (dispatch: Dispatch) => {
    dispatch(checkingCredentials());
    try {
      await register({
        cellphone,
        email,
        password,
        identification,
        is_active,
        name,
        role_id,
        city_id,
      });
      dispatch(registerUserSuccess());
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(registerUserError(error.message));
    }
  };
};

export const getNewAccessToken = (refreshToken: string) => {
  return async (dispatch: Dispatch, getState: () => any) => {
    try {
      const { accessToken } = await getNewAccessTokenService(refreshToken);
      dispatch(setNewAccessToken({ accessToken }));
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearAuthState = () => {
  return async (dispatch: Dispatch) => {
    dispatch(clearAuthStateReducer());
  };
};

export const startLogout = () => {
  return async (dispatch: Dispatch) => {
    dispatch(logout());
  };
};
