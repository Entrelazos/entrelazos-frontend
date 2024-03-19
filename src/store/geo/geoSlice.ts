import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchCountries, fetchRegions } from './geoThunks';
import { CountryType, RegionType } from '../../types/geo/geoTypes';

interface CountryState {
  data: CountryType[] | null;
  loading: boolean;
  error: string | null;
}

interface RegionState {
  data: RegionType[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  data: null,
  loading: false,
  error: null,
};

const regionsInitialState: RegionState = {
  data: null,
  loading: false,
  error: null,
};

const coutriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCountries.fulfilled,
        (state, action: PayloadAction<CountryType[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const regionsSlice = createSlice({
  name: 'regions',
  initialState: regionsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRegions.fulfilled,
        (state, action: PayloadAction<RegionType[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default coutriesSlice.reducer;
