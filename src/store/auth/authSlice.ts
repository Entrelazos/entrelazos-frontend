import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth/AuthTypes';

interface LoginPayload {
  payload: AuthState;
}

interface LogoutPayload {
  payload: { errorMessage: string };
}

interface SetNewAccessTokenPayload {
  payload: { accessToken: string };
}

interface RegisterUserErrorPayload {
  payload: { errorMessage: string };
}

const initialState: AuthState = {
  status: 'checking',
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  errorMessage: null,
  authError: null,
  registerUserSucces: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<LoginPayload['payload']>) => {
      return {
        ...state,
        ...payload,
        status: 'authenticated',
        errorMessage: null,
        authError: false,
        registerUserSucces: null,
      };
    },
    logout: (state, { payload }: PayloadAction<LogoutPayload['payload']>) => {
      return {
        ...state,
        status: 'not-authenticated',
        errorMessage: payload?.errorMessage,
        authError: false,
        registerUserSucces: null,
        accessToken: null,
        refreshToken: null,
      };
    },
    setNewAccessToken: (
      state,
      { payload }: PayloadAction<SetNewAccessTokenPayload['payload']>
    ) => ({
      ...state,
      accessToken: payload.accessToken,
    }),
    checkingCredentials: (state) => {
      state.status = 'checking';
    },
    authError: (state: AuthState) => {
      state.authError = true;
    },
    registerUserSuccess: (state) => {
      state.registerUserSucces = true;
    },
    registerUserError: (
      state,
      { payload }: PayloadAction<RegisterUserErrorPayload['payload']>
    ) => {
      state.registerUserSucces = false;
      state.errorMessage = payload?.errorMessage;
    },
    clearAuthStateReducer: (state) => {
      return {
        ...state,
        status: 'checking',
        errorMessage: null,
        authError: null,
        registerUserSucces: null,
        accessToken: null,
        refreshToken: null,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  setNewAccessToken,
  checkingCredentials,
  authError,
  registerUserSuccess,
  registerUserError,
  clearAuthStateReducer,
} = authSlice.actions;

export default authSlice.reducer;
