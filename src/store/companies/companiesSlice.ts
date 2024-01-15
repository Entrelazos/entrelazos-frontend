import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CompanyApiResponse } from '../../types/companies/CompaniesTypes';
import { fetchCompaniesData } from './companiesThunks';

interface CompanyState {
  data: CompanyApiResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  data: null,
  loading: false,
  error: null,
};

const companiesSlice = createSlice({
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

export default companiesSlice.reducer;
