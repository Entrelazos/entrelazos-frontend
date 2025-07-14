import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginService,
  register,
  getNewAccessToken as getNewAccessTokenService,
} from '../../services/auth/authService';
import { Credentials, RegisterData } from '../../types/auth/AuthTypes';

export const startLoginWithEmailPassword = createAsyncThunk(
  'auth/loginWithEmailPassword',
  async (credentials: Credentials) => {
    const {
      name,
      email: userEmail,
      id,
      companies,
      roles,
      accessToken,
      refreshToken,
    } = await loginService(credentials);

    return {
      uid: id,
      displayName: name,
      email: userEmail,
      companies,
      roles,
      accessToken,
      refreshToken,
    };
  }
);

export const startRegister = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData) => {
    await register(registerData);
  }
);

export const startGetNewAccessToken = createAsyncThunk(
  'auth/getNewAccessToken',
  async (refreshToken: string) => {
    try {
      const { accessToken } = await getNewAccessTokenService(refreshToken);
      return { accessToken };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const startClearAuthState = createAsyncThunk(
  'auth/clearAuthState',
  async () => {
    return {};
  }
);

export const startLogout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return {};
});
