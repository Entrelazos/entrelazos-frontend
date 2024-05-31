import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import { fetchCompaniesData, fetchCompanyByName } from './companiesThunks';

interface CompaniesState {
  data: CompanyApiResponse | null;
  loading: boolean;
  error: string | null;
}

interface CompanyState {
  data: CompanyItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  data: null,
  loading: false,
  error: null,
};

const initialCompanyState: CompanyState = {
  data: null,
  loading: false,
  error: null,
};

export const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompaniesData.fulfilled,
        (state, action: PayloadAction<CompanyApiResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchCompaniesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const companySlice = createSlice({
  name: 'company',
  initialState: initialCompanyState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCompanyByName.fulfilled,
        (state, action: PayloadAction<CompanyItem>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchCompanyByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});
