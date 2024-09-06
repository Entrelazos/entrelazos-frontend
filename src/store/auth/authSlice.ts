import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth/AuthTypes';
import {
  startLoginWithEmailPassword,
  startRegister,
  startGetNewAccessToken,
  startClearAuthState,
  startLogout,
} from './thunks';
import { RootState } from '../store';

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
  companies: [],
  roles: [],
  errorMessage: null,
  authError: null,
  registerUserSuccess: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startLoginWithEmailPassword.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.uid = action.payload.uid;
        state.displayName = action.payload.displayName;
        state.email = action.payload.email;
        state.companies = action.payload.companies;
        state.roles = action.payload.roles;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.errorMessage = null;
        state.authError = false;
        state.registerUserSuccess = null;
      })
      .addCase(startLoginWithEmailPassword.rejected, (state) => {
        state.status = 'not-authenticated';
        state.errorMessage = 'Login failed';
      })
      .addCase(startRegister.fulfilled, (state) => {
        state.registerUserSuccess = true;
      })
      .addCase(startRegister.rejected, (state, action) => {
        state.registerUserSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(startGetNewAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(startClearAuthState.fulfilled, (state) => {
        state.status = 'checking';
        state.errorMessage = null;
        state.authError = null;
        state.registerUserSuccess = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(startLogout.fulfilled, (state) => {
        state.status = 'not-authenticated';
        state.uid = null;
        state.email = null;
        state.displayName = null;
        state.companies = [];
        state.accessToken = null;
        state.refreshToken = null;
        state.errorMessage = null;
        state.authError = null;
        state.registerUserSuccess = null;
      });
  },
});

export const hasRole = (role: any) => (state: RootState) =>
  state.auth.roles.some((findRole: any) => findRole.role_name === role);

export default authSlice.reducer;
