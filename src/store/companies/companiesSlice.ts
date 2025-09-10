import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CompanyApiResponse,
  CompanyItem,
} from '../../types/companies/CompaniesTypes';
import {
  fetchCompaniesData,
  fetchMoreCompanies,
  fetchCompanyByName,
  fetchUserCompanies,
  updateCompanyData,
} from './companiesThunks';
import { RootState } from '../store';

interface CompaniesState {
  companiesData: CompanyApiResponse | null;
  userCompaniesData: CompanyApiResponse | null;
  loading: boolean;
  loadingMore: boolean;
  hasMorePages: boolean;
  currentPage: number;
  error: string | null;
}

interface CompanyState {
  data: CompanyItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompaniesState = {
  companiesData: null,
  userCompaniesData: null,
  loading: false,
  loadingMore: false,
  hasMorePages: true,
  currentPage: 1,
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
  reducers: {
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMorePages = true;
      state.companiesData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPage = 1;
        state.hasMorePages = true;
      })
      .addCase(
        fetchCompaniesData.fulfilled,
        (state, action: PayloadAction<CompanyApiResponse>) => {
          state.loading = false;
          state.companiesData = action.payload;
          state.currentPage = action.payload.meta.currentPage;
          state.hasMorePages = action.payload.meta.currentPage < action.payload.meta.totalPages;
        }
      )
      .addCase(fetchCompaniesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchMoreCompanies.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(
        fetchMoreCompanies.fulfilled,
        (state, action: PayloadAction<CompanyApiResponse>) => {
          state.loadingMore = false;
          if (state.companiesData) {
            // Append new items to existing items
            state.companiesData.items = [
              ...state.companiesData.items,
              ...action.payload.items,
            ];
            state.companiesData.meta = action.payload.meta;
          } else {
            state.companiesData = action.payload;
          }
          state.currentPage = action.payload.meta.currentPage;
          state.hasMorePages = action.payload.meta.currentPage < action.payload.meta.totalPages;
        }
      )
      .addCase(fetchMoreCompanies.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchUserCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserCompanies.fulfilled,
        (state, action: PayloadAction<CompanyApiResponse>) => {
          state.loading = false;
          state.userCompaniesData = action.payload;
        }
      )
      .addCase(fetchUserCompanies.rejected, (state, action) => {
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
      })
      .addCase(updateCompanyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompanyData.fulfilled,
        (state, action: PayloadAction<CompanyItem>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(updateCompanyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { resetPagination } = companiesSlice.actions;

export const isMyCompany = () => (state: RootState) => {
  return state.company?.data?.users?.some(
    (userCompany) => userCompany.user.id === parseInt(state.auth.uid || '0')
  ) || false;
};
