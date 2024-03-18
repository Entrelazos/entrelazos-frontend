import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchCountries } from './geoThunks';
import { CountryType } from '../../types/geo/geoTypes';

interface CountryState {
  data: CountryType[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
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

export default coutriesSlice.reducer;
