import { createSlice } from '@reduxjs/toolkit';
import { fetchCities, fetchCountries, fetchRegions } from './geoThunks';
import { CityType, CountryType, RegionType } from '../../types/geo/geoTypes';

interface DataState<T> {
  data: T[] | null;
  loading: boolean;
  error: string | null;
}

const createDataSlice = <T>(
  name: string,
  initialState: DataState<T>,
  fetchThunk: any
) => {
  return createSlice({
    name,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'An error occurred';
        });
    },
  });
};

const initialState: DataState<CountryType> = {
  data: null,
  loading: false,
  error: null,
};

const regionsInitialState: DataState<RegionType> = {
  data: null,
  loading: false,
  error: null,
};

const citiesInitialState: DataState<CityType> = {
  data: null,
  loading: false,
  error: null,
};

export const countriesSlice = createDataSlice(
  'countries',
  initialState,
  fetchCountries
);

export const regionsSlice = createDataSlice(
  'regions',
  regionsInitialState,
  fetchRegions
);

export const citiesSlice = createDataSlice(
  'cities',
  citiesInitialState,
  fetchCities
);
