import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    errorMessage: null,
    authError: null,
    resgisterUserSucces: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    login: (state, { payload }) => {
      return {
        ...state,
        ...payload,
        status: 'authenticated',
        errorMessage: null,
        authError: false,
        resgisterUserSucces: null,
      };
    },
    logout: (state, { payload }) => {
      return {
        ...state,
        status: 'not-authenticated',
        errorMessage: payload?.errorMessage,
        authError: false,
        resgisterUserSucces: null,
        accessToken: null,
        refreshToken: null,
      };
    },
    setNewAccessToken: (state, { payload }) => ({
      ...state,
      accessToken: payload.accessToken,
    }),
    checkingCredentials: (state) => {
      state.status = 'checking';
    },
    authError: (state) => {
      state.authError = true;
    },
    registerUserSuccess: (state) => {
      state.resgisterUserSucces = true;
    },
    registerUserError: (state) => {
      state.resgisterUserSucces = false;
    },
    clearAuthStateReducer: (state) => {
      return {
        ...state,
        status: 'checking',
        errorMessage: null,
        authError: null,
        resgisterUserSucces: null,
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
