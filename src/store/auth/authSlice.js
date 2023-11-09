import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking', 'not-authenticated', 'authenticated'
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
        authError: null,
        resgisterUserSucces: null
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = 'authenticated', // 'checking', 'not-authenticated', 'authenticated'
                state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
            state.authError = false;
            state.resgisterUserSucces = null;
        },
        logout: (state, { payload }) => {
            state.status = 'not-authenticated', // 'checking', 'not-authenticated', 'authenticated'
                state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage;
            state.authError = false;
            state.resgisterUserSucces = null;
        },
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
            state.status= 'checking'; // 'checking', 'not-authenticated', 'authenticated'
            state.uid= null;
            state.email= null;
            state.displayName= null;
            state.photoURL= null;
            state.errorMessage= null;
            state.authError= null;
            state.resgisterUserSucces= null
        }
    }
});


// Action creators are generated for each case reducer function
export const { login, logout, checkingCredentials, authError, registerUserSuccess, registerUserError, clearAuthStateReducer } = authSlice.actions;