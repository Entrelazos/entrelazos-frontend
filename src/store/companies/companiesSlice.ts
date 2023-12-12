import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCompaniesData } from './companiesThunks';
import { CompanyApiResponse } from '../../types/api/ApiTypes';
import { AxiosResponse } from 'axios';
import { getAllCompanies } from '../../services/companies/companyService';

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

export const fetchCompaniesData = createAsyncThunk(
  'companies/fetchCompaniesData',
  async (): Promise<CompanyApiResponse> => {
    const response: AxiosResponse<any> = await getAllCompanies();
    return response.data;
  }
);

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
          debugger;
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
